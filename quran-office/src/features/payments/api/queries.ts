import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSubscriptions, createSubscription, updateSubscriptionStatus,
  createPayment, getOverdueStudents, getPaymentStats,
} from './paymentsApi';
import type { CreateSubscriptionInput, CreatePaymentInput } from '../types';

export const PAYMENTS_KEY = ['subscriptions'];
export const OVERDUE_KEY = ['overdue-students'];
export const STATS_KEY = ['dashboard-stats'];

export const useSubscriptions = () =>
  useQuery({ queryKey: PAYMENTS_KEY, queryFn: getSubscriptions });

export const useOverdueStudents = () =>
  useQuery({ queryKey: OVERDUE_KEY, queryFn: getOverdueStudents });

export const useDashboardStats = () =>
  useQuery({ queryKey: STATS_KEY, queryFn: getPaymentStats });

export const useCreateSubscription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSubscriptionInput) => createSubscription(input),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PAYMENTS_KEY }); qc.invalidateQueries({ queryKey: STATS_KEY }); },
  });
};

export const useUpdateSubscriptionStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateSubscriptionStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PAYMENTS_KEY }); qc.invalidateQueries({ queryKey: OVERDUE_KEY }); },
  });
};

export const useCreatePayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePaymentInput) => createPayment(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PAYMENTS_KEY });
      qc.invalidateQueries({ queryKey: OVERDUE_KEY });
      qc.invalidateQueries({ queryKey: STATS_KEY });
    },
  });
};
