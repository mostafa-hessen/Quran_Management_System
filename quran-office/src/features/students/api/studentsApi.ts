import { supabase } from "@/shared/lib/supabase";
import type { Student, StudentGuardianPhone, ExtendedStudent, StudentFilterState } from "../types";
import { createAuditLog } from "@/shared/api/auditLogsApi";
import { mapStudentError } from "../utils/errorMessages";

export const fetchStudents = async (): Promise<ExtendedStudent[]> => {
  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      enrollments (
        subscription_status,
        halaqat (
          halaqa_id,
          name,
          teacher:teachers (
            profiles:profiles!teachers_profile_id_fkey (
              full_name
            )
          )
        )
      ),
      student_guardian_phones (*)
    `)
    .order("first_name", { ascending: true });

  if (error) throw error;

  // Flatten the data for easier use in the UI
  return (data as any[]).map(student => {
    const enrolled_halaqat = student.enrollments?.map((e: any) => ({
      halaqa_id: e.halaqat?.halaqa_id,
      name: e.halaqat?.name,
      teacher_name: e.halaqat?.teacher?.profiles?.full_name
    })).filter((h: any) => h.halaqa_id);

    return {
      ...student,
      halaqa_name: enrolled_halaqat?.[0]?.name,
      teacher_name: enrolled_halaqat?.[0]?.teacher_name,
      enrolled_halaqat,
      phones: student.student_guardian_phones
    };
  }) as ExtendedStudent[];
};

export const fetchStudentDetails = async (studentId: string): Promise<ExtendedStudent> => {
  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      enrollments (
        subscription_status,
        halaqat (
          halaqa_id,
          name,
          teacher:teachers (
            profiles:profiles!teachers_profile_id_fkey (
              full_name
            )
          )
        )
      ),
      student_guardian_phones (*)
    `)
    .eq("student_id", studentId)
    .single();

  if (error) throw error;
  
  const enrolled_halaqat = (data as any).enrollments?.map((e: any) => ({
    halaqa_id: e.halaqat?.halaqa_id,
    name: e.halaqat?.name,
    teacher_name: e.halaqat?.teacher?.profiles?.full_name
  })).filter((h: any) => h.halaqa_id);

  return {
    ...data,
    phones: (data as any).student_guardian_phones,
    enrolled_halaqat,
    halaqa_name: enrolled_halaqat?.[0]?.name,
    teacher_name: enrolled_halaqat?.[0]?.teacher_name
  } as ExtendedStudent;
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
    throw new Error("حدث خطأ أثناء تحديث بيانات الطالب.");
  }
  return data as Student;
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

  if (studentError) {
    throw new Error(mapStudentError(studentError));
  }

  if (phones && phones.length > 0) {
    const phonesToInsert = phones.map((p) => ({
      ...p,
      student_id: studentData.student_id,
    }));

    const { error: phonesError } = await supabase
      .from("student_guardian_phones")
      .insert(phonesToInsert as any[]);

    if (phonesError) {
      throw new Error(mapStudentError(phonesError));
    }
  }

  return studentData as any as Student;
};

export const updateStudentFull = async (
  studentId: string,
  studentUpdates: Partial<Student>,
  phones: (Partial<StudentGuardianPhone> & { action?: "add" | "update" | "delete" })[],
) => {
  const { data: previousData } = await supabase
    .from("students")
    .select("*, student_guardian_phones(*)")
    .eq("student_id", studentId)
    .single();

  const student = await updateStudent(studentId, studentUpdates);

  for (const p of phones) {
    if (p.action === "add" && p.phone) {
      const { error: addError } = await supabase.from("student_guardian_phones").insert({
        student_id: studentId,
        phone: p.phone,
        guardian_relation: p.guardian_relation as any,
        label: p.label as any,
      });
      if (addError) throw addError;
    } else if (p.action === "update" && p.phone_id) {
      const { phone_id, action, student_id, ...phoneUpdates } = p;
      const { error: updateError } = await supabase
        .from("student_guardian_phones")
        .update({
          ...phoneUpdates,
          guardian_relation: phoneUpdates.guardian_relation as any,
          label: phoneUpdates.label as any,
        })
        .eq("phone_id", p.phone_id);
      if (updateError) throw updateError;
    } else if (p.action === "delete" && p.phone_id) {
      const { error: deleteError } = await supabase
        .from("student_guardian_phones")
        .delete()
        .eq("phone_id", p.phone_id);
      if (deleteError) throw deleteError;
    }
  }

  const { data: newData } = await supabase
    .from("students")
    .select("*, student_guardian_phones(*)")
    .eq("student_id", studentId)
    .single();

  return student;
};

export const deleteStudent = async (studentId: string) => {
  const { data: snapshot } = await supabase
    .from("students")
    .select("*, student_guardian_phones(*)")
    .eq("student_id", studentId)
    .single();

  await supabase
    .from("student_guardian_phones")
    .delete()
    .eq("student_id", studentId);

  const { error } = await supabase
    .from("students")
    .delete()
    .eq("student_id", studentId);
    
  if (error) throw new Error("حدث خطأ أثناء حذف بيانات الطالب.");

};

export const fetchStudentsWithFilters = async (filters: StudentFilterState): Promise<ExtendedStudent[]> => {
  let query = supabase
    .from("students")
    .select(`
      *,
      enrollments (
        subscription_status,
        halaqat (
          halaqa_id,
          name,
          teacher_id,
          teacher:teachers (
            profiles:profiles!teachers_profile_id_fkey (
              full_name
            )
          )
        )
      ),
      student_guardian_phones (*)
    `);

  if (filters.searchTerm) {
    query = query.or(`first_name.ilike.%${filters.searchTerm}%,family_name.ilike.%${filters.searchTerm}%`);
  }

  if (filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters.gender !== 'all') {
    query = query.eq('gender', filters.gender);
  }

  // Note: Filtering by halaqaId or teacherId on a joined table is complex in Supabase JS client
  // Often easier to do post-processing or use RPC/more complex queries.
  // For now, we'll fetch and filter client-side if needed, or refine this.

  const { data, error } = await query.order("first_name", { ascending: true });

  if (error) throw error;

  let processed = (data as any[]).map(student => {
    const enrolled_halaqat = student.enrollments?.map((e: any) => ({
      halaqa_id: e.halaqat?.halaqa_id,
      name: e.halaqat?.name,
      teacher_id: e.halaqat?.teacher_id,
      teacher_name: e.halaqat?.teacher?.profiles?.full_name
    })).filter((h: any) => h.halaqa_id);

    return {
      ...student,
      halaqa_name: enrolled_halaqat?.[0]?.name,
      teacher_name: enrolled_halaqat?.[0]?.teacher_name,
      enrolled_halaqat,
      phones: student.student_guardian_phones,
      halaqa_ids: enrolled_halaqat?.map((h: any) => h.halaqa_id) || []
    };
  });

  // Client-side filtering for joined fields if needed
  if (filters.halaqaId !== 'all') {
    processed = processed.filter(s => s.halaqa_ids?.includes(filters.halaqaId));
  }
  if (filters.teacherId !== 'all') {
    // Note: this filters if ANY of the student's halaqat has this teacher
    processed = processed.filter(s => 
      s.enrolled_halaqat?.some((h: any) => h.teacher_id === filters.teacherId)
    );
  }
  if (filters.phoneTerm) {
    processed = processed.filter(s => 
      s.phones?.some((p: any) => p.phone.includes(filters.phoneTerm))
    );
  }

  return processed as ExtendedStudent[];
};
