export const mapStudentError = (error: unknown): string => {
  const errStr = String(error);

  // You can add more specific Supabase error checks here if needed
  if (errStr.includes("duplicate key") || errStr.includes("unique constraint")) {
    return "هذا الطالب موجود بالفعل (رقم الهوية أو البيانات الأساسية متكررة).";
  }
  if (errStr.includes("violates foreign key constraint")) {
    return "هناك خطأ في البيانات المرتبطة (مثل الحلقة أو المعلم غير موجود).";
  }
  if (errStr.includes("network") || errStr.includes("Failed to fetch")) {
    return "مشكلة في الاتصال بالشبكة. يرجى التأكد من اتصالك بالإنترنت.";
  }
  if (errStr.includes("permission denied") || errStr.includes("row-level security")) {
    return "ليس لديك الصلاحية لإجراء هذا التعديل.";
  }
  if (errStr.includes("birth_date") || errStr.includes("invalid input syntax for type date")) {
     return "تاريخ الميلاد المدخل غير صحيح. يرجى التأكد من اختيار تاريخ صحيح أو تركه فارغاً.";
  }

  // Fallback
  return "حدث خطأ غير متوقع أثناء حفظ بيانات الطالب. يرجى المحاولة مرة أخرى.";
};
