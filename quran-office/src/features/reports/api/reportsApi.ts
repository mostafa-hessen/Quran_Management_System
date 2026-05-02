import { supabase } from '@/shared/lib/supabase';

export const getTeacherPerformance = async () => {
  const { data, error } = await supabase
    .from('teachers')
    .select(`
      teacher_id,
      first_name,
      family_name,
      halaqat (halaqa_id, name, students (student_id))
    `)
    .eq('status', 'active');

  if (error) throw error;
  return data;
};

export const getHalaqatStatus = async () => {
  const { data, error } = await supabase
    .from('halaqat')
    .select(`
      halaqa_id,
      name,
      level,
      capacity,
      enrollments (count)
    `);

  if (error) throw error;
  return data;
};

export const getGeneralKPIs = async () => {
  const [students, attendance, memorization] = await Promise.all([
    supabase.from('students').select('student_id', { count: 'exact' }),
    supabase.from('student_attendance').select('status'),
    supabase.from('memorization_progress').select('pages_count'),
  ]);

  const totalAttendance = attendance.data?.length || 0;
  const presentCount = attendance.data?.filter(a => a.status === 'حاضر').length || 0;
  const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

  const totalPages = memorization.data?.reduce((sum, item) => sum + Number(item.pages_count || 0), 0) || 0;

  return {
    totalStudents: students.count || 0,
    attendanceRate,
    totalPagesMemorized: totalPages,
  };
};
