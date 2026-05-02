/**
 * Centralized Error Handling Utility
 * Maps Supabase and API errors to user-friendly Arabic messages.
 */

export interface AppError {
  message: string;
  code?: string;
  originalError?: any;
}

const ERROR_MAP: Record<string, string> = {
  // Supabase / Postgres Codes
  '23505': 'هذه البيانات مسجلة بالفعل، يرجى استخدام بيانات مختلفة.',
  '23503': 'لا يمكن إتمام العملية لوجود بيانات مرتبطة بها في جداول أخرى.',
  '23514': 'البيانات المدخلة تخالف شروط النظام (مثلاً: المستوى غير صحيح أو السعة خارج النطاق).',
  '42501': 'ليس لديك الصلاحيات الكافية لتنفيذ هذا الإجراء (RLS violation).',
  '42P01': 'خطأ تقني: الجدول المطلوب غير موجود في قاعدة البيانات.',
  '42703': 'حدث خطأ في استرجاع البيانات (حقل غير معرف). يرجى الاتصال بالدعم الفني.',
  'PGRST116': 'لم يتم العثور على البيانات المطلوبة.',
  
  // Auth Errors
  'user_already_exists': 'البريد الإلكتروني مسجل مسبقاً لمستخدم آخر.',
  'invalid_credentials': 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور.',
  'email_not_confirmed': 'يرجى تأكيد البريد الإلكتروني أولاً من خلال الرابط المرسل إليك.',
  
  // Custom RPC Errors
  'unauthorized': 'غير مصرح لك بالقيام بهذه العملية، يرجى تسجيل الدخول بصلاحيات مناسبة.',
  'weak_password': 'كلمة المرور ضعيفة جداً، يجب أن تحتوي على 6 رموز على الأقل.',
  'invalid_phone': 'رقم الجوال المدخل غير صحيح.',
  'supervisor_cannot_edit_admin': 'لا يمكن للمشرف تعديل بيانات مدير النظام.',
  'email_exists': 'هذا البريد الإلكتروني مسجل لموظف آخر بالفعل.',
  'P0001': 'فشلت العملية بسبب تعارض في البيانات أو الصلاحيات البرمجية.',
};

/**
 * Handles error and returns an AppError object with Arabic message
 */
export const handleAppError = (error: any): AppError => {
  console.error('[AppError Detail]', {
    code: error?.code,
    message: error?.message,
    details: error?.details,
    hint: error?.hint
  });

  // Extract message and code from Supabase error structure
  const code = error?.code || error?.error_description || error?.message;
  const message = error?.message || '';

  // 1. Check direct map
  if (code && ERROR_MAP[code]) {
    return { message: ERROR_MAP[code], code, originalError: error };
  }

  // 2. Check for check constraints specifically
  if (message.includes('violates check constraint') || code === '23514') {
    if (message.includes('halaqat_level_check')) {
      return { message: 'المستوى المختار غير صالح. يجب الاختيار من (مبتدئ، متوسط، متقدم).', code: '23514', originalError: error };
    }
    return { message: ERROR_MAP['23514'], code: '23514', originalError: error };
  }

  // 3. Check for RLS policy violation specifically
  if (message.includes('row-level security policy') || code === '42501') {
    return { message: 'ليس لديك الصلاحية لإضافة أو تعديل البيانات في هذا الجدول (RLS).', code: '42501', originalError: error };
  }

  // 4. Check for keywords in message
  if (message.includes('unique constraint') || message.includes('already exists')) {
    return { message: 'هذه البيانات مسجلة مسبقاً.', code: 'duplicate', originalError: error };
  }

  if (message.includes('permission denied')) {
    return { message: 'تم رفض الإذن للوصول لهذه البيانات.', code: 'unauthorized', originalError: error };
  }
  
  if (message.includes('network') || message.includes('fetch')) {
    return { message: 'خطأ في الاتصال بالشبكة، يرجى التأكد من اتصال الإنترنت.', code: 'network_error', originalError: error };
  }

  // 5. Fallback
  return { 
    message: message || 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى.', 
    code: code || 'unknown',
    originalError: error 
  };
};

/**
 * Convenience function to get just the message string
 */
export const getErrorMessage = (error: any): string => {
  return handleAppError(error).message;
};
