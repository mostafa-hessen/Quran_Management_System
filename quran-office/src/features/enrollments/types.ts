// src/features/enrollments/types.ts

export interface Enrollment {
  enrollment_id: string;
  student_id: string;
  halaqa_id: string;
  join_date: string;
  subscription_status: "pending" | "active" | "inactive";
  
  // Relational data
  student?: {
    student_id: string;
    first_name: string;
    last_name: string;
    gender: string;
  };
  halaqa?: {
    halaqa_id: string;
    name: string;
    level: string | null;
  };
}
