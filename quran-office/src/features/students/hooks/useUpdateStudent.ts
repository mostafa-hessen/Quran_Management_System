import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudentFull } from "../api/studentsApi";
import type { Student, StudentGuardianPhone } from "../types";
import { useStudentUIStore } from "../store/useStudentUIStore";
import { useNotification } from "@/shared/hooks/useNotification";

/**
 * Hook for updating student data with notification feedback.
 */
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const { closeEdit } = useStudentUIStore();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: async ({
      studentId,
      updates,
      phones,
    }: {
      studentId: string;
      updates: Partial<Student>;
      phones: (Partial<StudentGuardianPhone> & { action?: "add" | "update" | "delete" })[];
    }) => {
      const updatedStudent = await updateStudentFull(studentId, updates, phones);
      return updatedStudent;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student-details", variables.studentId] });
      queryClient.invalidateQueries({ queryKey: ["audit_logs"] });
      closeEdit();
      notify("تم تحديث بيانات الطالب بنجاح ✓", "success");
    },
    onError: () => {
      notify("حدث خطأ أثناء تحديث البيانات، يرجى المحاولة مجدداً", "error");
    },
  });
};

