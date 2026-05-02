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

export const getPaymentStats = async () => {
  const [studentsRes, teachersRes, halaqatRes, subsRes] = await Promise.all([
    supabase.from('students').select('student_id, status'),
    supabase.from('teachers').select('teacher_id, status'),
    supabase.from('halaqat').select('halaqa_id, status'),
    supabase.from('subscriptions').select('subscription_id, status, end_date'),
  ]);

  const today = new Date().toISOString().split('T')[0];
  const overdueCount = (subsRes.data || []).filter(
    (s: any) => s.status !== 'cancelled' && s.end_date < today
  ).length;

  return {
    total_students: (studentsRes.data || []).filter((s: any) => s.status === 'active').length,
    total_teachers: (teachersRes.data || []).filter((t: any) => t.status === 'active').length,
    total_halaqat: (halaqatRes.data || []).filter((h: any) => h.status === 'active').length,
    overdue_count: overdueCount,
  };
};
