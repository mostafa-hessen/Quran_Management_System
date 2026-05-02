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
 * Move a student to another Circle
 */
export const moveStudent = async (studentId: string | undefined, oldEnrollmentId: string, newHalaqaId: string) => {
  let effectiveStudentId = studentId;

  // If studentId not provided, fetch it from the existing enrollment
  if (!effectiveStudentId) {
    const { data: oldEnrollment, error: fetchError } = await supabase
      .from("enrollments")
      .select("student_id")
      .eq("enrollment_id", oldEnrollmentId)
      .single();
    
    if (fetchError) throw fetchError;
    effectiveStudentId = oldEnrollment.student_id;
  }

  // Mark old enrollment as inactive
  const { error: updateError } = await supabase
    .from("enrollments")
    .update({ subscription_status: "inactive" })
    .eq("enrollment_id", oldEnrollmentId);

  if (updateError) throw updateError;

  // Create new active enrollment
  const { data, error: insertError } = await supabase
    .from("enrollments")
    .insert([
      {
        student_id: effectiveStudentId,
        halaqa_id: newHalaqaId,
        join_date: new Date().toISOString(),
        subscription_status: "active",
      },
    ])
    .select()
    .single();

  if (insertError) throw insertError;
  return data as Enrollment;
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
      student: students(student_id, first_name, family_name, gender),
      halaqa: halaqat(halaqa_id, name, level)
    `,
    )
    .order("join_date", { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Fetch all enrollments for a specific Circle (Halaqa)
 */
export const fetchHalaqaEnrollments = async (halaqaId: string) => {
  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      *,
      student: students(*)
    `)
    .eq("halaqa_id", halaqaId)
    .eq("subscription_status", "active");

  if (error) throw error;
  return data;
};

/**
 * Update an existing enrollment
 */
export const updateEnrollment = async (enrollmentId: string, updates: Partial<Enrollment>) => {
  const { data, error } = await supabase
    .from("enrollments")
    .update(updates)
    .eq("enrollment_id", enrollmentId)
    .select()
    .single();

  if (error) throw error;
  return data as Enrollment;
};
