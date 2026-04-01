import { useAddStudent } from "./useStudents";
import { useStudentUIStore } from "../store/useStudentUIStore";
import { formDataToEntity } from "../transforms";
import type { StudentFormValues } from "../schemas/studentSchema";
import { DEFAULT_STUDENT_FORM_VALUES } from "../schemas/studentSchema";
import type { UseFormReturn } from "react-hook-form";

/**
 * Custom hook to handle student creation submission.
 * Fixes previous typo in filename and store imports.
 */
export const useSubmitStudent = (form: UseFormReturn<any>) => {
  const typedForm = form as UseFormReturn<StudentFormValues>;

  const { closeAdd } = useStudentUIStore();
  const addStudentMutation = useAddStudent();

  const handleClose = () => {
    typedForm.reset(DEFAULT_STUDENT_FORM_VALUES);
    closeAdd();
  };

  const onSubmit = typedForm.handleSubmit((data) => {

    const payload = formDataToEntity(data);
    
    addStudentMutation.mutate(payload, {
      onSuccess: () => {
        handleClose();
      },
      onError: (error: Error) => {
        const message = error.message || "حدث خطأ أثناء حفظ البيانات";
        typedForm.setError("root", { message });
      },
    });
  });

  return {
    onSubmit,
    isPending: addStudentMutation.isPending,
    error: typedForm.formState.errors.root?.message,
    handleClose,
  };
};

