-- ================================================================
-- MIGRATION: تحديث دوال التعديل والحذف لتتوافق مع الهيكل المعياري
-- ================================================================

-- ١. تحديث دالة التعديل admin_update_user
CREATE OR REPLACE FUNCTION public.admin_update_user(
    p_user_id      UUID,
    p_first_name   TEXT     DEFAULT NULL,
    p_father_name  TEXT     DEFAULT NULL,
    p_grandfather_name TEXT DEFAULT NULL,
    p_family_name  TEXT     DEFAULT NULL,
    p_role         TEXT     DEFAULT NULL,
    p_status       TEXT     DEFAULT NULL,
    p_phone        TEXT     DEFAULT NULL,
    p_notes        TEXT     DEFAULT NULL,
    p_specializations TEXT[] DEFAULT NULL,
    p_tajweed_level  TEXT   DEFAULT NULL,
    p_max_students   INT    DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_teacher_id UUID;
    v_caller_role TEXT;
    v_spec TEXT;
    v_full_name TEXT;
BEGIN
    -- التحقق من الصلاحية (admin أو supervisor)
    SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
    IF v_caller_role NOT IN ('admin', 'supervisor') THEN
        RAISE EXCEPTION 'غير مصرح لك بإجراء هذه العملية';
    END IF;

    -- حماية رتبة الأدمن (المشرف لا يعدل على الأدمن)
    IF v_caller_role = 'supervisor' THEN
        IF EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id AND role = 'admin') THEN
            RAISE EXCEPTION 'لا يمكنك تعديل بيانات مدير النظام';
        END IF;
    END IF;

    -- تجهيز الاسم الكامل المدمج للبروفايل
    SELECT TRIM(CONCAT_WS(' ', 
        COALESCE(p_first_name, first_name), 
        COALESCE(p_father_name, father_name), 
        COALESCE(p_grandfather_name, grandfather_name), 
        COALESCE(p_family_name, family_name)
    )) INTO v_full_name 
    FROM (SELECT first_name, father_name, grandfather_name, family_name FROM public.teachers WHERE profile_id = p_user_id) t;

    -- تحديث البروفايل
    UPDATE public.profiles
    SET 
        full_name = COALESCE(v_full_name, full_name),
        role      = COALESCE(p_role, role),
        status    = COALESCE(p_status, status),
        phone     = COALESCE(p_phone, phone),
        notes     = COALESCE(p_notes, notes),
        updated_at = NOW()
    WHERE id = p_user_id
    RETURNING teacher_id INTO v_teacher_id;

    -- إذا كان معلم، تحديث الجداول المرتبطة
    IF v_teacher_id IS NOT NULL THEN
        UPDATE public.teachers
        SET
            first_name      = COALESCE(p_first_name, first_name),
            father_name     = COALESCE(p_father_name, father_name),
            grandfather_name = COALESCE(p_grandfather_name, grandfather_name),
            family_name     = COALESCE(p_family_name, family_name),
            tajweed_level   = COALESCE(p_tajweed_level, tajweed_level),
            max_students    = COALESCE(p_max_students, max_students),
            status          = COALESCE(p_status, status),
            notes           = COALESCE(p_notes, notes),
            updated_at      = NOW()
        WHERE teacher_id = v_teacher_id;

        -- تحديث التخصصات إذا أرسلت
        IF p_specializations IS NOT NULL THEN
            DELETE FROM public.teacher_specializations WHERE teacher_id = v_teacher_id;
            FOREACH v_spec IN ARRAY p_specializations LOOP
                INSERT INTO public.teacher_specializations (teacher_id, specialization) 
                VALUES (v_teacher_id, v_spec::public.specialization_type);
            END LOOP;
        END IF;

        -- تحديث الهاتف الأساسي
        IF p_phone IS NOT NULL THEN
            UPDATE public.teacher_phones SET phone = p_phone WHERE teacher_id = v_teacher_id AND label = 'أساسي';
            IF NOT FOUND THEN
                INSERT INTO public.teacher_phones (teacher_id, phone, label) VALUES (v_teacher_id, p_phone, 'أساسي');
            END IF;
        END IF;
    END IF;
END;
$$;

-- ٢. تحديث دالة الحذف admin_delete_user
CREATE OR REPLACE FUNCTION public.admin_delete_user(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_caller_role TEXT;
BEGIN
    SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
    IF v_caller_role NOT IN ('admin', 'supervisor') THEN
        RAISE EXCEPTION 'صلاحيات غير كافية';
    END IF;

    -- حماية الأدمن
    IF v_caller_role = 'supervisor' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id AND role = 'admin') THEN
        RAISE EXCEPTION 'لا يمكن للمشرف إيقاف حساب المدير';
    END IF;

    UPDATE public.profiles SET status = 'inactive' WHERE id = p_user_id;
    UPDATE public.teachers SET status = 'inactive' WHERE profile_id = p_user_id;
END;
$$;
