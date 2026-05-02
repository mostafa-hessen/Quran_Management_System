import { supabase } from "@/shared/lib/supabase";

export interface Homework {
  homework_id?: string;
  session_id?: string;
  due_session_id?: string;
  title: string;
  description?: string;
  type: "حفظ" | "مراجعة" | "تجويد" | "قراءة";
  scope: "general" | "personal";
  student_id?: string;
  created_at?: string;
}

export const createHomework = async (homework: Homework) => {
  const { data, error } = await supabase
    .from("homework")
    .insert([homework])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const fetchHalaqaHomework = async (halaqaId: string) => {
  const { data, error } = await supabase
    .from("homework")
    .select(`
      *,
      session: sessions!inner(*)
    `)
    .eq("sessions.halaqa_id", halaqaId);

  if (error) throw error;
  return data;
};
