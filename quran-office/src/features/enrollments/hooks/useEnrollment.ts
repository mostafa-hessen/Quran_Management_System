// src/features/enrollments/hooks/useEnrollment.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as enrollmentApi from "../api/enrollmentApi";

/**
 * Hook for managing student enrollments in Circles
 */
export const useEnrollment = (studentId?: string) => {
  const queryClient = useQueryClient();

  // 1. Fetch current enrollments (only if studentId is provided)
  const enrollmentsQuery = useQuery({
    queryKey: ["student_enrollments", studentId],
    queryFn: () => enrollmentApi.fetchStudentEnrollments(studentId!),
    enabled: !!studentId,
  });

  // 2. Fetch all enrollments (for the main enrollments page)
  const allEnrollmentsQuery = useQuery({
    queryKey: ["all_enrollments"],
    queryFn: () => enrollmentApi.fetchAllEnrollments(),
  });

  // 3. Enroll Mutation
  const enrollMutation = useMutation({
    mutationFn: ({ studentId, halaqaId }: { studentId: string; halaqaId: string }) => 
      enrollmentApi.enrollStudent(studentId, halaqaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["all_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  // 4. Unenroll Mutation
  const unenrollMutation = useMutation({
    mutationFn: (enrollmentId: string) => enrollmentApi.unenrollStudent(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["all_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  return {
    enrollments: enrollmentsQuery.data || [],
    isLoading: enrollmentsQuery.isLoading,
    allEnrollments: allEnrollmentsQuery.data || [],
    isLoadingAll: allEnrollmentsQuery.isLoading,
    enroll: enrollMutation.mutate,
    isEnrolling: enrollMutation.isPending,
    unenroll: unenrollMutation.mutate,
    isUnenrolling: unenrollMutation.isPending,
  };
};
