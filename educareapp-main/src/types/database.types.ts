
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
      assessments: {
        Row: {
          id: string
          title: string
          date: string
          student_id: string
          student_name: string
          evaluator: string
          observations: Json
          domains: string[]
          items: Json
          status: string
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          student_id: string
          student_name: string
          evaluator: string
          observations?: Json
          domains: string[]
          items: Json
          status?: string
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          student_id?: string
          student_name?: string
          evaluator?: string
          observations?: Json
          domains?: string[]
          items?: Json
          status?: string
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string
          email?: string
          avatar_url?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reports: {
        Row: {
          id: string
          title: string
          type: string
          date: string
          status: string
          progress: number
          content: string | null
          student_id: string | null
          student_name: string | null
          author: string | null
          description: string | null
          cover_image: string | null
          domain_tracking: boolean
          skills_tracking: boolean
          recent: boolean
          important: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          type: string
          date?: string
          status: string
          progress?: number
          content?: string | null
          student_id?: string | null
          student_name?: string | null
          author?: string | null
          description?: string | null
          cover_image?: string | null
          domain_tracking?: boolean
          skills_tracking?: boolean
          recent?: boolean
          important?: boolean
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          type?: string
          date?: string
          status?: string
          progress?: number
          content?: string | null
          student_id?: string | null
          student_name?: string | null
          author?: string | null
          description?: string | null
          cover_image?: string | null
          domain_tracking?: boolean
          skills_tracking?: boolean
          recent?: boolean
          important?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: string
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          is_admin?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
