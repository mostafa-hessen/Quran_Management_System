import { useQuery } from "@tanstack/react-query";
import * as reportsApi from "../api/reportsApi";

export const useFinancialSummary = () => {
  return useQuery({
    queryKey: ['financial-summary'],
    queryFn: reportsApi.getFinancialSummary,
    refetchInterval: 1000 * 60 * 5 // 5 minutes
  });
};

export const useArrears = () => {
  return useQuery({
    queryKey: ['reports', 'arrears'],
    queryFn: reportsApi.getArrears
  });
};

export const useExpiringSubscriptions = () => {
  return useQuery({
    queryKey: ['reports', 'expiring-subs'],
    queryFn: reportsApi.getExpiringSubscriptions
  });
};

export const useHalaqatStats = () => {
  return useQuery({
    queryKey: ['reports', 'halaqa-stats'],
    queryFn: reportsApi.getHalaqatStats
  });
};
