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
}

export type CreateHalaqaInput = Omit<Halaqa, "halaqa_id" | "created_at" | "updated_at">;
export type UpdateHalaqaInput = Partial<CreateHalaqaInput>;
