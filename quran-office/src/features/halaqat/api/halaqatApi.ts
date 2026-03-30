import { supabase } from "@/shared/lib/supabase";

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

export const fetchHalaqat = async () => {
  const { data, error } = await supabase
    .from("halaqat")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data as Halaqa[];
};
