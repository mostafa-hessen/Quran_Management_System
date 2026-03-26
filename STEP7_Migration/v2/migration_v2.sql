-- ================================================================
--  MIGRATION: إضافات قاعدة البيانات — مكتب تحفيظ القرآن
--  نفّذ في Supabase SQL Editor بالترتيب
-- ================================================================

-- ── ١. sessions — إضافة البديل وسبب الإلغاء ───────────────────
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS substitute_teacher_id UUID
    REFERENCES public.teachers(teacher_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

COMMENT ON COLUMN public.sessions.substitute_teacher_id
  IS 'المعلم البديل عند غياب الأصلي';
COMMENT ON COLUMN public.sessions.cancellation_reason
  IS 'سبب إلغاء الجلسة';

-- ── ٢. homework — نوع الواجب + نطاقه + موعد التسليم ───────────
ALTER TABLE public.homework
  ADD COLUMN IF NOT EXISTS type TEXT
    CHECK (type IN ('حفظ', 'مراجعة', 'تجويد', 'قراءة')),
  ADD COLUMN IF NOT EXISTS scope TEXT NOT NULL DEFAULT 'general'
    CHECK (scope IN ('general', 'personal')),
  ADD COLUMN IF NOT EXISTS student_id UUID
    REFERENCES public.students(student_id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS due_session_id UUID
    REFERENCES public.sessions(session_id) ON DELETE SET NULL;

-- Constraint: الواجب الخاص لازم مرتبط بطالب
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'chk_personal_student'
      AND table_name = 'homework'
  ) THEN
    ALTER TABLE public.homework
      ADD CONSTRAINT chk_personal_student
      CHECK (scope = 'general' OR student_id IS NOT NULL);
  END IF;
END $$;

COMMENT ON COLUMN public.homework.scope
  IS 'general = للحلقة كلها | personal = لطالب معين';
COMMENT ON COLUMN public.homework.due_session_id
  IS 'الجلسة التي يُتوقع فيها التسليم';

-- ── ٣. memorization_progress — جودة الحفظ + ربط بالجلسة ───────
ALTER TABLE public.memorization_progress
  ADD COLUMN IF NOT EXISTS quality TEXT
    CHECK (quality IN ('ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'ضعيف')),
  ADD COLUMN IF NOT EXISTS session_id UUID
    REFERENCES public.sessions(session_id) ON DELETE SET NULL;

-- ── ٤. memorization_history — تاريخ الحفظ (جديد) ─────────────
CREATE TABLE IF NOT EXISTS public.memorization_history (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID NOT NULL
                   REFERENCES public.students(student_id) ON DELETE CASCADE,
    teacher_id   UUID
                   REFERENCES public.teachers(teacher_id) ON DELETE SET NULL,
    session_id   UUID
                   REFERENCES public.sessions(session_id) ON DELETE SET NULL,
    surah        TEXT NOT NULL,
    ayah_from    INTEGER CHECK (ayah_from > 0),
    ayah_to      INTEGER CHECK (ayah_to > 0),
    pages_count  NUMERIC(5,1) CHECK (pages_count >= 0),
    quality      TEXT CHECK (quality IN ('ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'ضعيف')),
    notes        TEXT,
    recorded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_ayah_order CHECK (
      ayah_from IS NULL OR ayah_to IS NULL OR ayah_to >= ayah_from
    )
);

CREATE INDEX IF NOT EXISTS idx_mem_history_student
  ON public.memorization_history(student_id, recorded_at DESC);

COMMENT ON TABLE public.memorization_history
  IS 'تاريخ كل تحديثات الحفظ — memorization_progress للحالة الأخيرة فقط';

-- ── ٥. audit_log — سجل العمليات (جديد) ───────────────────────
CREATE TABLE IF NOT EXISTS public.audit_log (
    log_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action      TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    table_name  TEXT NOT NULL,
    record_id   UUID,
    old_data    JSONB,
    new_data    JSONB,
    ip_address  INET,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_table
  ON public.audit_log(table_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_user
  ON public.audit_log(user_id, created_at DESC);

-- Trigger Function يُسجَّل على الجداول المهمة
CREATE OR REPLACE FUNCTION public.audit_trigger_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_log (
    user_id, action, table_name, record_id, old_data, new_data
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    CASE
      WHEN TG_OP = 'DELETE' THEN (OLD::JSONB->>'id')::UUID
      ELSE (NEW::JSONB->>'id')::UUID
    END,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
         WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD)
         ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW)
         WHEN TG_OP = 'UPDATE' THEN to_jsonb(NEW)
         ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- تفعيل الـ Trigger على الجداول الحساسة
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'students', 'teachers', 'halaqat', 'sessions',
    'payments', 'subscriptions', 'homework_submissions'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS audit_%s ON public.%s;
       CREATE TRIGGER audit_%s
       AFTER INSERT OR UPDATE OR DELETE ON public.%s
       FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();',
      t, t, t, t
    );
  END LOOP;
END $$;

-- ── ٦. notifications — إشعارات النظام (جديد) ─────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id    UUID NOT NULL
                      REFERENCES public.profiles(id) ON DELETE CASCADE,
    type            TEXT NOT NULL CHECK (type IN (
                      'غياب', 'دفع_متأخر', 'واجب_مستحق',
                      'واجب_مجدد', 'جلسة_ملغاة', 'عام'
                    )),
    title           TEXT NOT NULL,
    body            TEXT,
    related_table   TEXT,
    related_id      UUID,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_recipient
  ON public.notifications(recipient_id, is_read, created_at DESC);

-- تفعيل Realtime للإشعارات
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ── ٧. report_cards — كشوفات الدرجات الدورية (جديد) ──────────
CREATE TABLE IF NOT EXISTS public.report_cards (
    card_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID NOT NULL
                      REFERENCES public.students(student_id) ON DELETE CASCADE,
    halaqa_id       UUID REFERENCES public.halaqat(halaqa_id) ON DELETE SET NULL,
    period_type     TEXT CHECK (period_type IN ('شهري', 'فصلي', 'سنوي')),
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    attendance_pct  NUMERIC(5,2) CHECK (attendance_pct BETWEEN 0 AND 100),
    hw_avg_score    NUMERIC(5,2) CHECK (hw_avg_score BETWEEN 0 AND 100),
    mem_pages_added NUMERIC(5,1),
    overall_grade   TEXT CHECK (overall_grade IN (
                      'ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'ضعيف'
                    )),
    teacher_notes   TEXT,
    issued_by       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_period_order CHECK (period_end > period_start),
    UNIQUE (student_id, period_start, period_type)
);

-- ── ٨. RLS Policies للجداول الجديدة ───────────────────────────

-- audit_log: Admin فقط يقرأ
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_read_audit" ON public.audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- notifications: كل مستخدم يقرأ إشعاراته فقط
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_notifications" ON public.notifications
  FOR ALL USING (recipient_id = auth.uid());

-- memorization_history: المعلم يقرأ طلاب حلقته
ALTER TABLE public.memorization_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teacher_read_mem_history" ON public.memorization_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ) OR EXISTS (
      SELECT 1
      FROM public.teachers t
      JOIN public.halaqat h ON h.teacher_id = t.teacher_id
      JOIN public.enrollments e ON e.halaqa_id = h.halaqa_id
      WHERE t.profile_id = auth.uid()
        AND e.student_id = memorization_history.student_id
    )
  );

-- ── ٩. Helper Function: حساب المبلغ المتبقي ───────────────────
CREATE OR REPLACE FUNCTION public.get_subscription_balance(p_subscription_id UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
AS $$
  SELECT
    s.total_amount - COALESCE(SUM(p.amount), 0)
  FROM public.subscriptions s
  LEFT JOIN public.payments p
    ON p.subscription_id = s.subscription_id
    AND p.status = 'completed'
  WHERE s.subscription_id = p_subscription_id
  GROUP BY s.total_amount;
$$;

COMMENT ON FUNCTION public.get_subscription_balance
  IS 'يرجع المبلغ المتبقي للاشتراك بعد طرح المدفوعات';

-- ── ١٠. تحقق من نجاح المحاولة ─────────────────────────────────
DO $$
DECLARE
  tables_to_check TEXT[] := ARRAY[
    'memorization_history', 'audit_log',
    'notifications', 'report_cards'
  ];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables_to_check LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = t
    ) THEN
      RAISE NOTICE '✓ %', t;
    ELSE
      RAISE WARNING '✗ فشل إنشاء: %', t;
    END IF;
  END LOOP;
  RAISE NOTICE '─────────────────────────────';
  RAISE NOTICE 'Migration اكتمل بنجاح';
END $$;
