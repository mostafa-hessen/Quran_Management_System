import { useQuery } from '@tanstack/react-query';
import { getGeneralKPIs, getTeacherPerformance, getHalaqatStatus } from './reportsApi';

export const REPORTS_KEYS = {
  KPIs: ['reports', 'kpis'],
  TEACHERS: ['reports', 'teacher-performance'],
  HALAQAT: ['reports', 'halaqat-status'],
};

export const useGeneralKPIs = () => 
  useQuery({ queryKey: REPORTS_KEYS.KPIs, queryFn: getGeneralKPIs });

export const useTeacherPerformance = () => 
  useQuery({ queryKey: REPORTS_KEYS.TEACHERS, queryFn: getTeacherPerformance });

export const useHalaqatStatus = () => 
  useQuery({ queryKey: REPORTS_KEYS.HALAQAT, queryFn: getHalaqatStatus });
