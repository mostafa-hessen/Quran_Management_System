import { supabase } from "@/shared/lib/supabase";

export interface Schedule {
  schedule_id: string;
  halaqa_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export type CreateScheduleInput = Omit<Schedule, "schedule_id">;

export const fetchHalaqaSchedules = async (halaqaId: string) => {
  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .eq("halaqa_id", halaqaId);

  if (error) throw error;
  return data as Schedule[];
};

export const createSchedule = async (schedule: CreateScheduleInput) => {
  const { data, error } = await supabase
    .from("schedules")
    .insert([schedule])
    .select()
    .single();

  if (error) throw error;
  return data as Schedule;
};

export const updateSchedule = async (scheduleId: string, updates: Partial<CreateScheduleInput>) => {
  const { data, error } = await supabase
    .from("schedules")
    .update(updates)
    .eq("schedule_id", scheduleId)
    .select()
    .single();

  if (error) throw error;
  return data as Schedule;
};

export const deleteSchedule = async (scheduleId: string) => {
  const { error } = await supabase
    .from("schedules")
    .delete()
    .eq("schedule_id", scheduleId);

  if (error) throw error;
};
