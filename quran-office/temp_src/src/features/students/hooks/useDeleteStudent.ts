import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudent } from "../api/studentsApi";
import type { FullStudentData, Student } from "../types";
import { useNotification } from "@/shared/hooks/useNotification";

/**
 * Hook for deleting a student with optimistic update and notification feedback.
 */
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  return useMutation({
    mutationFn: async ({
      studentId,
    }: {
      studentId: string;
      snapshot: FullStudentData;
    }) => {
      await deleteStudent(studentId);
    },

    onMutate: async ({ studentId }) => {
      await queryClient.cancelQueries({ queryKey: ["students"] });
      const previousStudents = queryClient.getQueryData<Student[]>(["students"]);

      if (previousStudents) {
        queryClient.setQueryData<Student[]>(["students"], (old) =>
          old ? old.filter((s) => s.student_id !== studentId) : []
        );
      }

      return { previousStudents };
    },

    onSuccess: () => {
      notify("تم حذف الطالب بنجاح ✓", "success");
    },

    onError: (_err, _variables, context) => {
      if (context?.previousStudents) {
        queryClient.setQueryData(["students"], context.previousStudents);
      }
      notify("حدث خطأ أثناء حذف الطالب، يرجى المحاولة مجدداً", "error");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
