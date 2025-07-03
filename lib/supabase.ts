import { createClient } from '@supabase/supabase-js';

// Default values for development - replace with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          phone?: string;
          role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
          grade?: string;
          wilaya?: string;
          school?: string;
          parent_phone?: string;
          date_of_birth?: string;
          subjects?: string;
          experience?: number;
          qualification?: string;
          is_verified: boolean;
          is_active: boolean;
          last_login?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          phone?: string;
          role?: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
          grade?: string;
          wilaya?: string;
          school?: string;
          parent_phone?: string;
          date_of_birth?: string;
          subjects?: string;
          experience?: number;
          qualification?: string;
          is_verified?: boolean;
          is_active?: boolean;
          last_login?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          phone?: string;
          role?: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
          grade?: string;
          wilaya?: string;
          school?: string;
          parent_phone?: string;
          date_of_birth?: string;
          subjects?: string;
          experience?: number;
          qualification?: string;
          is_verified?: boolean;
          is_active?: boolean;
          last_login?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];