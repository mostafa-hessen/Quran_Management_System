-- Fix guardian phone duplicates and cleanup audit logs

-- 1. Add unique constraint to student_guardian_phones if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_student_phone'
    ) THEN
        ALTER TABLE public.student_guardian_phones 
        ADD CONSTRAINT unique_student_phone UNIQUE (student_id, phone);
    END IF;
END $$;

-- 2. Enable RLS for report_cards (Security Fix)
ALTER TABLE public.report_cards ENABLE ROW LEVEL SECURITY;

-- Add basic policies for report_cards if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'report_cards' AND policyname = 'Admin can manage all report cards') THEN
        CREATE POLICY "Admin can manage all report cards" ON public.report_cards
        FOR ALL TO authenticated
        USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;
END $$;

-- 3. Cleanup redundant triggers to prevent duplicate logs
-- This drops potential old-style triggers that might still exist
DROP TRIGGER IF EXISTS audit_students ON public.students;
DROP TRIGGER IF EXISTS audit_teachers ON public.teachers;
DROP TRIGGER IF EXISTS audit_halaqat ON public.halaqat;
DROP TRIGGER IF EXISTS audit_student_guardian_phones ON public.student_guardian_phones;

-- 4. Ensure the new unified audit_trigger is applied correctly
-- We re-apply it to be sure everything is clean

-- Function to safely apply audit trigger
CREATE OR REPLACE FUNCTION public.apply_audit_to_table(tbl_name text)
RETURNS void AS $$
BEGIN
    -- Drop both possible naming conventions just in case
    EXECUTE format('DROP TRIGGER IF EXISTS audit_trigger_event ON %I', tbl_name);
    EXECUTE format('DROP TRIGGER IF EXISTS audit_trigger ON %I', tbl_name);
    
    -- Create the new trigger
    EXECUTE format('
        CREATE TRIGGER audit_trigger
        AFTER INSERT OR UPDATE OR DELETE ON %I
        FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn()', tbl_name);
END;
$$ LANGUAGE plpgsql;

-- Apply to main tables
SELECT public.apply_audit_to_table('students');
SELECT public.apply_audit_to_table('teachers');
SELECT public.apply_audit_to_table('halaqat');
SELECT public.apply_audit_to_table('student_guardian_phones');
SELECT public.apply_audit_to_table('enrollments');
SELECT public.apply_audit_to_table('subscriptions');
SELECT public.apply_audit_to_table('payments');

-- Cleanup helper function
DROP FUNCTION public.apply_audit_to_table(text);
