import { supabase } from '../../../shared/lib/supabase';
import type { Teacher, CreateTeacherInput, UpdateTeacherInput } from '../types/index';

export const getTeachers = async (): Promise<Teacher[]> => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Teacher[];
};

export const getTeacherById = async (id: string): Promise<Teacher> => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Teacher;
};

export const createTeacher = async (data: CreateTeacherInput): Promise<Teacher> => {
  const { data: teacher, error } = await supabase
    .from('teachers')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return teacher as Teacher;
};

export const updateTeacher = async (id: string, data: UpdateTeacherInput): Promise<Teacher> => {
  const { data: teacher, error } = await supabase
    .from('teachers')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return teacher as Teacher;
};

export const deleteTeacher = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
