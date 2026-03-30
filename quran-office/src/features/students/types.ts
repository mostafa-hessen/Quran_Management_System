export enum Gender {
  MALE = "ذكر",
  FEMALE = "أنثى",
}

export enum StudentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export interface Student {
  student_id: string;
  first_name: string;
  father_name: string | null;
  grandfather_name: string | null;
  family_name: string;
  birth_date: string | null;
  gender: string | null;
  address: string | null;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
}

export interface StudentGuardianPhone {
  phone_id: string;
  student_id: string;
  phone: string;
  guardian_relation:
    | "أب"
    | "أم"
    | "جد"
    | "جدة"
    | "أخ"
    | "أخت"
    | "ولي أمر"
    | "آخر";
  label: "شخصي" | "عمل" | "واتساب" | "منزل" | "أساسي" | "أخرى";
}

export interface FullStudentData extends Student {
  phones?: StudentGuardianPhone[];
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
}
