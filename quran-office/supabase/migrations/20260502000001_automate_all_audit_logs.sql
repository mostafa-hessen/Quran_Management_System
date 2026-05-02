-- Update the audit trigger function to be more comprehensive and generate human-readable summaries
CREATE OR REPLACE FUNCTION audit_trigger_fn()
RETURNS TRIGGER AS $$
DECLARE
    v_old_data JSONB := NULL;
    v_new_data JSONB := NULL;
    v_record_id UUID;
    v_summary TEXT;
    v_table_name TEXT := TG_TABLE_NAME;
    v_action TEXT := TG_OP;
    v_display_name TEXT;
BEGIN
    -- Extract Record ID based on table
    IF (v_action = 'DELETE') THEN
        v_old_data := to_jsonb(OLD);
        v_record_id := COALESCE(
            (v_old_data->>'student_id')::UUID,
            (v_old_data->>'teacher_id')::UUID,
            (v_old_data->>'halaqa_id')::UUID,
            (v_old_data->>'subscription_id')::UUID,
            (v_old_data->>'payment_id')::UUID,
            (v_old_data->>'enrollment_id')::UUID,
            (v_old_data->>'phone_id')::UUID,
            (v_old_data->>'schedule_id')::UUID,
            (v_old_data->>'session_id')::UUID,
            (v_old_data->>'homework_id')::UUID,
            (v_old_data->>'submission_id')::UUID,
            (v_old_data->>'id')::UUID
        );
    ELSE
        v_new_data := to_jsonb(NEW);
        v_record_id := COALESCE(
            (v_new_data->>'student_id')::UUID,
            (v_new_data->>'teacher_id')::UUID,
            (v_new_data->>'halaqa_id')::UUID,
            (v_new_data->>'subscription_id')::UUID,
            (v_new_data->>'payment_id')::UUID,
            (v_new_data->>'enrollment_id')::UUID,
            (v_new_data->>'phone_id')::UUID,
            (v_new_data->>'schedule_id')::UUID,
            (v_new_data->>'session_id')::UUID,
            (v_new_data->>'homework_id')::UUID,
            (v_new_data->>'submission_id')::UUID,
            (v_new_data->>'id')::UUID
        );
        IF (v_action = 'UPDATE') THEN
            v_old_data := to_jsonb(OLD);
            
            -- Filter out unchanged fields to keep logs clean
            -- If no data actually changed (ignoring updated_at), don't log
            IF (v_old_data - 'updated_at' = v_new_data - 'updated_at') THEN
                RETURN NULL;
            END IF;
        END IF;
    END IF;

    -- Generate Human Readable Summary
    CASE v_table_name
        WHEN 'students' THEN 
            v_display_name := COALESCE(v_new_data->>'first_name', v_old_data->>'first_name', '');
            v_summary := CASE v_action 
                WHEN 'INSERT' THEN 'إضافة طالب جديد: ' || v_display_name
                WHEN 'UPDATE' THEN 'تعديل بيانات الطالب: ' || v_display_name
                WHEN 'DELETE' THEN 'حذف الطالب: ' || v_display_name
            END;
        WHEN 'student_guardian_phones' THEN
            -- Fetch student name for more context
            SELECT first_name INTO v_display_name 
            FROM students 
            WHERE student_id = COALESCE((v_new_data->>'student_id')::UUID, (v_old_data->>'student_id')::UUID);
            
            v_summary := CASE v_action 
                WHEN 'INSERT' THEN 'إضافة رقم هاتف لولي أمر الطالب: ' || COALESCE(v_display_name, 'غير معروف')
                WHEN 'UPDATE' THEN 'تعديل رقم هاتف لولي أمر الطالب: ' || COALESCE(v_display_name, 'غير معروف')
                WHEN 'DELETE' THEN 'حذف رقم هاتف لولي أمر الطالب: ' || COALESCE(v_display_name, 'غير معروف')
            END;
        WHEN 'teachers' THEN
            v_display_name := COALESCE(v_new_data->>'family_name', v_old_data->>'family_name', '');
            v_summary := CASE v_action 
                WHEN 'INSERT' THEN 'إضافة معلم جديد: ' || v_display_name
                WHEN 'UPDATE' THEN 'تعديل بيانات المعلم: ' || v_display_name
                WHEN 'DELETE' THEN 'حذف المعلم: ' || v_display_name
            END;
        WHEN 'halaqat' THEN
            v_display_name := COALESCE(v_new_data->>'name', v_old_data->>'name', '');
            v_summary := CASE v_action 
                WHEN 'INSERT' THEN 'إنشاء حلقة جديدة: ' || v_display_name
                WHEN 'UPDATE' THEN 'تعديل بيانات الحلقة: ' || v_display_name
                WHEN 'DELETE' THEN 'حذف الحلقة: ' || v_display_name
            END;
        WHEN 'subscriptions' THEN
            v_summary := CASE v_action 
                WHEN 'INSERT' THEN 'تسجيل اشتراك جديد'
                WHEN 'UPDATE' THEN 'تعديل اشتراك'
                WHEN 'DELETE' THEN 'إلغاء اشتراك'
            END;
        WHEN 'payments' THEN
            v_summary := CASE v_action 
                WHEN 'INSERT' THEN 'تسجيل عملية دفع بمبلغ ' || (v_new_data->>'amount')
                WHEN 'UPDATE' THEN 'تعديل بيانات عملية دفع'
                WHEN 'DELETE' THEN 'حذف عملية دفع'
            END;
        WHEN 'enrollments' THEN
            v_summary := CASE v_action 
                WHEN 'INSERT' THEN 'تسجيل طالب في حلقة'
                WHEN 'UPDATE' THEN 'تعديل حالة تسجيل طالب'
                WHEN 'DELETE' THEN 'إلغاء تسجيل طالب من حلقة'
            END;
        WHEN 'schedules' THEN
            v_summary := CASE v_action 
                WHEN 'INSERT' THEN 'إضافة موعد جديد لحلقة'
                WHEN 'UPDATE' THEN 'تعديل موعد حلقة'
                WHEN 'DELETE' THEN 'حذف موعد حلقة'
            END;
        ELSE
            v_summary := v_action || ' on ' || v_table_name;
    END CASE;

    -- Insert into audit_log
    INSERT INTO audit_log (user_id, action, table_name, record_id, old_data, new_data, summary)
    VALUES (
        (auth.jwt()->>'sub')::UUID,
        v_action,
        v_table_name,
        v_record_id,
        v_old_data,
        v_new_data,
        v_summary
    );

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to all relevant tables
-- Drop existing triggers first to avoid duplication
DO $$
DECLARE
    t text;
    tables_to_audit text[] := ARRAY[
        'students', 'teachers', 'profiles', 'halaqat', 'subscriptions', 
        'payments', 'schedules', 'enrollments', 'student_guardian_phones',
        'memorization_progress', 'sessions', 'homework', 'homework_submissions',
        'teacher_phones', 'teacher_emails', 'teacher_specializations', 'teacher_qualifications'
    ];
BEGIN
    FOREACH t IN ARRAY tables_to_audit LOOP
        -- Drop both naming conventions to ensure no duplicates exist
        EXECUTE format('DROP TRIGGER IF EXISTS audit_trigger ON %I', t);
        EXECUTE format('DROP TRIGGER IF EXISTS audit_%I ON %I', t, t);
        
        EXECUTE format('CREATE TRIGGER audit_trigger AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn()', t);
    END LOOP;
END $$;
