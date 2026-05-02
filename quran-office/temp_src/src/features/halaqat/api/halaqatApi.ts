import { supabase } from "@/shared/lib/supabase";
import type { Halaqa, CreateHalaqaInput, UpdateHalaqaInput } from "../types";

export const fetchHalaqat = async () => {
  const { data, error } = await supabase
    .from("halaqat")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data as Halaqa[];
};

export const fetchHalaqaById = async (halaqaId: string) => {
  const { data, error } = await supabase
    .from("halaqat")
    .select("*")
    .eq("halaqa_id", halaqaId)
    .single();

  if (error) throw error;
  return data as Halaqa;
};

export const createHalaqa = async (halaqa: CreateHalaqaInput) => {
  const { data, error } = await supabase
    .from("halaqat")
    .insert([halaqa])
    .select()
    .single();

  if (error) throw error;
  return data as Halaqa;
};

export const updateHalaqa = async (halaqaId: string, updates: UpdateHalaqaInput) => {
  const { data, error } = await supabase
    .from("halaqat")
    .update(updates)
    .eq("halaqa_id", halaqaId)
    .select()
    .single();

  if (error) throw error;
  return data as Halaqa;
};

export const deleteHalaqa = async (halaqaId: string) => {
  const { error } = await supabase
    .from("halaqat")
    .delete()
    .eq("halaqa_id", halaqaId);

  if (error) throw error;
};
