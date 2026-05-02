// Teacher Types
export type Specialization = 'حفظ' | 'تجويد' | 'كليهما';
export type TajweedLevel = 'مبتدئ' | 'متوسط' | 'متقدم' | 'مجاز';
export type TeacherStatus = 'active' | 'on_leave' | 'terminated';

export interface Teacher {
  teacher_id: string; // The primary key in `teachers` table
  profile_id?: string; // Optional reference to `profiles.id` (Supabase Auth)
  full_name: string;
  phone: string;
  email?: string;
  specialization: Specialization;
  tajweed_level: TajweedLevel;
  max_students: number;
  current_load?: number; // Calculated, or fetched from API (view/join)
  hire_date: string;
  status: TeacherStatus;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateTeacherInput = Omit<Teacher, 'teacher_id' | 'current_load' | 'created_at' | 'updated_at'>;
export type UpdateTeacherInput = Partial<CreateTeacherInput>;
