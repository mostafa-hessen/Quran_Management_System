import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as studentsApi from "../api/studentsApi";
import type { Student, StudentGuardianPhone } from "../types";
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
      notify("تم إضافة الطالب بنجاح ✓", "success");
    },
    onError: () => {
      notify("حدث خطأ أثناء إضافة الطالب، يرجى المحاولة مجدداً", "error");
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

