import { supabase } from "@/shared/lib/supabase";

export interface Session {
  session_id: string;
  halaqa_id: string;
  session_date: string;
  status: "scheduled" | "completed" | "cancelled";
  start_time?: string;
  end_time?: string;
}

export const fetchHalaqaSessions = async (halaqaId: string) => {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("halaqa_id", halaqaId)
    .order("session_date", { ascending: false });

  if (error) throw error;
  return data as Session[];
};
