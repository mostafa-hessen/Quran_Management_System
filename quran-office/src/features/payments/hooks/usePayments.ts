import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as paymentsApi from "../api/paymentsApi";
import type { CreatePaymentInput, CreateSubscriptionInput } from "../types";

export const PAYMENTS_KEY = ['payments'];
export const SUBSCRIPTIONS_KEY = ['subscriptions'];
export const OVERDUE_KEY = ['overdue-students'];
export const STATS_KEY = ['dashboard-stats'];

export const useSubscriptions = () => {
  return useQuery({
    queryKey: SUBSCRIPTIONS_KEY,
    queryFn: paymentsApi.getSubscriptions
  });
};

export const usePayments = () => {
  return useQuery({
    queryKey: PAYMENTS_KEY,
    queryFn: paymentsApi.fetchPayments
  });
};

export const useOverdueStudents = () => {
  return useQuery({
    queryKey: OVERDUE_KEY,
    queryFn: paymentsApi.getOverdueStudents
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: STATS_KEY,
    queryFn: paymentsApi.getPaymentStats
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePaymentInput) => paymentsApi.createPayment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: STATS_KEY });
      queryClient.invalidateQueries({ queryKey: OVERDUE_KEY });
    }
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSubscriptionInput) => paymentsApi.createSubscription(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: STATS_KEY });
    }
  });
};

export const useUpdateSubscriptionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => paymentsApi.updateSubscriptionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: OVERDUE_KEY });
    }
  });
};
