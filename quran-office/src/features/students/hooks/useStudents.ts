import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as studentsApi from "../api/studentsApi";
import type { Student } from "../types";

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: studentsApi.fetchStudents,
  });
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ student, phones }: { student: any; phones?: any[] }) =>
      studentsApi.addStudent(student, phones),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Student> }) =>
      studentsApi.updateStudent(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", data.student_id] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
