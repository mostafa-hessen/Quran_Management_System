-- ================================================================
-- MIGRATION: مزامنة نظام الموظفين مع قاعدة البيانات المعيارية (Mapping)
-- ================================================================

-- 1. التأكد من وجود الأنواع (Enums) المطلوبة
DO $$ BEGIN
    CREATE TYPE public.contact_label AS ENUM ('شخصي', 'عمل', 'واتساب', 'منزل', 'أساسي', 'أخرى');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE public.specialization_type AS ENUM ('تجويد', 'حفظ', 'مراجعة', 'تلاوة', 'أخرى');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. تحديث هيكل جدول المعلمين ليتناسب مع التقسيم الجديد (الاسم الرباعي)
ALTER TABLE public.teachers 
  DROP COLUMN IF EXISTS full_name,
  DROP COLUMN IF EXISTS phone,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS specialization,
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS father_name TEXT,
  ADD COLUMN IF NOT EXISTS grandfather_name TEXT,
  ADD COLUMN IF NOT EXISTS family_name TEXT,
  ADD COLUMN IF NOT EXISTS tajweed_level TEXT;

-- 3. التأكد من وجود الجداول التابعة
CREATE TABLE IF NOT EXISTS public.teacher_phones (
    phone_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(teacher_id) ON DELETE CASCADE,
    phone      TEXT NOT NULL,
    label      public.contact_label DEFAULT 'شخصي'
);

CREATE TABLE IF NOT EXISTS public.teacher_emails (
    email_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(teacher_id) ON DELETE CASCADE,
    email      TEXT NOT NULL,
    label      public.contact_label DEFAULT 'شخصي'
);

CREATE TABLE IF NOT EXISTS public.teacher_specializations (
    spec_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(teacher_id) ON DELETE CASCADE,
    specialization public.specialization_type NOT NULL
);

CREATE TABLE IF NOT EXISTS public.teacher_qualifications (
    qual_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.teachers(teacher_id) ON DELETE CASCADE,
    qualification TEXT NOT NULL
);

-- 4. إعادة بناء دالة admin_setup_staff لتدعم النظام الموزع
CREATE OR REPLACE FUNCTION public.admin_setup_staff(
    p_user_id      UUID,
    p_first_name   TEXT,
    p_father_name  TEXT,
    p_grandfather_name TEXT,
    p_family_name  TEXT,
    p_email        TEXT,
    p_role         TEXT,
    p_phone        TEXT     DEFAULT NULL,
    p_hire_date    DATE     DEFAULT CURRENT_DATE,
    p_notes        TEXT     DEFAULT NULL,
    p_specializations TEXT[] DEFAULT ARRAY['حفظ'::TEXT], -- مصفوفة تخصصات
    p_tajweed_level  TEXT  DEFAULT 'متوسط',
    p_max_students   INT   DEFAULT 20
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_teacher_id UUID;
    v_caller_role TEXT;
    v_spec TEXT;
BEGIN
    -- التحقق من الصلاحية
    SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
    IF v_caller_role NOT IN ('admin', 'supervisor') THEN
        RAISE EXCEPTION 'غير مصرح لك بإجراء هذه العملية';
    END IF;

    -- إذا كان معلم، ننشئ سجلاته في الجداول المختلفة
    IF p_role = 'teacher' THEN
        -- التأكد من عدم وجود سجل قديم لنفس الـ user_id
        SELECT teacher_id INTO v_teacher_id FROM public.teachers WHERE profile_id = p_user_id;
        
        IF v_teacher_id IS NULL THEN
            INSERT INTO public.teachers (
                profile_id, first_name, father_name, grandfather_name, family_name,
                hire_date, status, notes, tajweed_level, max_students
            ) VALUES (
                p_user_id, p_first_name, p_father_name, p_grandfather_name, p_family_name,
                p_hire_date, 'active', p_notes, p_tajweed_level, p_max_students
            ) RETURNING teacher_id INTO v_teacher_id;
        ELSE
            UPDATE public.teachers SET
                first_name = p_first_name, father_name = p_father_name, 
                grandfather_name = p_grandfather_name, family_name = p_family_name,
                tajweed_level = p_tajweed_level, max_students = p_max_students,
                updated_at = NOW()
            WHERE teacher_id = v_teacher_id;
        END IF;

        -- إدارة الهواتف (إضافة الهاتف الأساسي)
        IF p_phone IS NOT NULL THEN
            DELETE FROM public.teacher_phones WHERE teacher_id = v_teacher_id;
            INSERT INTO public.teacher_phones (teacher_id, phone, label) VALUES (v_teacher_id, p_phone, 'أساسي');
        END IF;

        -- إدارة التخصصات (تفريغ ثم إعادة إضافة)
        DELETE FROM public.teacher_specializations WHERE teacher_id = v_teacher_id;
        FOREACH v_spec IN ARRAY p_specializations LOOP
            INSERT INTO public.teacher_specializations (teacher_id, specialization) 
            VALUES (v_teacher_id, v_spec::public.specialization_type);
        END LOOP;
        
        -- إدارة الإيميلات
        DELETE FROM public.teacher_emails WHERE teacher_id = v_teacher_id;
        INSERT INTO public.teacher_emails (teacher_id, email, label) VALUES (v_teacher_id, p_email, 'أساسي');
    END IF;

    -- تحديث البروفايل (الاسم الكامل يجمع للاستخدام السريع)
    INSERT INTO public.profiles (
        id, full_name, role, phone, teacher_id, status, hire_date, notes
    )
    VALUES (
        p_user_id, 
        TRIM(CONCAT_WS(' ', p_first_name, p_father_name, p_grandfather_name, p_family_name)),
        p_role, p_phone, v_teacher_id, 'active', p_hire_date, p_notes
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        teacher_id = COALESCE(EXCLUDED.teacher_id, public.profiles.teacher_id),
        hire_date = EXCLUDED.hire_date,
        notes = EXCLUDED.notes,
        updated_at = NOW();

    RETURN p_user_id;
END;
$$;
