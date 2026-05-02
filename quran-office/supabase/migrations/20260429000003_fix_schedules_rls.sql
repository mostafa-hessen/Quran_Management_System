-- ================================================================
-- MIGRATION: Fix RLS Policies for schedules table
-- ================================================================

-- 1. Ensure RLS is enabled
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "admin_manage_schedules" ON public.schedules;
DROP POLICY IF EXISTS "all_see_schedules" ON public.schedules;
DROP POLICY IF EXISTS "teacher_manage_own_schedules" ON public.schedules;
DROP POLICY IF EXISTS "allow_admin_all_schedules" ON public.schedules;
DROP POLICY IF EXISTS "allow_view_all_schedules" ON public.schedules;
DROP POLICY IF EXISTS "allow_teacher_manage_own_schedules" ON public.schedules;

-- 3. Define new policies using the get_my_role() pattern

-- Admin and Secretary can manage all schedules
CREATE POLICY "admin_manage_schedules" ON public.schedules
    FOR ALL 
    TO authenticated
    USING (
        get_my_role() IN ('admin', 'secretary', 'supervisor')
    )
    WITH CHECK (
        get_my_role() IN ('admin', 'secretary', 'supervisor')
    );

-- Everyone can see schedules
CREATE POLICY "all_see_schedules" ON public.schedules
    FOR SELECT 
    TO authenticated
    USING (true);

-- Teachers can manage schedules for their own halaqat
CREATE POLICY "teacher_manage_own_schedules" ON public.schedules
    FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.halaqat h
            JOIN public.profiles p ON p.teacher_id = h.teacher_id
            WHERE p.id = auth.uid() AND h.halaqa_id = schedules.halaqa_id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.halaqat h
            JOIN public.profiles p ON p.teacher_id = h.teacher_id
            WHERE p.id = auth.uid() AND h.halaqa_id = schedules.halaqa_id
        )
    );

COMMENT ON TABLE public.schedules IS 'RLS Fixed: Admin/Secretary/Supervisor manage all, Teachers manage own halaqat schedules.';
