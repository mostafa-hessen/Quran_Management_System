// ======================================================
// Staff Management Types — إدارة الموظفين
// ======================================================

export type StaffRole = 'admin' | 'teacher' | 'supervisor';
export type StaffStatus = 'active' | 'inactive' | 'suspended';

export interface PhoneContact {
  phone: string;
  label: string;
}

// A staff member represents an authenticated user in the system
export interface StaffMember {
  id: string;               // Supabase Auth user ID (uuid)
  email: string;
  full_name: string;        // Combined name for UI
  first_name?: string;
  father_name?: string;
  grandfather_name?: string;
  family_name?: string;
  phone?: string;           // Primary phone
  phones?: PhoneContact[];  // List of all phones
  role: StaffRole;
  status: StaffStatus;
  teacher_id?: string;      // Set only if role === 'teacher'; links to teachers table
  hire_date?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// Input for creating a new staff member
export interface CreateStaffInput {
  email: string;
  password: string;
  first_name: string;
  father_name?: string;
  grandfather_name?: string;
  family_name: string;
  phone?: string;           // Primary phone
  phones?: PhoneContact[];  // Multi-phone support
  role: StaffRole;
  // Teacher-specific fields
  specializations?: string[]; // Array of specialization enums
  tajweed_level?: string;
  hire_date?: string;
  notes?: string;
}

export type UpdateStaffInput = Partial<Omit<CreateStaffInput, 'email' | 'password'>>;
