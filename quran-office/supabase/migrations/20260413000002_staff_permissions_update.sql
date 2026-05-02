-- ================================================================
-- MIGRATION: تحديث صلاحيات إدارة الموظفين لتشمل السكرتارية
-- ================================================================

-- 1. تحديث دالة admin_setup_staff للسماح للمشرفين (السكرتارية) بالإدارة
CREATE OR REPLACE FUNCTION public.admin_setup_staff(
    p_user_id      UUID,
    p_full_name   TEXT,
    p_email       TEXT,
    p_role        TEXT,
    p_phone       TEXT     DEFAULT NULL,
    p_hire_date   DATE     DEFAULT CURRENT_DATE,
    p_notes       TEXT     DEFAULT NULL,
    p_specialization TEXT  DEFAULT 'حفظ',
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
BEGIN
    -- الحصول على دور الشخص الذي يقوم بالعملية
    SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();

    -- السماح للمدمن أو السوبر فايزر (السكرتير)
    IF v_caller_role NOT IN ('admin', 'supervisor') THEN
        RAISE EXCEPTION 'غير مصرح لك بإجراء هذه العملية. الصلاحيات المطلوبة: مدير نظام أو مشرف';
    END IF;

    -- قيد إضافي: السكرتير لا يمكنه إنشاء حساب "Admin"
    IF v_caller_role = 'supervisor' AND p_role = 'admin' THEN
        RAISE EXCEPTION 'لا يمكن للمشرف إنشاء حساب برتبة مدير نظام';
    END IF;

    -- 2. إذا كان الدور معلم، ننشئ سجل في جدول المعلمين أولاً
    IF p_role = 'teacher' THEN
        INSERT INTO public.teachers (
            full_name, phone, email, profile_id, 
            specialization, tajweed_level, max_students, 
            hire_date, status, notes
        )
        VALUES (
            p_full_name, p_phone, p_email, p_user_id,
            p_specialization, p_tajweed_level, p_max_students,
            p_hire_date, 'active', p_notes
        )
        RETURNING teacher_id INTO v_teacher_id;
    END IF;

    -- 3. تحديث/إنشاء البروفايل
    INSERT INTO public.profiles (
        id, full_name, role, phone, teacher_id, status, hire_date, notes
    )
    VALUES (
        p_user_id, p_full_name, p_role, p_phone, v_teacher_id, 'active', p_hire_date, p_notes
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

-- 2. تحديث دالة admin_update_user
CREATE OR REPLACE FUNCTION public.admin_update_user(
    p_user_id    UUID,
    p_full_name  TEXT     DEFAULT NULL,
    p_role       TEXT     DEFAULT NULL,
    p_status     TEXT     DEFAULT NULL,
    p_phone      TEXT     DEFAULT NULL,
    p_notes      TEXT     DEFAULT NULL,
    p_specialization TEXT DEFAULT NULL,
    p_tajweed_level  TEXT DEFAULT NULL,
    p_max_students   INT  DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_teacher_id UUID;
    v_caller_role TEXT;
    v_target_role TEXT;
BEGIN
    SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
    SELECT role INTO v_target_role FROM public.profiles WHERE id = p_user_id;

    -- التحقق من الصلاحية
    IF v_caller_role NOT IN ('admin', 'supervisor') THEN
        RAISE EXCEPTION 'غير مصرح لك بإكمال هذه العملية';
    END IF;

    -- السكرتير لا يمكنه تعديل حساب "Admin"
    IF v_caller_role = 'supervisor' AND v_target_role = 'admin' THEN
        RAISE EXCEPTION 'لا يمكن للمشرف تعديل حسابات مدراء النظام';
    END IF;

    -- تحديث البروفايل
    UPDATE public.profiles
    SET 
        full_name = COALESCE(p_full_name, full_name),
        role      = COALESCE(p_role, role),
        status    = COALESCE(p_status, status),
        phone     = COALESCE(p_phone, phone),
        notes     = COALESCE(p_notes, notes),
        updated_at = NOW()
    WHERE id = p_user_id
    RETURNING teacher_id INTO v_teacher_id;

    -- مزامنة جدول المعلمين
    IF v_teacher_id IS NOT NULL THEN
        UPDATE public.teachers
        SET
            full_name      = COALESCE(p_full_name, full_name),
            phone          = COALESCE(p_phone, phone),
            specialization = COALESCE(p_specialization, specialization),
            tajweed_level  = COALESCE(p_tajweed_level, tajweed_level),
            max_students   = COALESCE(p_max_students, max_students),
            status         = COALESCE(p_status, status),
            notes          = COALESCE(p_notes, notes),
            updated_at     = NOW()
        WHERE teacher_id = v_teacher_id;
    END IF;
END;
$$;
