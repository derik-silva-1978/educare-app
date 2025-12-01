export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      child_anamnese: {
        Row: {
          birth_location: string | null
          birth_type: string | null
          blood_exams: string | null
          child_id: string
          completed: boolean
          completion_percentage: number
          created_at: string
          id: string
          immunization: string | null
          prenatal_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_location?: string | null
          birth_type?: string | null
          blood_exams?: string | null
          child_id: string
          completed?: boolean
          completion_percentage?: number
          created_at?: string
          id?: string
          immunization?: string | null
          prenatal_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_location?: string | null
          birth_type?: string | null
          blood_exams?: string | null
          child_id?: string
          completed?: boolean
          completion_percentage?: number
          created_at?: string
          id?: string
          immunization?: string | null
          prenatal_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_anamnese_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "educare_children"
            referencedColumns: ["id"]
          },
        ]
      }
      child_development_reports: {
        Row: {
          age_range_months: string
          answered_questions: number
          child_id: string
          completion_percentage: number
          concerns: string[] | null
          created_at: string
          dimension_scores: Json
          generated_at: string
          id: string
          overall_score: number
          recommendations: string[] | null
          report_data: Json
          session_id: string
          shared_with_professionals: boolean
          status: string
          total_questions: number
          updated_at: string
          user_id: string
        }
        Insert: {
          age_range_months: string
          answered_questions: number
          child_id: string
          completion_percentage: number
          concerns?: string[] | null
          created_at?: string
          dimension_scores?: Json
          generated_at?: string
          id?: string
          overall_score: number
          recommendations?: string[] | null
          report_data?: Json
          session_id: string
          shared_with_professionals?: boolean
          status?: string
          total_questions: number
          updated_at?: string
          user_id: string
        }
        Update: {
          age_range_months?: string
          answered_questions?: number
          child_id?: string
          completion_percentage?: number
          concerns?: string[] | null
          created_at?: string
          dimension_scores?: Json
          generated_at?: string
          id?: string
          overall_score?: number
          recommendations?: string[] | null
          report_data?: Json
          session_id?: string
          shared_with_professionals?: boolean
          status?: string
          total_questions?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_development_reports_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "educare_children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_development_reports_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "journey_bot_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      educare_children: {
        Row: {
          age: number
          birthdate: string
          bloodtype: string | null
          city: string | null
          cpf: string | null
          created_at: string | null
          first_name: string
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          journey_progress: number | null
          last_name: string
          name: string
          nationality: string | null
          observations: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age: number
          birthdate: string
          bloodtype?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          first_name: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          journey_progress?: number | null
          last_name: string
          name: string
          nationality?: string | null
          observations?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age?: number
          birthdate?: string
          bloodtype?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          first_name?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          journey_progress?: number | null
          last_name?: string
          name?: string
          nationality?: string | null
          observations?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      educare_professional_children: {
        Row: {
          child_id: string
          created_at: string | null
          id: string
          professional_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          child_id: string
          created_at?: string | null
          id?: string
          professional_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          child_id?: string
          created_at?: string | null
          id?: string
          professional_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "educare_professional_children_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "educare_children"
            referencedColumns: ["id"]
          },
        ]
      }
      educare_profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      journey_bot_questions: {
        Row: {
          active: boolean | null
          age_max_months: number
          age_max_weeks: number | null
          age_min_months: number
          age_min_weeks: number | null
          concern_level: number | null
          created_at: string | null
          dimension: Database["public"]["Enums"]["journey_bot_dimension"]
          feedback_no: string
          feedback_unknown: string
          feedback_yes: string
          id: string
          order_index: number
          question_text: string
          tips_no: string[] | null
          tips_unknown: string[] | null
          tips_yes: string[] | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          age_max_months: number
          age_max_weeks?: number | null
          age_min_months: number
          age_min_weeks?: number | null
          concern_level?: number | null
          created_at?: string | null
          dimension: Database["public"]["Enums"]["journey_bot_dimension"]
          feedback_no: string
          feedback_unknown: string
          feedback_yes: string
          id?: string
          order_index?: number
          question_text: string
          tips_no?: string[] | null
          tips_unknown?: string[] | null
          tips_yes?: string[] | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          age_max_months?: number
          age_max_weeks?: number | null
          age_min_months?: number
          age_min_weeks?: number | null
          concern_level?: number | null
          created_at?: string | null
          dimension?: Database["public"]["Enums"]["journey_bot_dimension"]
          feedback_no?: string
          feedback_unknown?: string
          feedback_yes?: string
          id?: string
          order_index?: number
          question_text?: string
          tips_no?: string[] | null
          tips_unknown?: string[] | null
          tips_yes?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      journey_bot_responses: {
        Row: {
          answer: number
          answer_text: string
          child_id: string
          created_at: string | null
          dimension: string
          feedback_provided: string | null
          id: string
          question_id: string | null
          question_text: string
          responded_at: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          answer: number
          answer_text: string
          child_id: string
          created_at?: string | null
          dimension: string
          feedback_provided?: string | null
          id?: string
          question_id?: string | null
          question_text: string
          responded_at?: string | null
          session_id: string
          user_id: string
        }
        Update: {
          answer?: number
          answer_text?: string
          child_id?: string
          created_at?: string | null
          dimension?: string
          feedback_provided?: string | null
          id?: string
          question_id?: string | null
          question_text?: string
          responded_at?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_bot_responses_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "educare_children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_bot_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "journey_bot_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_bot_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "journey_bot_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_bot_sessions: {
        Row: {
          answered_questions: number
          child_id: string
          completed_at: string | null
          created_at: string | null
          current_dimension: string | null
          id: string
          session_data: Json | null
          started_at: string | null
          status: string
          total_questions: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answered_questions?: number
          child_id: string
          completed_at?: string | null
          created_at?: string | null
          current_dimension?: string | null
          id?: string
          session_data?: Json | null
          started_at?: string | null
          status?: string
          total_questions?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answered_questions?: number
          child_id?: string
          completed_at?: string | null
          created_at?: string | null
          current_dimension?: string | null
          id?: string
          session_data?: Json | null
          started_at?: string | null
          status?: string
          total_questions?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_bot_sessions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "educare_children"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          active: boolean
          age_max_months: number
          age_min_months: number
          concern_level: number
          created_at: string
          dimension: string
          feedback_no: string
          feedback_unknown: string
          feedback_yes: string
          id: string
          order_index: number
          question_text: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          age_max_months: number
          age_min_months: number
          concern_level?: number
          created_at?: string
          dimension: string
          feedback_no: string
          feedback_unknown: string
          feedback_yes: string
          id?: string
          order_index?: number
          question_text: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          age_max_months?: number
          age_min_months?: number
          concern_level?: number
          created_at?: string
          dimension?: string
          feedback_no?: string
          feedback_unknown?: string
          feedback_yes?: string
          id?: string
          order_index?: number
          question_text?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_ai_summaries: {
        Row: {
          child_id: string
          generated_at: string
          group_id: string
          id: string
          insights: string[] | null
          key_topics: string[] | null
          period_end: string
          period_start: string
          recommendations: string[] | null
          sentiment_analysis: Json | null
          summary_content: string
          summary_type: string
        }
        Insert: {
          child_id: string
          generated_at?: string
          group_id: string
          id?: string
          insights?: string[] | null
          key_topics?: string[] | null
          period_end: string
          period_start: string
          recommendations?: string[] | null
          sentiment_analysis?: Json | null
          summary_content: string
          summary_type?: string
        }
        Update: {
          child_id?: string
          generated_at?: string
          group_id?: string
          id?: string
          insights?: string[] | null
          key_topics?: string[] | null
          period_end?: string
          period_start?: string
          recommendations?: string[] | null
          sentiment_analysis?: Json | null
          summary_content?: string
          summary_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_ai_summaries_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "educare_children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_ai_summaries_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "team_whatsapp_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      team_group_messages: {
        Row: {
          file_url: string | null
          group_id: string
          id: string
          is_ai_processed: boolean
          message_content: string
          message_type: string
          sender_id: string
          sender_name: string
          sender_role: string
          sent_at: string
        }
        Insert: {
          file_url?: string | null
          group_id: string
          id?: string
          is_ai_processed?: boolean
          message_content: string
          message_type?: string
          sender_id: string
          sender_name: string
          sender_role?: string
          sent_at?: string
        }
        Update: {
          file_url?: string | null
          group_id?: string
          id?: string
          is_ai_processed?: boolean
          message_content?: string
          message_type?: string
          sender_id?: string
          sender_name?: string
          sender_role?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "team_whatsapp_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      team_group_participants: {
        Row: {
          group_id: string
          id: string
          is_active: boolean
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          is_active?: boolean
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          is_active?: boolean
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_group_participants_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "team_whatsapp_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      team_whatsapp_groups: {
        Row: {
          admin_user_id: string
          child_id: string
          created_at: string
          group_name: string
          id: string
          invite_code: string | null
          is_active: boolean
          updated_at: string
        }
        Insert: {
          admin_user_id: string
          child_id: string
          created_at?: string
          group_name: string
          id?: string
          invite_code?: string | null
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          admin_user_id?: string
          child_id?: string
          created_at?: string
          group_name?: string
          id?: string
          invite_code?: string | null
          is_active?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_whatsapp_groups_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "educare_children"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quiz_progress: {
        Row: {
          answer: boolean
          child_id: string
          created_at: string
          id: string
          question_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer: boolean
          child_id: string
          created_at?: string
          id?: string
          question_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: boolean
          child_id?: string
          created_at?: string
          id?: string
          question_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_progress_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "educare_children"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_child_modules: {
        Args: { p_child_id: string; p_user_id: string }
        Returns: Json
      }
      calculate_child_progress: {
        Args: { p_child_id: string }
        Returns: Json
      }
      is_group_admin: {
        Args: { group_id: string; user_id: string }
        Returns: boolean
      }
      is_group_participant: {
        Args: { group_id: string; user_id: string }
        Returns: boolean
      }
      sync_existing_progress_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      update_all_children_progress: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      app_role: "parent" | "professional" | "admin"
      gender: "male" | "female" | "other"
      journey_bot_dimension:
        | "motor_grosso"
        | "motor_fino"
        | "linguagem"
        | "cognitivo"
        | "social_emocional"
        | "autocuidado"
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
      app_role: ["parent", "professional", "admin"],
      gender: ["male", "female", "other"],
      journey_bot_dimension: [
        "motor_grosso",
        "motor_fino",
        "linguagem",
        "cognitivo",
        "social_emocional",
        "autocuidado",
      ],
    },
  },
} as const
