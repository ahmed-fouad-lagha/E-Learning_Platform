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
  isSupabaseConfigured ? supabaseAnonKey! : defaultKey,
  {
    auth: {
      autoRefreshToken: isSupabaseConfigured,
      persistSession: isSupabaseConfigured,
      detectSessionInUrl: false, // Disable URL session detection to prevent conflicts
      flowType: 'pkce',
      storage: isSupabaseConfigured ? undefined : {
        getItem: (key: string) => null,
        setItem: (key: string, value: string) => {},
        removeItem: (key: string) => {},
      },
    }
  }
);

// Export configuration status
export const isConfigured = isSupabaseConfigured;

export { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Re-export createClient for compatibility
export { createClient } from '@supabase/supabase-js'

// Database types - unified and consistent
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
          date_of_birth?: string;
          subjects?: string;
          experience?: number;
          qualification?: string;
          subscription: 'FREE' | 'PREMIUM' | 'SCHOOL';
          subscription_expiry?: string;
          total_points: number;
          streak: number;
          last_active: string;
          is_active: boolean;
          last_login?: string;
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
          date_of_birth?: string;
          subjects?: string;
          experience?: number;
          qualification?: string;
          subscription?: 'FREE' | 'PREMIUM' | 'SCHOOL';
          subscription_expiry?: string;
          total_points?: number;
          streak?: number;
          last_active?: string;
          is_active?: boolean;
          last_login?: string;
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
          date_of_birth?: string;
          subjects?: string;
          experience?: number;
          qualification?: string;
          subscription?: 'FREE' | 'PREMIUM' | 'SCHOOL';
          subscription_expiry?: string;
          total_points?: number;
          streak?: number;
          last_active?: string;
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