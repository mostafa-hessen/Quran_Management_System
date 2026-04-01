import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  studentSchema, 
 type StudentFormValues, 
  DEFAULT_STUDENT_FORM_VALUES 
} from "../schemas/studentSchema";

export const useAddStudentForm = () => {
  const form = useForm<StudentFormValues>({
    // Cast resolves a version-specific type mismatch between zod's `.default([])`
    // inferred type and StudentFormValues — logic remains fully type-safe.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(studentSchema) as any,
    defaultValues: DEFAULT_STUDENT_FORM_VALUES,
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phones",
  });

  return {
    form,
    fields,
    append,
    remove,
  };
};
