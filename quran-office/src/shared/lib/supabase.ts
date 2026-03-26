import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/shared/types/database.types'
 
const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
 
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL و Anon Key مطلوبان في ملف .env')
}
 
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
 