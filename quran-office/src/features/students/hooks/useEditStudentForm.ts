import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { studentSchema, type StudentFormValues } from "../schemas/studentSchema";
import { useStudentUIStore } from "../store/useStudentUIStore";
import { type FullStudentData } from "../types";

/**
 * Custom hook to manage student edit form state.
 * Handles initialization with existing student data.
 */
export const useEditStudentForm = (student: FullStudentData | null) => {
  const { isEditOpen } = useStudentUIStore();

  const defaultValues = useMemo<StudentFormValues>(() => {
    if (!student) {
      return {
        first_name: "",
        father_name: "",
        grandfather_name: "",
        family_name: "",
        gender: "ذكر",
        birth_date: "",
        address: "",
        status: "active",
        phones: [],
      };
    }

    return {
      first_name: student.first_name,
      father_name: student.father_name || "",
      grandfather_name: student.grandfather_name || "",
      family_name: student.family_name,
      gender: student.gender || "ذكر",
      birth_date: student.birth_date || "",
      address: student.address || "",
      status: student.status || "active",
      phones: student.phones?.map(p => ({
        phone_id: p.phone_id,
        phone: p.phone,
        guardian_relation: p.guardian_relation,
        label: p.label || "أساسي",
      })) || [],
    };
  }, [student]);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema) as any,
    defaultValues,
  });


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phones",
  });

  // Reset form when student changes or modal opens
  useEffect(() => {
    if (isEditOpen && student) {
      form.reset(defaultValues);
    }
  }, [isEditOpen, student, form, defaultValues]);

  return {
    form,
    fields,
    append,
    remove,
  };
};
