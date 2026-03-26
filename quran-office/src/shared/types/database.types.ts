export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string
          ip_address: unknown
          log_id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          ip_address?: unknown
          log_id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          ip_address?: unknown
          log_id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          enrollment_id: string
          halaqa_id: string
          join_date: string
          student_id: string
          subscription_status: string | null
        }
        Insert: {
          enrollment_id?: string
          halaqa_id: string
          join_date?: string
          student_id: string
          subscription_status?: string | null
        }
        Update: {
          enrollment_id?: string
          halaqa_id?: string
          join_date?: string
          student_id?: string
          subscription_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_halaqa_id_fkey"
            columns: ["halaqa_id"]
            isOneToOne: false
            referencedRelation: "halaqat"
            referencedColumns: ["halaqa_id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      halaqat: {
        Row: {
          capacity: number
          created_at: string
          description: string | null
          halaqa_id: string
          level: string | null
          location: string | null
          name: string
          status: string
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          description?: string | null
          halaqa_id?: string
          level?: string | null
          location?: string | null
          name: string
          status?: string
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string | null
          halaqa_id?: string
          level?: string | null
          location?: string | null
          name?: string
          status?: string
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "halaqat_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      homework: {
        Row: {
          created_at: string
          description: string | null
          due_session_id: string | null
          homework_id: string
          scope: string
          session_id: string
          student_id: string | null
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_session_id?: string | null
          homework_id?: string
          scope?: string
          session_id: string
          student_id?: string | null
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_session_id?: string | null
          homework_id?: string
          scope?: string
          session_id?: string
          student_id?: string | null
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_due_session_id_fkey"
            columns: ["due_session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "homework_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "homework_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      homework_submissions: {
        Row: {
          evaluation: string | null
          grade: number | null
          homework_id: string
          notes: string | null
          student_id: string
          submission_id: string
          submitted_at: string | null
        }
        Insert: {
          evaluation?: string | null
          grade?: number | null
          homework_id: string
          notes?: string | null
          student_id: string
          submission_id?: string
          submitted_at?: string | null
        }
        Update: {
          evaluation?: string | null
          grade?: number | null
          homework_id?: string
          notes?: string | null
          student_id?: string
          submission_id?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "homework_submissions_homework_id_fkey"
            columns: ["homework_id"]
            isOneToOne: false
            referencedRelation: "homework"
            referencedColumns: ["homework_id"]
          },
          {
            foreignKeyName: "homework_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      memorization_history: {
        Row: {
          ayah_from: number | null
          ayah_to: number | null
          id: string
          notes: string | null
          pages_count: number | null
          quality: string | null
          recorded_at: string
          session_id: string | null
          student_id: string
          surah: string
          teacher_id: string | null
        }
        Insert: {
          ayah_from?: number | null
          ayah_to?: number | null
          id?: string
          notes?: string | null
          pages_count?: number | null
          quality?: string | null
          recorded_at?: string
          session_id?: string | null
          student_id: string
          surah: string
          teacher_id?: string | null
        }
        Update: {
          ayah_from?: number | null
          ayah_to?: number | null
          id?: string
          notes?: string | null
          pages_count?: number | null
          quality?: string | null
          recorded_at?: string
          session_id?: string | null
          student_id?: string
          surah?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memorization_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "memorization_history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "memorization_history_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      memorization_progress: {
        Row: {
          ayah: number | null
          id: string
          pages_count: number | null
          quality: string | null
          session_id: string | null
          student_id: string
          surah: string
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          ayah?: number | null
          id?: string
          pages_count?: number | null
          quality?: string | null
          session_id?: string | null
          student_id: string
          surah: string
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          ayah?: number | null
          id?: string
          pages_count?: number | null
          quality?: string | null
          session_id?: string | null
          student_id?: string
          surah?: string
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memorization_progress_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "memorization_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "memorization_progress_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          is_read: boolean
          notification_id: string
          recipient_id: string
          related_id: string | null
          related_table: string | null
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          is_read?: boolean
          notification_id?: string
          recipient_id: string
          related_id?: string | null
          related_table?: string | null
          title: string
          type: string
        }
        Update: {
          body?: string | null
          created_at?: string
          is_read?: boolean
          notification_id?: string
          recipient_id?: string
          related_id?: string | null
          related_table?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          method: string
          notes: string | null
          payment_date: string
          payment_id: string
          receipt_number: string | null
          status: string
          subscription_id: string
        }
        Insert: {
          amount: number
          method: string
          notes?: string | null
          payment_date?: string
          payment_id?: string
          receipt_number?: string | null
          status?: string
          subscription_id: string
        }
        Update: {
          amount?: number
          method?: string
          notes?: string | null
          payment_date?: string
          payment_id?: string
          receipt_number?: string | null
          status?: string
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["subscription_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          role: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      report_cards: {
        Row: {
          attendance_pct: number | null
          card_id: string
          halaqa_id: string | null
          hw_avg_score: number | null
          issued_at: string
          issued_by: string | null
          mem_pages_added: number | null
          overall_grade: string | null
          period_end: string
          period_start: string
          period_type: string | null
          student_id: string
          teacher_notes: string | null
        }
        Insert: {
          attendance_pct?: number | null
          card_id?: string
          halaqa_id?: string | null
          hw_avg_score?: number | null
          issued_at?: string
          issued_by?: string | null
          mem_pages_added?: number | null
          overall_grade?: string | null
          period_end: string
          period_start: string
          period_type?: string | null
          student_id: string
          teacher_notes?: string | null
        }
        Update: {
          attendance_pct?: number | null
          card_id?: string
          halaqa_id?: string | null
          hw_avg_score?: number | null
          issued_at?: string
          issued_by?: string | null
          mem_pages_added?: number | null
          overall_grade?: string | null
          period_end?: string
          period_start?: string
          period_type?: string | null
          student_id?: string
          teacher_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_cards_halaqa_id_fkey"
            columns: ["halaqa_id"]
            isOneToOne: false
            referencedRelation: "halaqat"
            referencedColumns: ["halaqa_id"]
          },
          {
            foreignKeyName: "report_cards_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_cards_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      schedules: {
        Row: {
          day_of_week: string
          end_time: string
          halaqa_id: string
          schedule_id: string
          start_time: string
        }
        Insert: {
          day_of_week: string
          end_time: string
          halaqa_id: string
          schedule_id?: string
          start_time: string
        }
        Update: {
          day_of_week?: string
          end_time?: string
          halaqa_id?: string
          schedule_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_halaqa_id_fkey"
            columns: ["halaqa_id"]
            isOneToOne: false
            referencedRelation: "halaqat"
            referencedColumns: ["halaqa_id"]
          },
        ]
      }
      sessions: {
        Row: {
          cancellation_reason: string | null
          created_at: string
          halaqa_id: string
          session_date: string
          session_id: string
          status: string
          substitute_teacher_id: string | null
          updated_at: string
        }
        Insert: {
          cancellation_reason?: string | null
          created_at?: string
          halaqa_id: string
          session_date: string
          session_id?: string
          status?: string
          substitute_teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          cancellation_reason?: string | null
          created_at?: string
          halaqa_id?: string
          session_date?: string
          session_id?: string
          status?: string
          substitute_teacher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_halaqa_id_fkey"
            columns: ["halaqa_id"]
            isOneToOne: false
            referencedRelation: "halaqat"
            referencedColumns: ["halaqa_id"]
          },
          {
            foreignKeyName: "sessions_substitute_teacher_id_fkey"
            columns: ["substitute_teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      student_attendance: {
        Row: {
          attendance_id: string
          notes: string | null
          session_id: string
          status: string
          student_id: string
        }
        Insert: {
          attendance_id?: string
          notes?: string | null
          session_id: string
          status: string
          student_id: string
        }
        Update: {
          attendance_id?: string
          notes?: string | null
          session_id?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "student_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_guardian_phones: {
        Row: {
          guardian_relation: Database["public"]["Enums"]["relation_type"]
          label: Database["public"]["Enums"]["contact_label"] | null
          phone: string
          phone_id: string
          student_id: string
        }
        Insert: {
          guardian_relation: Database["public"]["Enums"]["relation_type"]
          label?: Database["public"]["Enums"]["contact_label"] | null
          phone: string
          phone_id?: string
          student_id: string
        }
        Update: {
          guardian_relation?: Database["public"]["Enums"]["relation_type"]
          label?: Database["public"]["Enums"]["contact_label"] | null
          phone?: string
          phone_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_guardian_phones_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          birth_date: string | null
          created_at: string
          family_name: string
          father_name: string | null
          first_name: string
          gender: string | null
          grandfather_name: string | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          family_name: string
          father_name?: string | null
          first_name: string
          gender?: string | null
          grandfather_name?: string | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          created_at?: string
          family_name?: string
          father_name?: string | null
          first_name?: string
          gender?: string | null
          grandfather_name?: string | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          end_date: string
          start_date: string
          status: string
          student_id: string
          subscription_id: string
          total_amount: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          start_date: string
          status?: string
          student_id: string
          subscription_id?: string
          total_amount: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          start_date?: string
          status?: string
          student_id?: string
          subscription_id?: string
          total_amount?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["student_id"]
          },
        ]
      }
      teacher_attendance: {
        Row: {
          attendance_id: string
          notes: string | null
          session_id: string
          status: string
          teacher_id: string
        }
        Insert: {
          attendance_id?: string
          notes?: string | null
          session_id: string
          status: string
          teacher_id: string
        }
        Update: {
          attendance_id?: string
          notes?: string | null
          session_id?: string
          status?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "teacher_attendance_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      teacher_emails: {
        Row: {
          email: string
          email_id: string
          label: Database["public"]["Enums"]["contact_label"] | null
          teacher_id: string
        }
        Insert: {
          email: string
          email_id?: string
          label?: Database["public"]["Enums"]["contact_label"] | null
          teacher_id: string
        }
        Update: {
          email?: string
          email_id?: string
          label?: Database["public"]["Enums"]["contact_label"] | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_emails_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      teacher_phones: {
        Row: {
          label: Database["public"]["Enums"]["contact_label"] | null
          phone: string
          phone_id: string
          teacher_id: string
        }
        Insert: {
          label?: Database["public"]["Enums"]["contact_label"] | null
          phone: string
          phone_id?: string
          teacher_id: string
        }
        Update: {
          label?: Database["public"]["Enums"]["contact_label"] | null
          phone?: string
          phone_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_phones_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      teacher_qualifications: {
        Row: {
          qual_id: string
          qualification: string
          teacher_id: string
        }
        Insert: {
          qual_id?: string
          qualification: string
          teacher_id: string
        }
        Update: {
          qual_id?: string
          qualification?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_qualifications_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      teacher_specializations: {
        Row: {
          spec_id: string
          specialization: Database["public"]["Enums"]["specialization_type"]
          teacher_id: string
        }
        Insert: {
          spec_id?: string
          specialization: Database["public"]["Enums"]["specialization_type"]
          teacher_id: string
        }
        Update: {
          spec_id?: string
          specialization?: Database["public"]["Enums"]["specialization_type"]
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_specializations_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      teachers: {
        Row: {
          birth_date: string | null
          created_at: string
          family_name: string
          father_name: string | null
          first_name: string
          grandfather_name: string | null
          hire_date: string | null
          profile_id: string | null
          status: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          family_name: string
          father_name?: string | null
          first_name: string
          grandfather_name?: string | null
          hire_date?: string | null
          profile_id?: string | null
          status?: string
          teacher_id?: string
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          family_name?: string
          father_name?: string | null
          first_name?: string
          grandfather_name?: string | null
          hire_date?: string | null
          profile_id?: string | null
          status?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teachers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: { Args: never; Returns: string }
      get_subscription_balance: {
        Args: { p_subscription_id: string }
        Returns: number
      }
    }
    Enums: {
      contact_label: "╪┤╪«╪╡┘è" | "╪╣┘à┘ä" | "┘ê╪º╪¬╪│╪º╪¿" | "┘à┘å╪▓┘ä" | "╪ú╪│╪º╪│┘è" | "╪ú╪«╪▒┘ë"
      relation_type:
        | "╪ú╪¿"
        | "╪ú┘à"
        | "╪¼╪»"
        | "╪¼╪»╪⌐"
        | "╪ú╪«"
        | "╪ú╪«╪¬"
        | "┘ê┘ä┘è ╪ú┘à╪▒"
        | "╪ó╪«╪▒"
      specialization_type: "╪¬╪¼┘ê┘è╪»" | "╪¡┘ü╪╕" | "┘à╪▒╪º╪¼╪╣╪⌐" | "╪¬┘ä╪º┘ê╪⌐" | "╪ú╪«╪▒┘ë"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      contact_label: ["╪┤╪«╪╡┘è", "╪╣┘à┘ä", "┘ê╪º╪¬╪│╪º╪¿", "┘à┘å╪▓┘ä", "╪ú╪│╪º╪│┘è", "╪ú╪«╪▒┘ë"],
      relation_type: ["╪ú╪¿", "╪ú┘à", "╪¼╪»", "╪¼╪»╪⌐", "╪ú╪«", "╪ú╪«╪¬", "┘ê┘ä┘è ╪ú┘à╪▒", "╪ó╪«╪▒"],
      specialization_type: ["╪¬╪¼┘ê┘è╪»", "╪¡┘ü╪╕", "┘à╪▒╪º╪¼╪╣╪⌐", "╪¬┘ä╪º┘ê╪⌐", "╪ú╪«╪▒┘ë"],
    },
  },
} as const
