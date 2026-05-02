import { supabase } from '@/shared/lib/supabase';
import type { StaffMember, CreateStaffInput, UpdateStaffInput } from '../types';
import { getErrorMessage } from '@/shared/utils/errorHandler';

// ─────────────────────────────────────────────────────────────────────────────
// STAFF MANAGEMENT API (PostgreSQL RPC Driven)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all staff members.
 * Reads from profiles table.
 */
export const getStaffMembers = async (): Promise<StaffMember[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, full_name, phone, role, status, teacher_id, hire_date, notes, created_at, updated_at,
        teachers:teacher_id (
          first_name, father_name, grandfather_name, family_name,
          phones:teacher_phones (phone, label)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((p: any) => ({
      id: p.id,
      email: '', 
      full_name: p.full_name || '',
      first_name: p.teachers?.first_name,
      father_name: p.teachers?.father_name,
      grandfather_name: p.teachers?.grandfather_name,
      family_name: p.teachers?.family_name,
      phone: p.phone,
      phones: p.teachers?.phones || [], // Mapping multiple phones
      role: p.role,
      status: p.status || 'active',
      teacher_id: p.teacher_id,
      hire_date: p.hire_date,
      notes: p.notes,
      created_at: p.created_at,
      updated_at: p.updated_at,
    })) as StaffMember[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Create a new staff member.
 */
export const createStaffMember = async (input: CreateStaffInput): Promise<StaffMember> => {
  try {
    const { data, error } = await supabase.functions.invoke('admin-create-user', {
      body: input,
    });

    if (error) {
      if (error.context && typeof error.context.json === 'function') {
        const errBody = await error.context.json();
        throw new Error(errBody.error || errBody.message || 'حدث خطأ في الخادم (Edge Function)');
      }
      throw error;
    }
    if (data?.error) throw new Error(data.error);

    return data.staff as StaffMember;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Update an existing staff member.
 */
export const updateStaffMember = async (id: string, updates: any): Promise<void> => {
  try {
    const { error } = await supabase.rpc('admin_update_user', {
      p_user_id: id,
      p_first_name: updates.first_name,
      p_father_name: updates.father_name,
      p_grandfather_name: updates.grandfather_name,
      p_family_name: updates.family_name,
      p_role: updates.role,
      p_phone: updates.phone, // Primary phone
      p_phones: updates.phones, // Array of phones
      p_notes: updates.notes,
      p_specializations: updates.specializations,
      p_tajweed_level: updates.tajweed_level,
      p_birth_date: updates.birth_date,
    });

    if (error) throw error;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Deactivate a staff member.
 */
export const deactivateStaffMember = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('admin_delete_user', {
      p_user_id: id
    });

    if (error) throw error;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Reset staff member password (Admin action).
 */
export const resetStaffPassword = async (userId: string, newPassword: string): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('admin-create-user', {
      body: { action: 'reset_password', userId, password: newPassword },
    });

    if (error) {
      if (error.context && typeof error.context.json === 'function') {
        const errBody = await error.context.json();
        throw new Error(errBody.error || errBody.message || 'حدث خطأ في الخادم (Edge Function)');
      }
      throw error;
    }
    if (data?.error) throw new Error(data.error);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
