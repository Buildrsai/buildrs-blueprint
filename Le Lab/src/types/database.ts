// ⚠️ CE FICHIER EST UN PLACEHOLDER
// Après avoir lié ton projet Supabase et appliqué les migrations, regénère ce fichier avec :
//   supabase gen types typescript --linked > src/types/database.ts

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
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          plan: 'free' | 'lab' | 'pro'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'lab' | 'pro'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'lab' | 'pro'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: 'active' | 'completed' | 'paused'
          current_phase: number
          idea_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          status?: 'active' | 'completed' | 'paused'
          current_phase?: number
          idea_data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          status?: 'active' | 'completed' | 'paused'
          current_phase?: number
          idea_data?: Json
          created_at?: string
          updated_at?: string
        }
      }
      project_phases: {
        Row: {
          id: string
          project_id: string
          phase_number: number
          status: 'locked' | 'active' | 'completed'
          steps_completed: Json
          generated_content: Json
          completed_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          phase_number: number
          status?: 'locked' | 'active' | 'completed'
          steps_completed?: Json
          generated_content?: Json
          completed_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          phase_number?: number
          status?: 'locked' | 'active' | 'completed'
          steps_completed?: Json
          generated_content?: Json
          completed_at?: string | null
        }
      }
      finder_searches: {
        Row: {
          id: string
          user_id: string | null
          mode: 'find' | 'validate' | 'copy'
          input: string
          result: Json
          score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          mode: 'find' | 'validate' | 'copy'
          input: string
          result?: Json
          score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          mode?: 'find' | 'validate' | 'copy'
          input?: string
          result?: Json
          score?: number | null
          created_at?: string
        }
      }
      project_build_kits: {
        Row: {
          id: string
          project_id: string
          claude_md: string | null
          mcp_json: string | null
          prompts: Json
          generated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          claude_md?: string | null
          mcp_json?: string | null
          prompts?: Json
          generated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          claude_md?: string | null
          mcp_json?: string | null
          prompts?: Json
          generated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
