
interface SupabaseError {
  code: string;
  message: string;
}

const ERROR_MAP: Record<string, string> = {
  "42501": "ليس لديك صلاحية لتنفيذ هذا الإجراء",
  "23505": "هذا السجل موجود بالفعل",
  "23503": "لا يمكن حذف هذا السجل لارتباطه ببيانات أخرى",
  "PGRST116": "لم يتم العثور على البيانات",
};

export const handleSupabaseError = (error: SupabaseError): never => {
  const message = ERROR_MAP[error.code] ?? "حدث خطأ، يرجى المحاولة مرة أخرى";
  throw new Error(message);
};