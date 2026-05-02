export enum StudentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export const GENDER_OPTIONS = ["ذكر", "أنثى"] as const;
export type Gender = (typeof GENDER_OPTIONS)[number];

export const RELATION_OPTIONS = [
  "أب",
  "أم",
  "جد",
  "جدة",
  "أخ",
  "أخت",
  "ولي أمر",
  "آخر",
] as const;
export type Relation = (typeof RELATION_OPTIONS)[number];

export const PHONE_LABEL_OPTIONS = [
  "شخصي",
  "عمل",
  "واتساب",
  "منزل",
  "أساسي",
  "أخرى",
] as const;
export type PhoneLabel = (typeof PHONE_LABEL_OPTIONS)[number];

export interface Student {
  student_id: string;
  first_name: string;
  father_name: string | null;
  grandfather_name: string | null;
  family_name: string;
  birth_date: string | null;
  gender: Gender | null;
  address: string | null;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
}

export interface StudentGuardianPhone {
  phone_id: string;
  student_id: string;
  phone: string;
  guardian_relation: Relation;
  label: PhoneLabel;
}

export interface FullStudentData extends Student {
  phones?: StudentGuardianPhone[];
}

// Form specific types
export interface PhoneFormEntry {
  id: string; // Used for react-hook-form field array key
  phone: string;
  guardian_relation: Relation;
  label: PhoneLabel;
}

export interface StudentFormData {
  first_name: string;
  father_name: string;
  grandfather_name: string;
  family_name: string;
  gender: Gender;
  birth_date: string;
  address: string;
  phones: PhoneFormEntry[];
}

export interface StudentsState {
  students: Student[];
  loading: boolean;
  error: string | null;
  setStudents: (students: Student[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface StudentUIState {
  isAddOpen: boolean;
  selectedStudent: Student | null;
  openAdd: () => void;
  closeAdd: () => void;
  isEditOpen: boolean;
  closeEdit: () => void;
  openEdit: (student: Student) => void;
  isProfileOpen: boolean;
  openProfile: (student: Student) => void;
  closeProfile: () => void;
}
