// src/features/enrollments/hooks/useEnrollment.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as enrollmentApi from "../api/enrollmentApi";
import { toast } from "react-hot-toast";

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
      queryClient.invalidateQueries({ queryKey: ["halaqa_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["halaqat"] });
      queryClient.invalidateQueries({ queryKey: ["audit_logs"] });
    },
  });

  // 4. Unenroll Mutation
  const unenrollMutation = useMutation({
    mutationFn: (enrollmentId: string) => enrollmentApi.unenrollStudent(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["all_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["halaqa_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["halaqat"] });
      queryClient.invalidateQueries({ queryKey: ["audit_logs"] });
    },
  });

  // 5. Move Student Mutation
  const moveMutation = useMutation({
    mutationFn: ({ studentId, oldEnrollmentId, newHalaqaId }: { studentId: string; oldEnrollmentId: string; newHalaqaId: string }) => 
      enrollmentApi.moveStudent(studentId, oldEnrollmentId, newHalaqaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["all_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["halaqa_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["halaqat"] });
      queryClient.invalidateQueries({ queryKey: ["audit_logs"] });
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
    moveStudent: moveMutation.mutate,
    isMoving: moveMutation.isPending,
  };
};

// Standalone hooks for specific actions
export const useHalaqaEnrollments = (halaqaId: string) => {
  return useQuery({
    queryKey: ["halaqa_enrollments", halaqaId],
    queryFn: () => enrollmentApi.fetchHalaqaEnrollments(halaqaId),
    enabled: !!halaqaId,
  });
};

export const useUnenrollStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enrollmentId: string) => enrollmentApi.unenrollStudent(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halaqa_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["all_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["halaqat"] });
      queryClient.invalidateQueries({ queryKey: ["audit_logs"] });
      toast.success("تم إلغاء التسجيل بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إلغاء التسجيل");
    }
  });
};

export const useMoveStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ enrollmentId, newHalaqaId }: { enrollmentId: string; newHalaqaId: string }) => 
      enrollmentApi.moveStudent("", enrollmentId, newHalaqaId), // Note: studentId can be empty if API handles it via enrollmentId
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halaqa_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["all_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["student_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["halaqat"] });
      queryClient.invalidateQueries({ queryKey: ["audit_logs"] });
    },
  });
};

export const useEnrollMultipleStudents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ studentIds, halaqaId }: { studentIds: string[]; halaqaId: string }) => 
      Promise.all(studentIds.map(id => enrollmentApi.enrollStudent(id, halaqaId))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halaqa_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["all_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["halaqat"] });
      queryClient.invalidateQueries({ queryKey: ["audit_logs"] });
      toast.success("تم تسجيل الطلاب بنجاح");
    },
  });
};

export const useUpdateEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ enrollmentId, updates }: { enrollmentId: string; updates: any }) => 
      enrollmentApi.updateEnrollment(enrollmentId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["halaqa_enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["all_enrollments"] });
    },
  });
};
