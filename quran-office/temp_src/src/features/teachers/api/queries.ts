import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeachers, createTeacher, deleteTeacher, updateTeacher } from '../api/teachersApi';
import type { CreateTeacherInput, UpdateTeacherInput } from '../types/index';

export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTeacherInput) => createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    }
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherInput }) => updateTeacher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    }
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    }
  });
};
