import { createBrowserClient } from '@supabase/ssr';

// Check if Supabase is properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl !== 'your-supabase-url' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'your-supabase-anon-key'
);

// Use dummy but valid URLs when Supabase is not configured to prevent initialization errors
const defaultUrl = 'https://dummy.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1bW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.dummy';

// Create browser client for client-side operations
export const supabase = createBrowserClient(
  isSupabaseConfigured ? supabaseUrl! : defaultUrl,
  isSupabaseConfigured ? supabaseAnonKey! : defaultKey
);

// Export configuration status
export const isConfigured = isSupabaseConfigured;

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name?: string;
          phone?: string;
          avatar_url?: string;
          role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
          is_verified: boolean;
          grade?: string;
          wilaya?: string;
          school?: string;
          parent_phone?: string;
          subscription: 'FREE' | 'PREMIUM' | 'SCHOOL';
          subscription_expiry?: string;
          total_points: number;
          streak: number;
          last_active: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string;
          phone?: string;
          avatar_url?: string;
          role?: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
          is_verified?: boolean;
          grade?: string;
          wilaya?: string;
          school?: string;
          parent_phone?: string;
          subscription?: 'FREE' | 'PREMIUM' | 'SCHOOL';
          subscription_expiry?: string;
          total_points?: number;
          streak?: number;
          last_active?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string;
          avatar_url?: string;
          role?: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
          is_verified?: boolean;
          grade?: string;
          wilaya?: string;
          school?: string;
          parent_phone?: string;
          subscription?: 'FREE' | 'PREMIUM' | 'SCHOOL';
          subscription_expiry?: string;
          total_points?: number;
          streak?: number;
          last_active?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
