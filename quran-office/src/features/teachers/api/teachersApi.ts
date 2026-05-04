import { supabase } from '../../../shared/lib/supabase';
import type { Teacher, CreateTeacherInput, UpdateTeacherInput } from '../types/index';

export const getTeachers = async (): Promise<Teacher[]> => {
  const { data, error } = await supabase
    .from('teachers')
    .select(`
      *,
      profiles:profile_id (
        full_name,
        email
      ),
      phones:teacher_phones (phone, label),
      specializations:teacher_specializations (specialization),
      halaqat (halaqa_id, name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map((t: any) => ({
    ...t,
    full_name: t.profiles?.full_name || [t.first_name, t.father_name, t.family_name].filter(Boolean).join(' '),
    email: t.profiles?.email,
    phones: t.phones || [],
    specializations: t.specializations?.map((s: any) => s.specialization) || [],
    halaqat: t.halaqat || []
  })) as unknown as Teacher[];
};

export const getTeacherById = async (id: string): Promise<Teacher> => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('teacher_id', id)
    .single();

  if (error) throw error;
  return data as unknown as Teacher;
};

export const createTeacher = async (data: CreateTeacherInput): Promise<Teacher> => {
  const { data: teacher, error } = await supabase
    .from('teachers')
    .insert([data as any])
    .select()
    .single();

  if (error) throw error;
  return teacher as unknown as Teacher;
};

export const updateTeacher = async (id: string, data: UpdateTeacherInput): Promise<Teacher> => {
  const { data: teacher, error } = await supabase
    .from('teachers')
    .update(data as any)
    .eq('teacher_id', id)
    .select()
    .single();

  if (error) throw error;
  return teacher as unknown as Teacher;
};

export const deleteTeacher = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('teacher_id', id);

  if (error) throw error;
};
