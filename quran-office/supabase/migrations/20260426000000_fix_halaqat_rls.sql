-- ================================================================
-- MIGRATION: إصلاح صلاحيات الوصول (RLS) للحلقات والتسجيل والمواعيد
-- ================================================================

-- 1. تفعيل RLS للجداول إذا لم تكن مفعلة
ALTER TABLE public.halaqat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- 2. حذف السياسات القديمة (لتجنب التكرار أو التعارض)
DROP POLICY IF EXISTS "allow_admin_all_halaqat" ON public.halaqat;
DROP POLICY IF EXISTS "allow_teacher_view_all_halaqat" ON public.halaqat;
DROP POLICY IF EXISTS "allow_teacher_manage_own_halaqat" ON public.halaqat;

DROP POLICY IF EXISTS "allow_admin_all_enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "allow_teacher_manage_own_enrollments" ON public.enrollments;

DROP POLICY IF EXISTS "allow_admin_all_schedules" ON public.schedules;
DROP POLICY IF EXISTS "allow_teacher_manage_own_schedules" ON public.schedules;

-- 3. سياسات جدول halaqat (الحلقات)
-- الأدمن له كامل الصلاحيات
CREATE POLICY "allow_admin_all_halaqat" ON public.halaqat
    FOR ALL USING (public.is_admin());

-- الجميع (المسجلين) يمكنهم رؤية الحلقات
CREATE POLICY "allow_teacher_view_all_halaqat" ON public.halaqat
    FOR SELECT USING (auth.role() = 'authenticated');

-- المعلم يمكنه تعديل حلقته الخاصة فقط
CREATE POLICY "allow_teacher_manage_own_halaqat" ON public.halaqat
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND teacher_id = halaqat.teacher_id
        )
    );

-- 4. سياسات جدول enrollments (التسجيل في الحلقات)
-- الأدمن له كامل الصلاحيات
CREATE POLICY "allow_admin_all_enrollments" ON public.enrollments
    FOR ALL USING (public.is_admin());

-- المعلم يمكنه إدارة تسجيلات الطلاب في حلقاته فقط
CREATE POLICY "allow_teacher_manage_own_enrollments" ON public.enrollments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.halaqat h
            JOIN public.profiles p ON p.teacher_id = h.teacher_id
            WHERE p.id = auth.uid() AND h.halaqa_id = enrollments.halaqa_id
        )
    );

-- 5. سياسات جدول schedules (المواعيد)
-- الأدمن له كامل الصلاحيات
CREATE POLICY "allow_admin_all_schedules" ON public.schedules
    FOR ALL USING (public.is_admin());

-- الجميع يمكنهم رؤية المواعيد
CREATE POLICY "allow_view_all_schedules" ON public.schedules
    FOR SELECT USING (auth.role() = 'authenticated');

-- المعلم يمكنه إدارة مواعيد حلقاته فقط
CREATE POLICY "allow_teacher_manage_own_schedules" ON public.schedules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.halaqat h
            JOIN public.profiles p ON p.teacher_id = h.teacher_id
            WHERE p.id = auth.uid() AND h.halaqa_id = schedules.halaqa_id
        )
    );

COMMENT ON TABLE public.halaqat IS 'جدول الحلقات القرآنية مع تفعيل RLS للأدمن والمعلمين';
COMMENT ON TABLE public.enrollments IS 'جدول تسجيل الطلاب في الحلقات مع تفعيل RLS للمعلمين لإدارة طلابهم';
