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
    .update(updates)
    .eq("student_id", studentId)
    .select()
    .single();

  if (error) {
    throw new Error("حدث خطأ أثناء تحديث بيانات الطالب."); // Error message in Arabic for the user
  }
  return data as Student;
};

/**
 * Updates full student data including associated phone numbers.
 * Uses separate calls to ensure proper handling of phone records.
 */
export const updateStudentFull = async (
  studentId: string,
  studentUpdates: Partial<Student>,
  phones: (Partial<StudentGuardianPhone> & { action?: "add" | "update" | "delete" })[],
) => {
  // 1. Update basic student fields
  const student = await updateStudent(studentId, studentUpdates);

  // 2. Handle phone actions
  for (const p of phones) {
    if (p.action === "add" && p.phone) {
      const { error } = await supabase.from("student_guardian_phones").insert({
        student_id: studentId,
        phone: p.phone,
        guardian_relation: p.guardian_relation as any, // Cast due to DB encoding mismatch in types
        label: p.label as any,
      });
      if (error) throw new Error("حدث خطأ أثناء إضافة رقم الهاتف.");
    } else if (p.action === "update" && p.phone_id) {
      const { phone_id, action, student_id, ...phoneUpdates } = p;
      const { error } = await supabase
        .from("student_guardian_phones")
        .update({
          ...phoneUpdates,
          guardian_relation: phoneUpdates.guardian_relation as any,
          label: phoneUpdates.label as any,
        })
        .eq("phone_id", p.phone_id);
      if (error) throw new Error("حدث خطأ أثناء تحديث رقم الهاتف.");
    } else if (p.action === "delete" && p.phone_id) {
      const { error } = await supabase
        .from("student_guardian_phones")
        .delete()
        .eq("phone_id", p.phone_id);
      if (error) throw new Error("حدث خطأ أثناء حذف رقم الهاتف.");
    }
  }

  return student;
};


export const deleteStudent = async (studentId: string) => {
  // First delete associated phones explicitly
  const { error: phoneError } = await supabase
    .from("student_guardian_phones")
    .delete()
    .eq("student_id", studentId);

  if (phoneError) {
    throw new Error("حدث خطأ أثناء حذف أرقام هواتف الطالب.");
  }

  const { error } = await supabase
    .from("students")
    .delete()
    .eq("student_id", studentId);
    
  if (error) {
    throw new Error("حدث خطأ أثناء حذف بيانات الطالب.");
  }
};


