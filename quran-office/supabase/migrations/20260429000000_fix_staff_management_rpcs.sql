-- ================================================================
-- MIGRATION: إصلاح وتطوير دوال إدارة الموظفين والمعلمين
-- ================================================================

-- ١. إصلاح دالة إعداد الموظف الجديد admin_setup_staff
-- معالجة خطأ Syntax في Migration السابق وإضافة دعم كامل للهواتف
CREATE OR REPLACE FUNCTION public.admin_setup_staff(
    p_user_id      UUID,
    p_first_name   TEXT,
    p_father_name  TEXT,
    p_grandfather_name TEXT,
    p_family_name  TEXT,
    p_email        TEXT,
    p_role         TEXT,
    p_phone        TEXT     DEFAULT NULL,
    p_phones       JSONB    DEFAULT '[]'::JSONB, -- للهواتف المتعددة
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
    -- التحقق من الصلاحية (admin أو supervisor)
    SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
    IF v_caller_role NOT IN ('admin', 'supervisor') THEN
        RAISE EXCEPTION 'unauthorized' USING ERRCODE = '42501';
    END IF;

    v_full_name := TRIM(CONCAT_WS(' ', p_first_name, p_father_name, p_grandfather_name, p_family_name));

    -- إذا كان معلم: نملأ جدول المعلمين التفصيلي
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
            father_name = EXCLUDED.father_name,
            grandfather_name = EXCLUDED.grandfather_name,
            family_name = EXCLUDED.family_name,
            tajweed_level = EXCLUDED.tajweed_level,
            birth_date = EXCLUDED.birth_date,
            notes = EXCLUDED.notes,
            updated_at = NOW()
        RETURNING teacher_id INTO v_teacher_id;

        -- إدارة الهواتف المتعددة للمعلم
        DELETE FROM public.teacher_phones WHERE teacher_id = v_teacher_id;
        IF jsonb_array_length(p_phones) > 0 THEN
            FOR v_phone_item IN SELECT * FROM jsonb_array_elements(p_phones) LOOP
                INSERT INTO public.teacher_phones (teacher_id, phone, label)
                VALUES (v_teacher_id, (v_phone_item->>'phone'), (v_phone_item->>'label')::public.contact_label);
            END LOOP;
        ELSIF p_phone IS NOT NULL THEN
            INSERT INTO public.teacher_phones (teacher_id, phone, label) VALUES (v_teacher_id, p_phone, 'أساسي');
        END IF;
        
        -- التخصصات للمعلم
        DELETE FROM public.teacher_specializations WHERE teacher_id = v_teacher_id;
        IF p_specializations IS NOT NULL AND array_length(p_specializations, 1) > 0 THEN
            FOR i IN 1 .. array_upper(p_specializations, 1) LOOP
                 INSERT INTO public.teacher_specializations (teacher_id, specialization) 
                 VALUES (v_teacher_id, p_specializations[i]::public.specialization_type);
            END LOOP;
        END IF;
        
        -- إدارة الإيميلات
        DELETE FROM public.teacher_emails WHERE teacher_id = v_teacher_id;
        INSERT INTO public.teacher_emails (teacher_id, email, label) VALUES (v_teacher_id, p_email, 'أساسي');
    END IF;

    -- تحديث البروفايل (البيانات الأساسية للموظف)
    INSERT INTO public.profiles (id, full_name, role, phone, hire_date, teacher_id, status, notes)
    VALUES (
        p_user_id, 
        v_full_name,
        p_role, 
        COALESCE(p_phone, (p_phones->0->>'phone')), -- هاتف واحد في البروفايل للوصول السريع
        p_hire_date,
        v_teacher_id, 'active', p_notes
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        hire_date = EXCLUDED.hire_date,
        teacher_id = COALESCE(EXCLUDED.teacher_id, public.profiles.teacher_id),
        notes = EXCLUDED.notes,
        updated_at = NOW();

    RETURN p_user_id;
END;
$$;

-- ٢. تحديث دالة تعديل الموظف admin_update_user لتشمل كافة الحقول
CREATE OR REPLACE FUNCTION public.admin_update_user(
    p_user_id      UUID,
    p_first_name   TEXT     DEFAULT NULL,
    p_father_name  TEXT     DEFAULT NULL,
    p_grandfather_name TEXT DEFAULT NULL,
    p_family_name  TEXT     DEFAULT NULL,
    p_role         TEXT     DEFAULT NULL,
    p_status       TEXT     DEFAULT NULL,
    p_phone        TEXT     DEFAULT NULL,
    p_phones       JSONB    DEFAULT NULL,
    p_notes        TEXT     DEFAULT NULL,
    p_specializations TEXT[] DEFAULT NULL,
    p_tajweed_level  TEXT   DEFAULT NULL,
    p_birth_date     DATE   DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_teacher_id UUID;
    v_caller_role TEXT;
    v_full_name TEXT;
    v_phone_item JSONB;
BEGIN
    -- التحقق من الصلاحية
    SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
    IF v_caller_role NOT IN ('admin', 'supervisor') THEN
        RAISE EXCEPTION 'unauthorized' USING ERRCODE = '42501';
    END IF;

    -- حماية المدير العام (المشرف لا يعدل على المدير)
    IF v_caller_role = 'supervisor' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id AND role = 'admin') THEN
        RAISE EXCEPTION 'supervisor_cannot_edit_admin' USING ERRCODE = 'P0001';
    END IF;

    -- تحديث البروفايل (البيانات العامة)
    UPDATE public.profiles SET
        role = COALESCE(p_role, role),
        status = COALESCE(p_status, status),
        phone = COALESCE(p_phone, (p_phones->0->>'phone'), phone),
        notes = COALESCE(p_notes, notes),
        updated_at = NOW()
    WHERE id = p_user_id
    RETURNING teacher_id INTO v_teacher_id;

    -- تحديث بيانات المعلم التفصيلية إن وجدت
    IF v_teacher_id IS NOT NULL THEN
        UPDATE public.teachers SET
            first_name = COALESCE(p_first_name, first_name),
            father_name = COALESCE(p_father_name, father_name),
            grandfather_name = COALESCE(p_grandfather_name, grandfather_name),
            family_name = COALESCE(p_family_name, family_name),
            tajweed_level = COALESCE(p_tajweed_level, tajweed_level),
            birth_date = COALESCE(p_birth_date, birth_date),
            notes = COALESCE(p_notes, notes),
            updated_at = NOW()
        WHERE teacher_id = v_teacher_id;

        -- تحديث الهواتف المتعددة
        IF p_phones IS NOT NULL THEN
            DELETE FROM public.teacher_phones WHERE teacher_id = v_teacher_id;
            IF jsonb_array_length(p_phones) > 0 THEN
                FOR v_phone_item IN SELECT * FROM jsonb_array_elements(p_phones) LOOP
                    INSERT INTO public.teacher_phones (teacher_id, phone, label)
                    VALUES (v_teacher_id, (v_phone_item->>'phone'), (v_phone_item->>'label')::public.contact_label);
                END LOOP;
            END IF;
        END IF;

        -- التخصصات
        IF p_specializations IS NOT NULL THEN
            DELETE FROM public.teacher_specializations WHERE teacher_id = v_teacher_id;
            IF array_length(p_specializations, 1) > 0 THEN
                FOR i IN 1 .. array_upper(p_specializations, 1) LOOP
                    INSERT INTO public.teacher_specializations (teacher_id, specialization)
                    VALUES (v_teacher_id, p_specializations[i]::public.specialization_type);
                END LOOP;
            END IF;
        END IF;
    END IF;

    -- تحديث الاسم الكامل المجمع في البروفايل
    v_full_name := TRIM(CONCAT_WS(' ', COALESCE(p_first_name, ''), COALESCE(p_father_name, ''), COALESCE(p_grandfather_name, ''), COALESCE(p_family_name, '')));
    IF v_full_name <> '' THEN
        UPDATE public.profiles SET full_name = v_full_name WHERE id = p_user_id;
    END IF;

END;
$$;
