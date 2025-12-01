
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      licenses: {
        Row: {
          id: string
          key: string
          type: string
          model: string
          expires_at: string
          max_users: number
          total_count: number | null
          used_count: number
          features: string[]
          is_active: boolean
          assigned_to: string | null
          assigned_to_name: string | null
          last_validated: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          type: string
          model: string
          expires_at: string
          max_users?: number
          total_count?: number | null
          used_count?: number
          features?: string[]
          is_active?: boolean
          assigned_to?: string | null
          assigned_to_name?: string | null
          last_validated?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          type?: string
          model?: string
          expires_at?: string
          max_users?: number
          total_count?: number | null
          used_count?: number
          features?: string[]
          is_active?: boolean
          assigned_to?: string | null
          assigned_to_name?: string | null
          last_validated?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          license_id: string
          name: string
          student_id: string
          student_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          license_id: string
          name: string
          student_id: string
          student_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          license_id?: string
          name?: string
          student_id?: string
          student_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          name: string
          email: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          name: string
          email: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          name?: string
          email?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      license_validations: {
        Row: {
          id: string
          license_id: string
          is_valid: boolean
          message: string | null
          error_code: string | null
          validated_at: string
          validated_by: string | null
        }
        Insert: {
          id?: string
          license_id: string
          is_valid: boolean
          message?: string | null
          error_code?: string | null
          validated_at?: string
          validated_by?: string | null
        }
        Update: {
          id?: string
          license_id?: string
          is_valid?: boolean
          message?: string | null
          error_code?: string | null
          validated_at?: string
          validated_by?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
