-- ================================================================
--  SESSION AUTOMATION — FIXED VERSION
--  الجلسات التلقائية — نسخة مصححة
-- ================================================================

-- ── ١. Trigger: ينشئ حضور المعلم تلقائياً ────────────────────────
CREATE OR REPLACE FUNCTION public.auto_create_teacher_attendance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_teacher_id UUID;
BEGIN
  SELECT teacher_id INTO v_teacher_id
  FROM public.halaqat
  WHERE halaqa_id = NEW.halaqa_id
    AND teacher_id IS NOT NULL;

  IF v_teacher_id IS NOT NULL THEN
    INSERT INTO public.teacher_attendance (
      session_id, teacher_id, status
    ) VALUES (
      NEW.session_id, v_teacher_id, 'حاضر'
    )
    ON CONFLICT (session_id, teacher_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_teacher_attendance ON public.sessions;
CREATE TRIGGER trg_auto_teacher_attendance
  AFTER INSERT ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_teacher_attendance();

-- ── ٢. pg_cron: توليد الجلسات كل يوم ────────────────────────────
CREATE OR REPLACE FUNCTION public.generate_daily_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today_name TEXT;
  v_today      DATE := CURRENT_DATE;
BEGIN
  v_today_name := CASE EXTRACT(DOW FROM v_today)
    WHEN 0 THEN 'الأحد'
    WHEN 1 THEN 'الاثنين'
    WHEN 2 THEN 'الثلاثاء'
    WHEN 3 THEN 'الأربعاء'
    WHEN 4 THEN 'الخميس'
    WHEN 5 THEN 'الجمعة'
    WHEN 6 THEN 'السبت'
  END;

  INSERT INTO public.sessions (halaqa_id, session_date, status)
  SELECT s.halaqa_id, v_today, 'scheduled'
  FROM public.schedules s
  JOIN public.halaqat h ON h.halaqa_id = s.halaqa_id AND h.status = 'active'
  WHERE s.day_of_week = v_today_name
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'تم توليد جلسات يوم %: %', v_today_name, v_today;
END;
$$;

-- SELECT cron.schedule(
--   'generate-daily-sessions',
--   '0 21 * * *',
--   'SELECT public.generate_daily_sessions()'
-- );

-- ── ٣. Trigger: غياب المعلم → إشعار ─────────────────────────────
-- الإصلاح: فصل المتغيرات بدل INTO مزدوج
CREATE OR REPLACE FUNCTION public.notify_on_teacher_absence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session_date DATE;
  v_halaqa_name  TEXT;
  v_admin_ids    UUID[];
BEGIN
  IF NEW.status = 'غائب' AND (OLD.status IS NULL OR OLD.status != 'غائب') THEN

    -- ✅ الإصلاح: متغير منفصل لكل عمود بدل record variable
    SELECT s.session_date INTO v_session_date
    FROM public.sessions s
    WHERE s.session_id = NEW.session_id;

    SELECT h.name INTO v_halaqa_name
    FROM public.sessions s
    JOIN public.halaqat h ON h.halaqa_id = s.halaqa_id
    WHERE s.session_id = NEW.session_id;

    SELECT ARRAY_AGG(id) INTO v_admin_ids
    FROM public.profiles
    WHERE role IN ('admin', 'supervisor') AND status = 'active';

    IF v_admin_ids IS NOT NULL THEN
      INSERT INTO public.notifications (
        recipient_id, type, title, body, related_table, related_id
      )
      SELECT
        admin_id,
        'غياب',
        'غياب معلم عن حلقة',
        format(
          'المعلم غائب عن %s بتاريخ %s — يرجى تعيين بديل',
          v_halaqa_name,
          v_session_date::TEXT
        ),
        'sessions',
        NEW.session_id
      FROM UNNEST(v_admin_ids) AS admin_id;
    END IF;

  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_teacher_absence ON public.teacher_attendance;
CREATE TRIGGER trg_notify_teacher_absence
  AFTER INSERT OR UPDATE OF status ON public.teacher_attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_teacher_absence();

-- ── ٤. Trigger: إلغاء الجلسة → إشعار ────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_session_cancellation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_halaqa_name        TEXT;
  v_teacher_profile_id UUID;
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN

    SELECT h.name INTO v_halaqa_name
    FROM public.halaqat h
    WHERE h.halaqa_id = NEW.halaqa_id;

    SELECT t.profile_id INTO v_teacher_profile_id
    FROM public.teachers t
    JOIN public.halaqat h ON h.teacher_id = t.teacher_id
    WHERE h.halaqa_id = NEW.halaqa_id
      AND t.profile_id IS NOT NULL
    LIMIT 1;

    IF v_teacher_profile_id IS NOT NULL THEN
      INSERT INTO public.notifications (
        recipient_id, type, title, body, related_table, related_id
      ) VALUES (
        v_teacher_profile_id,
        'جلسة_ملغاة',
        'تم إلغاء جلسة',
        format(
          'تم إلغاء جلسة %s بتاريخ %s',
          v_halaqa_name,
          NEW.session_date::TEXT
        ),
        'sessions',
        NEW.session_id
      );
    END IF;

  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_session_cancellation ON public.sessions;
CREATE TRIGGER trg_session_cancellation
  AFTER UPDATE OF status ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_session_cancellation();

-- ── ٥. Trigger: إضافة واجب → submissions تلقائية ─────────────────
CREATE OR REPLACE FUNCTION public.auto_create_homework_submissions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_halaqa_id UUID;
BEGIN
  SELECT halaqa_id INTO v_halaqa_id
  FROM public.sessions
  WHERE session_id = NEW.session_id;

  IF NEW.scope = 'general' THEN
    INSERT INTO public.homework_submissions (homework_id, student_id)
    SELECT NEW.homework_id, e.student_id
    FROM public.enrollments e
    WHERE e.halaqa_id = v_halaqa_id
      AND e.subscription_status = 'active'
    ON CONFLICT (homework_id, student_id) DO NOTHING;

  ELSIF NEW.scope = 'personal' AND NEW.student_id IS NOT NULL THEN
    INSERT INTO public.homework_submissions (homework_id, student_id)
    VALUES (NEW.homework_id, NEW.student_id)
    ON CONFLICT (homework_id, student_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_homework_submissions ON public.homework;
CREATE TRIGGER trg_auto_homework_submissions
  AFTER INSERT ON public.homework
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_homework_submissions();

-- ── تحقق من النجاح ────────────────────────────────────────────────
DO $$
DECLARE
  t TEXT;
  triggers TEXT[] := ARRAY[
    'trg_auto_teacher_attendance',
    'trg_notify_teacher_absence',
    'trg_session_cancellation',
    'trg_auto_homework_submissions'
  ];
BEGIN
  FOREACH t IN ARRAY triggers LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.triggers WHERE trigger_name = t
    ) THEN
      RAISE NOTICE '✓ %', t;
    ELSE
      RAISE WARNING '✗ فشل: %', t;
    END IF;
  END LOOP;

  -- IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'generate-daily-sessions') THEN
  --   RAISE NOTICE '✓ pg_cron: generate-daily-sessions';
  -- ELSE
  --   RAISE WARNING '✗ pg_cron job لم يُنشأ';
  -- END IF;

  RAISE NOTICE '══ Session Automation جاهز ══';
END $$;