-- ================================================================
-- MIGRATION: إضافة حقل البريد الإلكتروني لجدول البروفايلات وتحديث الربط
-- ================================================================

-- ١. إضافة عمود البريد الإلكتروني لجدول profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- ٢. تحديث دالة admin_setup_staff لتخزين البريد في البروفايل أيضاً
CREATE OR REPLACE FUNCTION public.admin_setup_staff(
    p_user_id      UUID,
    p_first_name   TEXT,
    p_father_name  TEXT,
    p_grandfather_name TEXT,
    p_family_name  TEXT,
    p_email        TEXT,
    p_role         TEXT,
    p_phone        TEXT     DEFAULT NULL,
    p_phones       JSONB    DEFAULT '[]'::JSONB,
    p_hire_date    DATE     DEFAULT CURRENT_DATE,
    p_notes        TEXT     DEFAULT NULL,
    p_specializations TEXT[] DEFAULT ARRAY['حفظ'::TEXT],
    p_tajweed_level  TEXT  DEFAULT 'متوسط',
    p_birth_date     DATE  DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_teacher_id UUID;
    v_phone_item JSONB;
    v_full_name TEXT;
    v_caller_role TEXT;
BEGIN
    -- التحقق من الصلاحية
    SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
    IF v_caller_role NOT IN ('admin', 'supervisor') THEN
        RAISE EXCEPTION 'unauthorized' USING ERRCODE = '42501';
    END IF;

    v_full_name := TRIM(CONCAT_WS(' ', p_first_name, p_father_name, p_grandfather_name, p_family_name));

    -- إذا كان معلم
    IF p_role = 'teacher' THEN
        INSERT INTO public.teachers (
            profile_id, first_name, father_name, grandfather_name, family_name,
            hire_date, status, notes, tajweed_level, birth_date
        ) VALUES (
            p_user_id, p_first_name, p_father_name, p_grandfather_name, p_family_name,
            p_hire_date, 'active', p_notes, p_tajweed_level, p_birth_date
        ) 
        ON CONFLICT (profile_id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            family_name = EXCLUDED.family_name,
            tajweed_level = EXCLUDED.tajweed_level,
            updated_at = NOW()
        RETURNING teacher_id INTO v_teacher_id;

        -- الهواتف
        DELETE FROM public.teacher_phones WHERE teacher_id = v_teacher_id;
        IF jsonb_array_length(p_phones) > 0 THEN
            FOR v_phone_item IN SELECT * FROM jsonb_array_elements(p_phones) LOOP
                INSERT INTO public.teacher_phones (teacher_id, phone, label)
                VALUES (v_teacher_id, (v_phone_item->>'phone'), (v_phone_item->>'label')::public.contact_label);
            END LOOP;
        ELSIF p_phone IS NOT NULL THEN
            INSERT INTO public.teacher_phones (teacher_id, phone, label) VALUES (v_teacher_id, p_phone, 'أساسي');
        END IF;
        
        -- التخصصات
        DELETE FROM public.teacher_specializations WHERE teacher_id = v_teacher_id;
        IF p_specializations IS NOT NULL THEN
            FOR i IN 1 .. array_upper(p_specializations, 1) LOOP
                 INSERT INTO public.teacher_specializations (teacher_id, specialization) 
                 VALUES (v_teacher_id, p_specializations[i]::public.specialization_type);
            END LOOP;
        END IF;
    END IF;

    -- تحديث البروفايل (مع إضافة الإيميل)
    INSERT INTO public.profiles (id, full_name, email, role, phone, hire_date, teacher_id, status, notes)
    VALUES (
        p_user_id, v_full_name, p_email, p_role, 
        COALESCE(p_phone, (p_phones->0->>'phone')), 
        p_hire_date, v_teacher_id, 'active', p_notes
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        hire_date = EXCLUDED.hire_date,
        teacher_id = COALESCE(EXCLUDED.teacher_id, public.profiles.teacher_id),
        updated_at = NOW();

    RETURN p_user_id;
END;
$$;
