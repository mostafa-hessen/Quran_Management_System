// src/features/enrollments/api/enrollmentApi.ts

import { supabase } from "@/shared/lib/supabase";
import type { Enrollment } from "../types";

/**
 * Enroll a student into a Circle (Halaqa)
 */
export const enrollStudent = async (studentId: string, halaqaId: string) => {
  const { data, error } = await supabase
    .from("enrollments")
    .insert([
      {
        student_id: studentId,
        halaqa_id: halaqaId,
        join_date: new Date().toISOString(),
        subscription_status: "active",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(`[Enrollment Error]:`, error);
    throw error;
  }

  return data as Enrollment;
};

/**
 * Remove a student from a Circle (Unenroll)
 */
export const unenrollStudent = async (enrollmentId: string) => {
  const { error } = await supabase
    .from("enrollments")
    .delete()
    .eq("enrollment_id", enrollmentId);

  if (error) throw error;
};

/**
 * Fetch all enrollments for a specific student
 */
export const fetchStudentEnrollments = async (studentId: string) => {
  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      halaqa: halaqat(halaqa_id, name, level)
    `,
    )
    .eq("student_id", studentId);

  if (error) throw error;
  return data;
};

/**
 * Fetch all enrollments in the system for the central dashboard
 */
export const fetchAllEnrollments = async () => {
  const { data, error } = await supabase
    .from("enrollments")
    .select(
      `
      *,
      student: students(student_id, first_name, last_name, gender),
      halaqa: halaqat(halaqa_id, name, level)
    `,
    )
    .order("join_date", { ascending: false });

  if (error) throw error;
  return data;
};
