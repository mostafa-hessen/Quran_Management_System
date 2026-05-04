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
    
    -- New variables for enhanced logging
    v_student_name TEXT;
    v_halaqa_name TEXT;
    v_dept_name TEXT;
    v_user_full_name TEXT;
    v_timestamp TEXT;
    v_details TEXT := '';
BEGIN
    -- Get performer name
    SELECT full_name INTO v_user_full_name FROM profiles WHERE id = auth.uid();
    v_user_full_name := COALESCE(v_user_full_name, 'نظام آلي');

    -- Format timestamp
    v_timestamp := to_char(NOW(), 'DD/MM/YYYY HH:MI:SS ') || CASE WHEN to_char(NOW(), 'AM') = 'AM' THEN 'ص' ELSE 'م' END;

    -- Map departments
    v_dept_name := CASE 
        WHEN v_table_name IN ('students', 'student_guardian_phones', 'enrollments', 'subscriptions') THEN 'قسم التسجيلات'
        WHEN v_table_name IN ('teachers', 'teacher_phones', 'teacher_emails', 'teacher_specializations', 'teacher_qualifications') THEN 'قسم شؤون المعلمين'
        WHEN v_table_name IN ('halaqat') THEN 'قسم شؤون الحلقات'
        WHEN v_table_name IN ('schedules', 'sessions') THEN 'قسم المواعيد'
        WHEN v_table_name IN ('payments') THEN 'قسم المالية'
        WHEN v_table_name IN ('memorization_progress', 'memorization_history', 'homework', 'homework_submissions') THEN 'قسم الشؤون التعليمية'
        ELSE 'عام'
    END;

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
            IF (v_old_data - 'updated_at' = v_new_data - 'updated_at') THEN
                RETURN NULL;
            END IF;
        END IF;
    END IF;

    -- Generate Human Readable Summary with details
    CASE v_table_name
        WHEN 'enrollments' THEN
            SELECT first_name INTO v_student_name FROM students WHERE student_id = (COALESCE(v_new_data, v_old_data)->>'student_id')::UUID;
            SELECT name INTO v_halaqa_name FROM halaqat WHERE halaqa_id = (COALESCE(v_new_data, v_old_data)->>'halaqa_id')::UUID;
            
            v_display_name := CASE v_action 
                WHEN 'INSERT' THEN 'تسجيل طالب في حلقة'
                WHEN 'UPDATE' THEN 'تعديل حالة تسجيل طالب'
                WHEN 'DELETE' THEN 'إلغاء تسجيل طالب من حلقة'
            END;
            
            v_details := '• الطالب: ' || COALESCE(v_student_name, 'غير معروف') || CHR(10) ||
                         '• الحلقة: ' || COALESCE(v_halaqa_name, 'غير معروف') || CHR(10);
            
            IF (v_action != 'DELETE') THEN
                v_details := v_details || '• تاريخ الانضمام: ' || COALESCE(v_new_data->>'enrollment_date', 'غير محدد') || CHR(10) ||
                                          '• حالة الاشتراك: ' || COALESCE(v_new_data->>'status', 'غير محدد');
            ELSE
                v_details := v_details || '• تاريخ الانضمام: ' || COALESCE(v_old_data->>'enrollment_date', 'غير محدد');
            END IF;

        WHEN 'schedules' THEN
            SELECT name INTO v_halaqa_name FROM halaqat WHERE halaqa_id = (COALESCE(v_new_data, v_old_data)->>'halaqa_id')::UUID;
            
            v_display_name := CASE v_action 
                WHEN 'INSERT' THEN 'إضافة موعد جديد لحلقة'
                WHEN 'UPDATE' THEN 'تعديل موعد حلقة'
                WHEN 'DELETE' THEN 'حذف موعد حلقة'
            END;
            
            v_details := '• الحلقة: ' || COALESCE(v_halaqa_name, 'غير معروف') || CHR(10);
            
            IF (v_action != 'DELETE') THEN
                v_details := v_details || '• اليوم: ' || COALESCE(v_new_data->>'day_of_week', 'غير محدد') || CHR(10) ||
                                          '• وقت البدء: ' || COALESCE(v_new_data->>'start_time', 'غير محدد') || CHR(10) ||
                                          '• وقت الانتهاء: ' || COALESCE(v_new_data->>'end_time', 'غير محدد');
            ELSE
                v_details := v_details || '• اليوم: ' || COALESCE(v_old_data->>'day_of_week', 'غير محدد');
            END IF;

        WHEN 'students' THEN 
            v_student_name := COALESCE(v_new_data->>'first_name', v_old_data->>'first_name', '');
            v_display_name := CASE v_action 
                WHEN 'INSERT' THEN 'إضافة طالب جديد'
                WHEN 'UPDATE' THEN 'تعديل بيانات طالب'
                WHEN 'DELETE' THEN 'حذف طالب'
            END;
            v_details := '• اسم الطالب: ' || v_student_name;

        WHEN 'halaqat' THEN
            v_halaqa_name := COALESCE(v_new_data->>'name', v_old_data->>'name', '');
            v_display_name := CASE v_action 
                WHEN 'INSERT' THEN 'إنشاء حلقة جديدة'
                WHEN 'UPDATE' THEN 'تعديل بيانات حلقة'
                WHEN 'DELETE' THEN 'حذف حلقة'
            END;
            v_details := '• اسم الحلقة: ' || v_halaqa_name;

        WHEN 'payments' THEN
            SELECT first_name INTO v_student_name FROM students WHERE student_id = (COALESCE(v_new_data, v_old_data)->>'student_id')::UUID;
            v_display_name := CASE v_action 
                WHEN 'INSERT' THEN 'تسجيل عملية دفع'
                WHEN 'UPDATE' THEN 'تعديل عملية دفع'
                WHEN 'DELETE' THEN 'حذف عملية دفع'
            END;
            v_details := '• الطالب: ' || COALESCE(v_student_name, 'غير معروف') || CHR(10) ||
                         '• المبلغ: ' || COALESCE(COALESCE(v_new_data, v_old_data)->>'amount', '0');
        
        WHEN 'memorization_progress' THEN
            SELECT first_name INTO v_student_name FROM students WHERE student_id = (COALESCE(v_new_data, v_old_data)->>'student_id')::UUID;
            v_display_name := 'تحديث تقدم الحفظ';
            v_details := '• الطالب: ' || COALESCE(v_student_name, 'غير معروف') || CHR(10) ||
                         '• السورة: ' || COALESCE(COALESCE(v_new_data, v_old_data)->>'surah', 'غير معروف') || CHR(10) ||
                         '• من آية: ' || COALESCE(COALESCE(v_new_data, v_old_data)->>'ayah_from', '1') || 
                         ' إلى آية: ' || COALESCE(COALESCE(v_new_data, v_old_data)->>'ayah_to', 'غير معروف');

        ELSE
            v_display_name := v_action || ' on ' || v_table_name;
            v_details := '• المعرف: ' || v_record_id;
    END CASE;

    -- Build final summary
    v_summary := 'تفاصيل العملية' || CHR(10) ||
                 v_dept_name || ' • ' || v_timestamp || CHR(10) ||
                 v_display_name || CHR(10) ||
                 v_details || CHR(10) ||
                 'بواسطة: ' || v_user_full_name;

    -- Insert into audit_log
    INSERT INTO audit_log (user_id, action, table_name, record_id, old_data, new_data, summary)
    VALUES (
        auth.uid(),
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
