import { supabase } from "@/shared/lib/supabase";
import type { Student, StudentGuardianPhone } from "../types";

export const fetchStudents = async () => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("first_name", { ascending: true });

  if (error) throw error;
  return data as Student[];
};

export const fetchStudentDetails = async (studentId: string) => {
  const { data, error } = await supabase
    .from("students")
    .select("*, student_guardian_phones(*)")
    .eq("student_id", studentId)
    .single();

  if (error) throw error;
  return data;
};

export const addStudent = async (
  student: Omit<Student, "student_id" | "created_at" | "updated_at">,
  phones?: Omit<StudentGuardianPhone, "phone_id" | "student_id">[],
) => {
  const { data: studentData, error: studentError } = await supabase
    .from("students")
    .insert([student as any])
    .select()
    .single();

  if (studentError) throw studentError;

  if (phones && phones.length > 0) {
    const phonesToInsert = phones.map((p) => ({
      ...p,
      student_id: studentData.student_id,
    }));

    const { error: phonesError } = await supabase
      .from("student_guardian_phones")
      .insert(phonesToInsert as any[]);

    if (phonesError) throw phonesError;
  }

  return studentData as any as Student;
};

export const updateStudent = async (
  studentId: string,
  updates: Partial<Student>,
) => {
  const { data, error } = await supabase
    .from("students")
    .update(updates as any)
    .eq("student_id", studentId)
    .select()
    .single();

  if (error) throw error;
  return data as any as Student;
};

export const deleteStudent = async (studentId: string) => {
  const { error } = await supabase
    .from("students")
    .delete()
    .eq("student_id", studentId);
  if (error) throw error;
};

export const addStudentPhone = async (
  phone: Omit<StudentGuardianPhone, "phone_id">,
) => {
  const { data, error } = await supabase
    .from("student_guardian_phones")
    .insert([phone as any])
    .select()
    .single();

  if (error) throw error;
  return data as any as StudentGuardianPhone;
};
