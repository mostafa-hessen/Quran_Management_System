import { supabase } from '@/shared/lib/supabase';
import type { Subscription, Payment, CreateSubscriptionInput, CreatePaymentInput, OverdueStudent } from '../types';

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const getSubscriptions = async (): Promise<Subscription[]> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      student:students (
        student_id, first_name, father_name, family_name,
        student_guardian_phones (phone)
      ),
      payments (payment_id, amount, status, payment_date, method, receipt_number)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((s: any) => ({
    ...s,
    paid_amount: (s.payments || [])
      .filter((p: Payment) => p.status === 'completed')
      .reduce((sum: number, p: Payment) => sum + Number(p.amount), 0),
    student: s.student
      ? { 
          ...s.student, 
          full_name: `${s.student.first_name} ${s.student.father_name || ''} ${s.student.family_name}`.trim(),
          phones: s.student.student_guardian_phones?.map((p: any) => p.phone) || []
        }
      : undefined,
  }));
};

export const createSubscription = async (input: CreateSubscriptionInput): Promise<Subscription> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateSubscriptionStatus = async (id: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('subscriptions')
    .update({ status })
    .eq('subscription_id', id);

  if (error) throw new Error(error.message);
};

export const updateSubscription = async (id: string, updates: Partial<Subscription>): Promise<Subscription> => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('subscription_id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// ─── Payments ─────────────────────────────────────────────────────────────────

export const createPayment = async (input: CreatePaymentInput): Promise<Payment> => {
  const receipt_number = input.receipt_number || `RCP-${Date.now()}`;
  const { data, error } = await supabase
    .from('payments')
    .insert({ ...input, receipt_number, status: 'completed' })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const fetchPayments = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      subscription:subscriptions (
        subscription_id,
        student:students (student_id, first_name, father_name, family_name)
      )
    `)
    .order('payment_date', { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((p: any) => ({
    ...p,
    student_name: p.subscription?.student 
      ? `${p.subscription.student.first_name} ${p.subscription.student.father_name || ''} ${p.subscription.student.family_name}`.trim()
      : 'غير معروف',
    student_id: p.subscription?.student?.student_id
  }));
};

// ─── Overdue Report ────────────────────────────────────────────────────────────

export const getOverdueStudents = async (): Promise<OverdueStudent[]> => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      subscription_id, type, end_date, total_amount, status,
      student:students (student_id, first_name, father_name, family_name),
      payments (amount, status)
    `)
    .in('status', ['active', 'expired'])
    .lte('end_date', today);

  if (error) throw new Error(error.message);

  return (data || [])
    .map((s: any) => {
      const paid = (s.payments || [])
        .filter((p: any) => p.status === 'completed')
        .reduce((sum: number, p: any) => sum + Number(p.amount), 0);
      const remaining = Number(s.total_amount) - paid;
      const days = Math.floor((Date.now() - new Date(s.end_date).getTime()) / (1000 * 60 * 60 * 24));
      return {
        student_id: s.student?.student_id,
        full_name: `${s.student?.first_name || ''} ${s.student?.father_name || ''} ${s.student?.family_name || ''}`.trim(),
        subscription_id: s.subscription_id,
        type: s.type,
        end_date: s.end_date,
        total_amount: Number(s.total_amount),
        paid_amount: paid,
        remaining,
        days_overdue: days,
      };
    })
    .filter((s: OverdueStudent) => s.remaining > 0);
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const getDashboardStats = async (teacherId?: string) => {
  const today = new Date().toISOString().split('T')[0];

  // Queries base
  let studentsQuery = supabase.from('students').select('student_id, status');
  let teachersQuery = supabase.from('teachers').select('teacher_id, status');
  let halaqatQuery = supabase.from('halaqat').select('halaqa_id, status, teacher_id');
  let sessionsQuery = supabase.from('sessions').select('session_id, status');
  let attendanceQuery = supabase.from('student_attendance').select('status');
  let homeworkQuery = supabase.from('homework_submissions').select('submission_id, grade, halaqat!inner(teacher_id)');

  if (teacherId) {
    // Filter halaqat by teacher
    halaqatQuery = halaqatQuery.eq('teacher_id', teacherId);
    
    // Get halaqat IDs for this teacher to filter other things
    const { data: teacherHalaqat } = await supabase
      .from('halaqat')
      .select('halaqa_id')
      .eq('teacher_id', teacherId);
    
    const hIds = (teacherHalaqat || []).map(h => h.halaqa_id);

    if (hIds.length > 0) {
      // Filter sessions
      sessionsQuery = sessionsQuery.in('halaqa_id', hIds);
      
      // Filter attendance (via halaqat)
      attendanceQuery = attendanceQuery.in('halaqa_id', hIds);

      // Filter students (those enrolled in these halaqat)
      const { data: enrolledStudents } = await supabase
        .from('enrollments')
        .select('student_id')
        .in('halaqa_id', hIds);
      
      const sIds = (enrolledStudents || []).map(s => s.student_id);
      studentsQuery = studentsQuery.in('student_id', sIds);
      
      // Filter homework
      homeworkQuery = homeworkQuery.in('halaqa_id', hIds);
    } else {
      // No halaqat = zero stats
      return {
        total_students: 0,
        total_teachers: 0,
        total_halaqat: 0,
        overdue_count: 0,
        attendance_rate: 0,
        present_count: 0,
        total_attendance_records: 0,
        scheduled_sessions: 0,
        pending_homework: 0,
      };
    }
  }

  const [
    studentsRes, 
    teachersRes, 
    halaqatRes, 
    subsRes,
    attendanceRes,
    sessionsRes,
    homeworkRes
  ] = await Promise.all([
    studentsQuery,
    teacherId ? supabase.from('teachers').select('teacher_id').eq('teacher_id', teacherId) : teachersQuery,
    halaqatQuery,
    teacherId 
      ? Promise.resolve({ data: [] } as any) // Teachers don't see financial info
      : supabase.from('subscriptions').select('subscription_id, status, end_date, total_amount, payments(amount, status)'),
    attendanceQuery,
    sessionsQuery.eq('status', 'scheduled'),
    homeworkQuery.is('grade', null)
  ]);

  const overdueCount = teacherId ? 0 : (subsRes.data || []).filter((s: any) => {
    if (s.status === 'cancelled' || s.end_date >= today) return false;
    const paid = (s.payments || [])
      .filter((p: any) => p.status === 'completed')
      .reduce((sum: number, p: any) => sum + Number(p.amount), 0);
    return (Number(s.total_amount) - paid) > 0;
  }).length;

  const attendance = attendanceRes.data || [];
  const totalAttendance = attendance.length;
  const presentCount = attendance.filter((a: any) => a.status === 'حاضر').length;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  return {
    total_students: (studentsRes.data || []).filter((s: any) => s.status === 'active').length,
    total_teachers: teacherId ? 1 : (teachersRes.data || []).filter((t: any) => t.status === 'active').length,
    total_halaqat: (halaqatRes.data || []).filter((h: any) => h.status === 'active').length,
    overdue_count: overdueCount,
    attendance_rate: attendanceRate,
    present_count: presentCount,
    total_attendance_records: totalAttendance,
    scheduled_sessions: (sessionsRes.data || []).length,
    pending_homework: (homeworkRes.data || []).length,
  };
};


