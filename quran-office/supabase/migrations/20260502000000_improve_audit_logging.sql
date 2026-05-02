-- ================================================================
--  MIGRATION: Improve Audit Logging & Fix Halaqa Deletion
-- ================================================================

-- ── ١. إصلاح حذف الحلقات عبر ON DELETE CASCADE ────────────────
-- Drop existing constraints
ALTER TABLE public.schedules
  DROP CONSTRAINT IF EXISTS schedules_halaqa_id_fkey;

ALTER TABLE public.enrollments
  DROP CONSTRAINT IF EXISTS enrollments_halaqa_id_fkey;

-- Add constraints with ON DELETE CASCADE
ALTER TABLE public.schedules
  ADD CONSTRAINT schedules_halaqa_id_fkey
  FOREIGN KEY (halaqa_id)
  REFERENCES public.halaqat(halaqa_id)
  ON DELETE CASCADE;

ALTER TABLE public.enrollments
  ADD CONSTRAINT enrollments_halaqa_id_fkey
  FOREIGN KEY (halaqa_id)
  REFERENCES public.halaqat(halaqa_id)
  ON DELETE CASCADE;

-- ── ٢. تحسين Audit Trigger لدعم كل الجداول ─────────────────────
-- استبدال التريجر السابق لدعم الجداول ذات المفاتيح المختلفة (ليس فقط id)
CREATE OR REPLACE FUNCTION public.audit_trigger_fn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  extracted_id UUID;
  old_json JSONB;
  new_json JSONB;
BEGIN
  -- Convert OLD and NEW to JSONB correctly using to_jsonb()
  IF TG_OP = 'DELETE' THEN
    old_json := to_jsonb(OLD);
    new_json := NULL;
  ELSIF TG_OP = 'INSERT' THEN
    old_json := NULL;
    new_json := to_jsonb(NEW);
  ELSE
    old_json := to_jsonb(OLD);
    new_json := to_jsonb(NEW);
  END IF;

  -- Attempt to extract the ID based on common Primary Key columns
  IF TG_OP = 'DELETE' THEN
    extracted_id := COALESCE(
      (old_json->>'id')::UUID,
      (old_json->>'halaqa_id')::UUID,
      (old_json->>'student_id')::UUID,
      (old_json->>'teacher_id')::UUID,
      (old_json->>'session_id')::UUID,
      (old_json->>'enrollment_id')::UUID,
      (old_json->>'payment_id')::UUID,
      (old_json->>'log_id')::UUID
    );
  ELSE
    extracted_id := COALESCE(
      (new_json->>'id')::UUID,
      (new_json->>'halaqa_id')::UUID,
      (new_json->>'student_id')::UUID,
      (new_json->>'teacher_id')::UUID,
      (new_json->>'session_id')::UUID,
      (new_json->>'enrollment_id')::UUID,
      (new_json->>'payment_id')::UUID,
      (new_json->>'log_id')::UUID
    );
  END IF;

  INSERT INTO public.audit_log (
    user_id, action, table_name, record_id, old_data, new_data
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    extracted_id,
    old_json,
    new_json
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- ── ٣. تفعيل Audit Log على جدول enrollments ────────────────────
-- التأكد من أن جدول enrollments مراقب ضمن الـ Audit
DROP TRIGGER IF EXISTS audit_enrollments ON public.enrollments;
CREATE TRIGGER audit_enrollments
  AFTER INSERT OR UPDATE OR DELETE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();

