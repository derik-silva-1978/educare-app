
import type { Database as OriginalDatabase } from '@/integrations/supabase/types';

// Extend the original Database type with our additional tables and functions
export interface Database extends OriginalDatabase {
  public: {
    Tables: OriginalDatabase['public']['Tables'] & {
      assessments: {
        Row: {
          id: string;
          title: string;
          date: string;
          student_id: string;
          student_name: string;
          evaluator: string;
          observations: Record<string, string>;
          domains: string[];
          items: any[];
          status: string;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          date: string;
          student_id: string;
          student_name: string;
          evaluator: string;
          observations?: Record<string, string>;
          domains: string[];
          items: any[];
          status?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          date?: string;
          student_id?: string;
          student_name?: string;
          evaluator?: string;
          observations?: Record<string, string>;
          domains?: string[];
          items?: any[];
          status?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          title: string;
          type: string;
          date: string;
          status: string;
          progress: number;
          content: string;
          student_id: string;
          student_name: string;
          author: string;
          description: string;
          cover_image: string | null;
          domain_tracking: boolean;
          skills_tracking: boolean;
          recent: boolean;
          important: boolean;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          type: string;
          date: string;
          status?: string;
          progress?: number;
          content: string;
          student_id: string;
          student_name: string;
          author: string;
          description?: string;
          cover_image?: string | null;
          domain_tracking?: boolean;
          skills_tracking?: boolean;
          recent?: boolean;
          important?: boolean;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          type?: string;
          date?: string;
          status?: string;
          progress?: number;
          content?: string;
          student_id?: string;
          student_name?: string;
          author?: string;
          description?: string;
          cover_image?: string | null;
          domain_tracking?: boolean;
          skills_tracking?: boolean;
          recent?: boolean;
          important?: boolean;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          is_admin: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          is_admin?: boolean;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          avatar_url: string | null;
          organization: string | null;
          title: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          avatar_url?: string | null;
          organization?: string | null;
          title?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar_url?: string | null;
          organization?: string | null;
          title?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      license_validations: {
        Row: {
          id: string;
          license_id: string;
          is_valid: boolean;
          message: string | null;
          error_code: string | null;
          validated_at: string;
          validated_by: string | null;
        };
        Insert: {
          id?: string;
          license_id: string;
          is_valid: boolean;
          message?: string | null;
          error_code?: string | null;
          validated_at: string;
          validated_by?: string | null;
        };
        Update: {
          id?: string;
          license_id?: string;
          is_valid?: boolean;
          message?: string | null;
          error_code?: string | null;
          validated_at?: string;
          validated_by?: string | null;
        };
      };
    };
    Views: OriginalDatabase['public']['Views'];
    Functions: OriginalDatabase['public']['Functions'] & {
      insert_license_validation: {
        Args: {
          p_license_id: string;
          p_is_valid: boolean;
          p_message: string;
          p_error_code?: string;
          p_validated_at: string;
        };
        Returns: unknown;
      };
      get_license_validation_history: {
        Args: {
          p_license_id: string;
        };
        Returns: {
          id: string;
          license_id: string;
          is_valid: boolean;
          message: string | null;
          error_code: string | null;
          validated_at: string;
          validated_by: string | null;
        }[];
      };
      check_license_exists: {
        Args: {
          p_license_key: string;
        };
        Returns: {
          exists: boolean;
        }[];
      };
      insert_license: {
        Args: {
          p_id: string;
          p_key: string;
          p_type: string;
          p_model: string;
          p_expires_at: string;
          p_max_users: number;
          p_total_count: number | null;
          p_used_count: number;
          p_features: any[];
          p_is_active: boolean;
          p_assigned_to_name: string | null;
          p_last_validated: string | null;
        };
        Returns: unknown;
      };
      insert_team: {
        Args: {
          p_id: string;
          p_license_id: string;
          p_name: string;
          p_student_id: string;
          p_student_name: string;
          p_created_at: string;
          p_updated_at: string;
        };
        Returns: unknown;
      };
      insert_team_member: {
        Args: {
          p_team_id: string;
          p_user_id: string;
          p_name: string;
          p_email: string;
          p_role: string;
        };
        Returns: unknown;
      };
    };
    Enums: OriginalDatabase['public']['Enums'];
    CompositeTypes: OriginalDatabase['public']['CompositeTypes'];
  };
};

// Re-export the Json type
export type { Json } from '@/integrations/supabase/types';
