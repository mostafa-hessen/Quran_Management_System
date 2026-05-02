// ======================================================
// Payments & Subscriptions Types — الاشتراكات والمدفوعات
// ======================================================

export type SubscriptionType = 'شهري' | 'سنوي';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'exempt';
export type PaymentMethod = 'نقدي' | 'تحويل' | 'آخر';
export type PaymentStatus = 'completed' | 'pending' | 'failed';

export interface Subscription {
  subscription_id: string;
  student_id: string;
  type: SubscriptionType;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
  // Joined
  student?: {
    student_id: string;
    first_name: string;
    father_name?: string;
    family_name: string;
    full_name?: string;
    phones?: string[];
  };
  payments?: Payment[];
  paid_amount?: number;
}

export interface Payment {
  payment_id: string;
  subscription_id: string;
  payment_date: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  receipt_number?: string;
  notes?: string;
}

export interface CreateSubscriptionInput {
  student_id: string;
  type: SubscriptionType;
  start_date: string;
  end_date: string;
  total_amount: number;
  status?: SubscriptionStatus;
}

export interface CreatePaymentInput {
  subscription_id: string;
  amount: number;
  method: PaymentMethod;
  receipt_number?: string;
  notes?: string;
}

// For the overdue report
export interface OverdueStudent {
  student_id: string;
  full_name: string;
  subscription_id: string;
  type: SubscriptionType;
  end_date: string;
  total_amount: number;
  paid_amount: number;
  remaining: number;
  days_overdue: number;
}
