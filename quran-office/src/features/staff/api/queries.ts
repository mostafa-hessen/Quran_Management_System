import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStaffMembers, createStaffMember, updateStaffMember, deactivateStaffMember } from '../api/staffApi';
import type { CreateStaffInput, UpdateStaffInput } from '../types';

const STAFF_QUERY_KEY = ['staff'];

export const useStaffMembers = () =>
  useQuery({
    queryKey: STAFF_QUERY_KEY,
    queryFn: getStaffMembers,
  });

export const useCreateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStaffInput) => createStaffMember(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
      // Also invalidate teachers list since a teacher could have been created
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateStaffInput }) =>
      updateStaffMember(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};

export const useDeactivateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deactivateStaffMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
    },
  });
};

export const useActivateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activateStaffMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STAFF_QUERY_KEY });
    },
  });
};
