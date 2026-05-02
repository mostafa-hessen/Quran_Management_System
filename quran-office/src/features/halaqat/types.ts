export interface Schedule {
  schedule_id: string;
  halaqa_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface Halaqa {
  halaqa_id: string;
  teacher_id: string | null;
  name: string;
  level: string | null;
  capacity: number;
  location: string | null;
  description: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  
  // Relational data
  teacher?: {
    full_name: string;
    avatar_url?: string;
  };
  schedules?: Schedule[];
  student_count?: number;
}

export type CreateHalaqaInput = Omit<Halaqa, "halaqa_id" | "created_at" | "updated_at" | "teacher" | "schedules" | "student_count">;
export type UpdateHalaqaInput = Partial<CreateHalaqaInput>;

export interface CreateScheduleInput extends Omit<Schedule, "schedule_id"> {}

