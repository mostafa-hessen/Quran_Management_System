-- ================================================================
--  MIGRATION: تحديث جدول profiles لدعم نظام الموظفين المتكامل
--  تأكد من تنفيذه في Supabase SQL Editor
-- ================================================================

-- ── ١. إضافة الأعمدة الجديدة إلى جدول profiles ──────────────────

-- phone: رقم هاتف الموظف
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS hire_date DATE,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  -- teacher_id: يُربط تلقائياً عند إنشاء الموظف بدور teacher
  ADD COLUMN IF NOT EXISTS teacher_id UUID
    REFERENCES public.teachers(teacher_id) ON DELETE SET NULL;

-- Verify status column uses correct type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'status' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN status TEXT NOT NULL DEFAULT 'active'
      CHECK (status IN ('active', 'inactive', 'suspended'));
  END IF;
END $$;

-- ── ٢. Helper Function: للتحقق من الأدوار دون تكرار (Recursion) ──
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER -- يعمل بصلاحيات النظام لتخطي الحاجز المتكرر
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ── ٣. RLS Policies ──────────────────────────────────────────────

-- Allow users to read their own profile (Always allowed)
DROP POLICY IF EXISTS "user_read_own_profile" ON public.profiles;
CREATE POLICY "user_read_own_profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow admins to read ALL profiles
DROP POLICY IF EXISTS "admin_read_all_profiles" ON public.profiles;
CREATE POLICY "admin_read_all_profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Allow admins to insert/update profiles
DROP POLICY IF EXISTS "admin_write_profiles" ON public.profiles;
CREATE POLICY "admin_write_profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- ── ٣. Trigger: auto-create profile on auth.users insert ─────────
-- (safe to re-create)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'teacher'),
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop and recreate trigger to ensure it's fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── ٤. Index for fast lookups ─────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_teacher_id ON public.profiles(teacher_id);

COMMENT ON COLUMN public.profiles.teacher_id IS 'Foreign key to teachers table — set only when role = teacher';
COMMENT ON COLUMN public.profiles.hire_date IS 'تاريخ التعيين في المكتب';
