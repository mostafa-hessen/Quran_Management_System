import { supabase } from "@/shared/lib/supabase";
import type { CreateAuditLogInput } from "../types/auditLogs";

export const createAuditLog = async (log: CreateAuditLogInput) => {
  const { data, error } = await supabase
    .from("audit_log")
    .insert([{
      ...log
    }])
    .select()
    .single();

  if (error) {
    console.error("Audit log failed:", error);
    // Don't throw error to user for audit log failure, just log it
    return null;
  }
  return data;
};

export const getAuditLogs = async () => {
  const { data, error } = await supabase
    .from("audit_log")
    .select(`
      *,
      profiles:user_id (
        full_name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  return data.map((log: any) => ({
    ...log,
    user_name: log.profiles?.full_name || 'النظام'
  }));
};
