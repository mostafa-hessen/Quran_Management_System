// تعريف مبدئي لنوع المعلم لحين توليد database.types.ts
export interface Teacher {
  id: string; // auth.users id
  internal_id?: number | null;
  name: string;
  gender: 'Male' | 'Female';
  phone?: string | null;
  identity_number?: string | null;
  address?: string | null;
  qualification?: string | null;
  job_status?: 'Active' | 'Inactive' | 'Leave' | 'Suspended';
  account_status?: 'Active' | 'Suspended' | 'Pending';
  created_at?: string;
}

export type CreateTeacherInput = Omit<Teacher, 'id' | 'internal_id' | 'created_at'>;
export type UpdateTeacherInput = Partial<CreateTeacherInput>;
