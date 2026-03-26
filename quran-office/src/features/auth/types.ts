import type { User as SupabaseUser } from '@supabase/supabase-js';

export enum Role {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  TEACHER = 'teacher',
}


export interface UserProfile {
  id: string;
  role: Role;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: SupabaseUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}
