import { supabase } from '@/shared/lib/supabase';
import type { Role } from '../types';

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;

  // التحقق من حالة الحساب
  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', data.user.id)
    .single();

  if (profile?.status === 'inactive') {
    await supabase.auth.signOut();
    throw new Error('حسابك موقوف حالياً. يرجى مراجعة الإدارة.');
  }

  return data;
};

export const signUpWithEmail = async (email: string, password: string, role: Role, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        full_name: fullName,
      }
    }
  });

  if (error) throw error;
  return data;
};
