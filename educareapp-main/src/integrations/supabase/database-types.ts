
export interface Database {
  public: {
    Tables: {
      educare_profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          role: 'parent' | 'professional' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: 'parent' | 'professional' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: 'parent' | 'professional' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      educare_children: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          name: string;
          birthdate: string;
          age: number;
          gender: 'male' | 'female' | 'other' | null;
          cpf: string | null;
          nationality: string | null;
          city: string | null;
          bloodtype: string | null;
          observations: string | null;
          journey_progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name: string;
          name: string;
          birthdate: string;
          age: number;
          gender?: 'male' | 'female' | 'other' | null;
          cpf?: string | null;
          nationality?: string | null;
          city?: string | null;
          bloodtype?: string | null;
          observations?: string | null;
          journey_progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          name?: string;
          birthdate?: string;
          age?: number;
          gender?: 'male' | 'female' | 'other' | null;
          cpf?: string | null;
          nationality?: string | null;
          city?: string | null;
          bloodtype?: string | null;
          observations?: string | null;
          journey_progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_quiz_progress: {
        Row: {
          id: string;
          user_id: string;
          child_id: string;
          question_id: string;
          answer: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          child_id: string;
          question_id: string;
          answer: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          child_id?: string;
          question_id?: string;
          answer?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      quiz_questions: {
        Row: {
          id: string;
          question_text: string;
          dimension: string;
          age_min_months: number;
          age_max_months: number;
          order_index: number;
          active: boolean;
          feedback_yes: string;
          feedback_no: string;
          feedback_unknown: string;
          concern_level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question_text: string;
          dimension: string;
          age_min_months: number;
          age_max_months: number;
          order_index?: number;
          active?: boolean;
          feedback_yes: string;
          feedback_no: string;
          feedback_unknown: string;
          concern_level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question_text?: string;
          dimension?: string;
          age_min_months?: number;
          age_max_months?: number;
          order_index?: number;
          active?: boolean;
          feedback_yes?: string;
          feedback_no?: string;
          feedback_unknown?: string;
          concern_level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      child_anamnese: {
        Row: {
          id: string;
          child_id: string;
          user_id: string;
          prenatal_start: string | null;
          blood_exams: string | null;
          immunization: string | null;
          birth_location: string | null;
          birth_type: string | null;
          completed: boolean;
          completion_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          user_id: string;
          prenatal_start?: string | null;
          blood_exams?: string | null;
          immunization?: string | null;
          birth_location?: string | null;
          birth_type?: string | null;
          completed?: boolean;
          completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          child_id?: string;
          user_id?: string;
          prenatal_start?: string | null;
          blood_exams?: string | null;
          immunization?: string | null;
          birth_location?: string | null;
          birth_type?: string | null;
          completed?: boolean;
          completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      journey_bot_questions: {
        Row: {
          id: string;
          dimension: 'motor_grosso' | 'motor_fino' | 'linguagem' | 'cognitivo' | 'social_emocional' | 'autocuidado';
          question_text: string;
          age_min_months: number;
          age_max_months: number;
          age_min_weeks: number | null;
          age_max_weeks: number | null;
          order_index: number;
          concern_level: number;
          active: boolean;
          feedback_yes: string;
          feedback_no: string;
          feedback_unknown: string;
          tips_yes: string[] | null;
          tips_no: string[] | null;
          tips_unknown: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          dimension: 'motor_grosso' | 'motor_fino' | 'linguagem' | 'cognitivo' | 'social_emocional' | 'autocuidado';
          question_text: string;
          age_min_months: number;
          age_max_months: number;
          age_min_weeks?: number | null;
          age_max_weeks?: number | null;
          order_index?: number;
          concern_level?: number;
          active?: boolean;
          feedback_yes: string;
          feedback_no: string;
          feedback_unknown: string;
          tips_yes?: string[] | null;
          tips_no?: string[] | null;
          tips_unknown?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          dimension?: 'motor_grosso' | 'motor_fino' | 'linguagem' | 'cognitivo' | 'social_emocional' | 'autocuidado';
          question_text?: string;
          age_min_months?: number;
          age_max_months?: number;
          age_min_weeks?: number | null;
          age_max_weeks?: number | null;
          order_index?: number;
          concern_level?: number;
          active?: boolean;
          feedback_yes?: string;
          feedback_no?: string;
          feedback_unknown?: string;
          tips_yes?: string[] | null;
          tips_no?: string[] | null;
          tips_unknown?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      journey_bot_sessions: {
        Row: {
          id: string;
          user_id: string;
          child_id: string;
          started_at: string;
          completed_at: string | null;
          total_questions: number;
          answered_questions: number;
          current_dimension: string | null;
          status: 'active' | 'completed' | 'paused';
          session_data: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          child_id: string;
          started_at?: string;
          completed_at?: string | null;
          total_questions?: number;
          answered_questions?: number;
          current_dimension?: string | null;
          status?: 'active' | 'completed' | 'paused';
          session_data?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          child_id?: string;
          started_at?: string;
          completed_at?: string | null;
          total_questions?: number;
          answered_questions?: number;
          current_dimension?: string | null;
          status?: 'active' | 'completed' | 'paused';
          session_data?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      journey_bot_responses: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          child_id: string;
          question_id: string | null;
          answer: number;
          responded_at: string;
          dimension: string;
          question_text: string;
          answer_text: string;
          feedback_provided: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          child_id: string;
          question_id?: string | null;
          answer: number;
          responded_at?: string;
          dimension: string;
          question_text: string;
          answer_text: string;
          feedback_provided?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          child_id?: string;
          question_id?: string | null;
          answer?: number;
          responded_at?: string;
          dimension?: string;
          question_text?: string;
          answer_text?: string;
          feedback_provided?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      educare_professional_children: {
        Row: {
          id: string;
          professional_id: string;
          child_id: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          professional_id: string;
          child_id: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          professional_id?: string;
          child_id?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      app_role: 'parent' | 'professional' | 'admin';
      gender: 'male' | 'female' | 'other';
      journey_bot_dimension: 'motor_grosso' | 'motor_fino' | 'linguagem' | 'cognitivo' | 'social_emocional' | 'autocuidado';
    };
    CompositeTypes: {};
  };
}
