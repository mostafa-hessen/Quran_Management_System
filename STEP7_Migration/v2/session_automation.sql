-- ================================================================
--  SESSION AUTOMATION — الجلسات التلقائية الكاملة
--  يُنفَّذ في Supabase SQL Editor بعد migration_v2.sql
-- ================================================================

-- ── ١. Trigger Function: ينشئ حضور المعلم تلقائياً ────────────
-- يُستدعى لما تُنشأ جلسة جديدة (سواء تلقائي أو يدوي)
CREATE OR REPLACE FUNCTION public.auto_create_teacher_attendance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_teacher_id UUID;
BEGIN
  -- جيب المعلم المسؤول عن الحلقة
  SELECT teacher_id INTO v_teacher_id
  FROM public.halaqat
  WHERE halaqa_id = NEW.halaqa_id
    AND teacher_id IS NOT NULL;

  -- لو في معلم مربوط — سجله حاضر كـ default
  IF v_teacher_id IS NOT NULL THEN
    INSERT INTO public.teacher_attendance (
      session_id,
      teacher_id,
      status,
      notes
    ) VALUES (
      NEW.session_id,
      v_teacher_id,
      'حاضر',  -- الافتراض: حاضر — السكرتيرة تعدل لو غاب
      NULL
    )
    ON CONFLICT (session_id, teacher_id) DO NOTHING;
    -- ON CONFLICT يمنع التكرار لو اتسمى يدوياً
  END IF;

  RETURN NEW;
END;
$$;

-- ربط الـ Trigger بجدول sessions
DROP TRIGGER IF EXISTS trg_auto_teacher_attendance ON public.sessions;
CREATE TRIGGER trg_auto_teacher_attendance
  AFTER INSERT ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_teacher_attendance();

-- ────────────────────────────────────────────────────────────────
-- ── ٢. pg_cron: توليد الجلسات كل يوم الفجر ────────────────────
-- ────────────────────────────────────────────────────────────────
-- تأكد إن pg_cron extension مفعّل في Supabase Dashboard أولاً
-- Database → Extensions → pg_cron → Enable

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- دالة توليد الجلسات اليومية
CREATE OR REPLACE FUNCTION public.generate_daily_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  -- أيام الأسبوع بالعربي (0=أحد، 1=اثنين، ... 6=سبت)
  v_today_name TEXT;
  v_today      DATE := CURRENT_DATE;
BEGIN
  -- تحويل رقم اليوم لاسم عربي (يُطابق قيم schedules.day_of_week)
  v_today_name := CASE EXTRACT(DOW FROM v_today)
    WHEN 0 THEN 'الأحد'
    WHEN 1 THEN 'الاثنين'
    WHEN 2 THEN 'الثلاثاء'
    WHEN 3 THEN 'الأربعاء'
    WHEN 4 THEN 'الخميس'
    WHEN 5 THEN 'الجمعة'
    WHEN 6 THEN 'السبت'
  END;

  -- إنشاء جلسة لكل حلقة عندها جدول اليوم ده
  INSERT INTO public.sessions (
    halaqa_id,
    session_date,
    status
  )
  SELECT
    s.halaqa_id,
    v_today,
    'scheduled'
  FROM public.schedules s
  -- الحلقة لازم تكون نشطة
  JOIN public.halaqat h ON h.halaqa_id = s.halaqa_id
    AND h.status = 'active'
  WHERE s.day_of_week = v_today_name
  -- تجنب التكرار لو اتشغلت مرتين
  ON CONFLICT DO NOTHING;

  -- الـ Trigger trg_auto_teacher_attendance هيشتغل تلقائياً
  -- وينشئ سجل حضور المعلم لكل جلسة جديدة

  RAISE NOTICE 'تم توليد جلسات يوم %: %', v_today_name, v_today;
END;
$$;

-- جدولة التشغيل كل يوم الساعة 12 ليلاً (منتصف الليل بتوقيت UTC)
-- عدّل الساعة حسب توقيتك (السعودية = UTC+3، يعني 12 ليل = 21:00 UTC)
SELECT cron.schedule(
  'generate-daily-sessions',   -- اسم الـ job
  '0 21 * * *',               -- كل يوم الساعة 21:00 UTC = 12 ليل KSA
  'SELECT public.generate_daily_sessions()'
);

-- للتحقق من الـ jobs المجدولة
-- SELECT * FROM cron.job;

-- ────────────────────────────────────────────────────────────────
-- ── ٣. Trigger: لما المعلم يتسجل غائب → إشعار تلقائي ──────────
-- ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.notify_on_teacher_absence()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session     RECORD;
  v_halaqa_name TEXT;
  v_admin_ids   UUID[];
BEGIN
  -- فقط لو الحالة اتغيرت لـ "غائب"
  IF NEW.status = 'غائب' AND (OLD.status IS NULL OR OLD.status != 'غائب') THEN

    -- جيب تفاصيل الجلسة والحلقة
    SELECT s.session_date, h.name INTO v_session, v_halaqa_name
    FROM public.sessions s
    JOIN public.halaqat h ON h.halaqa_id = s.halaqa_id
    WHERE s.session_id = NEW.session_id;

    -- جيب كل الـ admins
    SELECT ARRAY_AGG(id) INTO v_admin_ids
    FROM public.profiles
    WHERE role IN ('admin', 'supervisor')
      AND status = 'active';

    -- أرسل إشعار لكل admin
    INSERT INTO public.notifications (
      recipient_id, type, title, body,
      related_table, related_id
    )
    SELECT
      admin_id,
      'غياب',
      'غياب معلم عن حلقة',
      format(
        'المعلم غائب عن %s بتاريخ %s — يرجى تعيين بديل',
        v_halaqa_name,
        v_session.session_date::TEXT
      ),
      'sessions',
      NEW.session_id
    FROM UNNEST(v_admin_ids) AS admin_id;

  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_teacher_absence ON public.teacher_attendance;
CREATE TRIGGER trg_notify_teacher_absence
  AFTER INSERT OR UPDATE OF status ON public.teacher_attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_teacher_absence();

-- ────────────────────────────────────────────────────────────────
-- ── ٤. Trigger: لما الجلسة تتلغى → علّم الواجبات المرتبطة ─────
-- ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_session_cancellation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_teacher_profile_ids UUID[];
  v_halaqa_name         TEXT;
BEGIN
  -- فقط لو status اتغير لـ 'cancelled'
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN

    -- جيب اسم الحلقة
    SELECT name INTO v_halaqa_name
    FROM public.halaqat
    WHERE halaqa_id = NEW.halaqa_id;

    -- جيب معلمي الحلقة (عن طريق profile_id)
    SELECT ARRAY_AGG(t.profile_id) INTO v_teacher_profile_ids
    FROM public.teachers t
    WHERE t.teacher_id = (
      SELECT teacher_id FROM public.halaqat WHERE halaqa_id = NEW.halaqa_id
    ) AND t.profile_id IS NOT NULL;

    -- أرسل إشعار للمعلم إن جلسته ألغيت
    IF v_teacher_profile_ids IS NOT NULL THEN
      INSERT INTO public.notifications (
        recipient_id, type, title, body,
        related_table, related_id
      )
      SELECT
        profile_id,
        'جلسة_ملغاة',
        'تم إلغاء جلسة',
        format(
          'تم إلغاء جلسة %s بتاريخ %s — الواجبات المرتبطة بها تحتاج تأجيل',
          v_halaqa_name,
          NEW.session_date::TEXT
        ),
        'sessions',
        NEW.session_id
      FROM UNNEST(v_teacher_profile_ids) AS profile_id;
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

-- ────────────────────────────────────────────────────────────────
-- ── ٥. Trigger: لما تُضاف homework → submissions تلقائية ───────
-- ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.auto_create_homework_submissions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_halaqa_id UUID;
BEGIN
  -- جيب الحلقة من الجلسة
  SELECT halaqa_id INTO v_halaqa_id
  FROM public.sessions
  WHERE session_id = NEW.session_id;

  IF NEW.scope = 'general' THEN
    -- إنشاء submission لكل الطلاب المسجلين في الحلقة
    INSERT INTO public.homework_submissions (
      homework_id, student_id
    )
    SELECT
      NEW.homework_id,
      e.student_id
    FROM public.enrollments e
    WHERE e.halaqa_id = v_halaqa_id
      AND e.subscription_status = 'active'
    ON CONFLICT (homework_id, student_id) DO NOTHING;

  ELSIF NEW.scope = 'personal' AND NEW.student_id IS NOT NULL THEN
    -- إنشاء submission لطالب واحد فقط
    INSERT INTO public.homework_submissions (
      homework_id, student_id
    ) VALUES (
      NEW.homework_id, NEW.student_id
    )
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

-- ────────────────────────────────────────────────────────────────
-- ── ٦. تحقق من نجاح كل شيء ─────────────────────────────────────
-- ────────────────────────────────────────────────────────────────
DO $$
DECLARE
  triggers TEXT[] := ARRAY[
    'trg_auto_teacher_attendance',
    'trg_notify_teacher_absence',
    'trg_session_cancellation',
    'trg_auto_homework_submissions'
  ];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY triggers LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.triggers
      WHERE trigger_name = t
    ) THEN
      RAISE NOTICE '✓ Trigger: %', t;
    ELSE
      RAISE WARNING '✗ Trigger فشل: %', t;
    END IF;
  END LOOP;

  -- تحقق من pg_cron job
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'generate-daily-sessions') THEN
    RAISE NOTICE '✓ pg_cron: generate-daily-sessions';
  ELSE
    RAISE WARNING '✗ pg_cron job لم يُنشأ — تأكد من تفعيل extension';
  END IF;

  RAISE NOTICE '══════════════════════════════';
  RAISE NOTICE 'Session Automation جاهز';
END $$;
