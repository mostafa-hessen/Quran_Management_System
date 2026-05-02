import { supabase } from "@/shared/lib/supabase";
import type { Halaqa, CreateHalaqaInput, UpdateHalaqaInput } from "../types";

export const fetchHalaqat = async () => {
  const { data, error } = await supabase
    .from("halaqat")
    .select(`
      *,
      teacher:teachers(profiles:profile_id(full_name)),
      schedules(*),
      enrollments:enrollments(count)
    `)
    .order("name", { ascending: true });

  if (error) throw error;

  const transformedData = data.map(h => ({
    ...h,
    student_count: h.enrollments?.[0]?.count || 0,
    teacher: (h.teacher as any)?.profiles ? {
      full_name: (h.teacher as any).profiles.full_name
    } : null
  }));

  return transformedData as Halaqa[];
};

export const fetchHalaqaById = async (halaqaId: string) => {
  const { data, error } = await supabase
    .from("halaqat")
    .select(`*, teacher:teachers(profiles:profile_id(full_name)), schedules(*)`)
    .eq("halaqa_id", halaqaId)
    .single();

  if (error) throw error;

  const transformed = {
    ...data,
    teacher: (data.teacher as any)?.profiles ? {
      full_name: (data.teacher as any).profiles.full_name
    } : null
  };

  return transformed as Halaqa;
};

export const createHalaqa = async (halaqa: CreateHalaqaInput & { schedules?: any[] }) => {
  const { schedules, ...halaqaData } = halaqa;
  
  const { data, error } = await supabase
    .from("halaqat")
    .insert([halaqaData])
    .select()
    .single();

  if (error) throw error;

  if (schedules && schedules.length > 0) {
    const schedulesWithId = schedules.map(s => ({
      ...s,
      halaqa_id: data.halaqa_id
    }));
    
    const { error: scheduleError } = await supabase
      .from("schedules")
      .insert(schedulesWithId);
      
    if (scheduleError) throw scheduleError;
  }


  return data as Halaqa;
};

export const updateHalaqa = async (halaqaId: string, updates: UpdateHalaqaInput & { schedules?: any[] }) => {
  const { schedules, ...halaqaUpdates } = updates;
  
  const { data: previousData } = await supabase
    .from("halaqat")
    .select("*")
    .eq("halaqa_id", halaqaId)
    .single();

  const { data, error } = await supabase
    .from("halaqat")
    .update(halaqaUpdates)
    .eq("halaqa_id", halaqaId)
    .select()
    .single();

  if (error) throw error;

  if (schedules) {
    // Smarter sync to avoid audit log noise
    const { data: existingSchedules } = await supabase
      .from("schedules")
      .select("*")
      .eq("halaqa_id", halaqaId);

    const existing = existingSchedules || [];
    
    // Key generator for comparison
    const getSKey = (s: any) => `${s.day_of_week}-${s.start_time}-${s.end_time}`;
    
    const existingKeys = new Set(existing.map(getSKey));
    const newKeys = new Set(schedules.map(getSKey));

    // 1. Delete schedules that are not in the new list
    const toDelete = existing.filter(s => !newKeys.has(getSKey(s)));
    if (toDelete.length > 0) {
      await supabase
        .from("schedules")
        .delete()
        .in("schedule_id", toDelete.map(s => s.schedule_id));
    }

    // 2. Insert schedules that are not in the existing list
    const toInsert = schedules
      .filter(s => !existingKeys.has(getSKey(s)))
      .map(s => ({ ...s, halaqa_id: halaqaId }));
      
    if (toInsert.length > 0) {
      const { error: scheduleError } = await supabase
        .from("schedules")
        .insert(toInsert);
      if (scheduleError) throw scheduleError;
    }
  }


  return data as Halaqa;
};

export const deleteHalaqa = async (halaqaId: string) => {
  const { data: snapshot } = await supabase
    .from("halaqat")
    .select("*")
    .eq("halaqa_id", halaqaId)
    .single();

  const { error } = await supabase
    .from("halaqat")
    .delete()
    .eq("halaqa_id", halaqaId);

  if (error) throw error;

};
