import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as studentsApi from "../api/studentsApi";
import type { Student, StudentGuardianPhone, StudentFilterState } from "../types";
import { useNotification } from "@/shared/hooks/useNotification";

/**
 * Fetch all students
 */
export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: studentsApi.fetchStudents,
  });
};

/**
 * Fetch students with advanced filters
 */
export const useFilteredStudents = (filters: StudentFilterState) => {
  return useQuery({
    queryKey: ["students", "filtered", filters],
    queryFn: () => studentsApi.fetchStudentsWithFilters(filters),
  });
};

/**
 * Hook for adding a new student with notification feedback.
 */
export const useAddStudent = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: async ({ 
      student, 
      phones 
    }: { 
      student: Omit<Student, "student_id" | "created_at" | "updated_at">; 
      phones?: Omit<StudentGuardianPhone, "phone_id" | "student_id">[]; 
    }) => {
      const studentData = await studentsApi.addStudent(student, phones);
      return studentData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["audit_logs"] });
      notify("تم إضافة الطالب بنجاح ✓", "success");
    },
    onError: (error: any) => {
      notify(error.message || "حدث خطأ أثناء إضافة الطالب", "error");
    },
  });
};

/**
 * Hook for updating an existing student.
 */
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: async ({
      studentId,
      studentUpdates,
      phones
    }: {
      studentId: string;
      studentUpdates: Partial<Student>;
      phones: (Partial<StudentGuardianPhone> & { action?: "add" | "update" | "delete" })[];
    }) => {
      return await studentsApi.updateStudentFull(studentId, studentUpdates, phones);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student-details", data.student_id] });
      queryClient.invalidateQueries({ queryKey: ["audit_logs"] });
      notify("تم تحديث بيانات الطالب بنجاح ✓", "success");
    },
    onError: (error: any) => {
      notify(error.message || "حدث خطأ أثناء تحديث الطالب", "error");
    },
  });
};

/**
 * Hook for deleting a student.
 */
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: studentsApi.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["audit_logs"] });
      notify("تم حذف الطالب بنجاح ✓", "success");
    },
    onError: (error: any) => {
      notify(error.message || "حدث خطأ أثناء حذف الطالب", "error");
    },
  });
};


/**
 * Hook for fetching comprehensive student data (including phones).
 */
export const useStudentDetails = (studentId: string | null) => {
  return useQuery({
    queryKey: ["student-details", studentId],
    queryFn: () => (studentId ? studentsApi.fetchStudentDetails(studentId) : null),
    enabled: !!studentId,
  });
};

