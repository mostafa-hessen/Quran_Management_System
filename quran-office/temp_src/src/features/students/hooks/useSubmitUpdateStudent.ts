import { type UseFormReturn } from "react-hook-form";
import { useUpdateStudent } from "./useUpdateStudent";
import { useStudentUIStore } from "../store/useStudentUIStore";
import { type StudentFormValues } from "../schemas/studentSchema";
import { type FullStudentData, type StudentGuardianPhone } from "../types";

/**
 * Custom hook to handle student update submission.
 * Includes diffing phones for Add/Update/Delete actions.
 */

export const useSubmitUpdateStudent = (
  form: UseFormReturn<any>,
  currentStudent: FullStudentData | null
) => {
  const typedForm = form as UseFormReturn<StudentFormValues>;


  const { closeEdit } = useStudentUIStore();
  const updateMutation = useUpdateStudent();

  const handleClose = () => {
    typedForm.reset();
    closeEdit();
  };

  const onSubmit = typedForm.handleSubmit((data) => {

    if (!currentStudent) return;

    // 1. Prepare student updates
    const { phones: formPhones, ...studentUpdates } = data;

    // 2. Diff phones
    const phoneActions: (Partial<StudentGuardianPhone> & { action: "add" | "update" | "delete" })[] = [];
    const currentPhones = currentStudent.phones || [];

    // Add or Update
    formPhones.forEach(fp => {
      // @ts-ignore - phone_id exists in form input but handled carefully
      if (fp.phone_id) {
        phoneActions.push({
          ...fp,
          action: "update",
        } as any);
      } else {
        phoneActions.push({
          ...fp,
          action: "add",
        } as any);
      }
    });

    // Delete
    currentPhones.forEach(cp => {
      const isStillPresent = formPhones.find(fp => (fp as any).phone_id === cp.phone_id);
      if (!isStillPresent) {
        phoneActions.push({
          phone_id: cp.phone_id,
          action: "delete",
        });
      }
    });

    // 3. Execute mutation
    updateMutation.mutate({
      studentId: currentStudent.student_id,
      updates: studentUpdates as any,
      phones: phoneActions,
    }, {
      onSuccess: () => {
        handleClose();
      },
      onError: (error: Error) => {
        typedForm.setError("root", { message: error.message || "حدث خطأ أثناء تحديث البيانات" });
      },
    });
  });

  return {
    onSubmit,
    isPending: updateMutation.isPending,
    error: typedForm.formState.errors.root?.message,
    handleClose,
  };
};

