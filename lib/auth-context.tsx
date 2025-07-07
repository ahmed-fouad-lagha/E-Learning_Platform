'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile, isConfigured } from './supabase-client';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured) {
      console.warn('Supabase not configured. Please set up your environment variables.');
      setLoading(false);
      return;
    }

    let mounted = true;

    // Get initial session from server-side cookies
    const getInitialSession = async () => {
      try {
        console.log('AuthContext - Getting initial session...');
        
        // First, try to get the session normally
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session) {
          console.log('AuthContext - Session found directly:', { userId: session.user?.id, email: session.user?.email });
          setSession(session);
          setUser(session.user);
          if (session.user) {
            await fetchProfile(session.user.id);
          }
        } else {
          console.log('AuthContext - No session found directly, trying refresh...');
          
          // If no session found, try refreshing (this helps pick up newly set cookies)
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshedSession) {
            console.log('AuthContext - Session found via refresh:', { userId: refreshedSession.user?.id, email: refreshedSession.user?.email });
            setSession(refreshedSession);
            setUser(refreshedSession.user);
            if (refreshedSession.user) {
              await fetchProfile(refreshedSession.user.id);
            }
          } else {
            console.log('AuthContext - No session found after refresh:', refreshError?.message);
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('AuthContext - Error in getInitialSession:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('AuthContext - Auth state change:', { event, hasSession: !!session, userId: session?.user?.id });

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    console.log('AuthContext - Fetching profile for user:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('AuthContext - Profile not found, user may need to complete setup');
        } else {
          console.error('AuthContext - Error fetching profile:', error);
        }
        setProfile(null);
      } else {
        console.log('AuthContext - Profile fetched successfully');
        setProfile(data);
      }
    } catch (error) {
      console.error('AuthContext - Error in fetchProfile:', error);
      setProfile(null);
    }
  };

  const refreshSession = async () => {
    if (!isConfigured) return;
    
    try {
      console.log('AuthContext - Manually refreshing session');
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('AuthContext - Error refreshing session:', error);
        return;
      }
      
      if (session) {
        console.log('AuthContext - Session refreshed successfully');
        setSession(session);
        setUser(session.user);
        if (session.user) {
          await fetchProfile(session.user.id);
        }
      }
    } catch (error) {
      console.error('AuthContext - Error in refreshSession:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    if (!isConfigured) {
      throw new Error('يرجى إعداد Supabase أولاً. اضغط على "Connect to Supabase" في الأعلى.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          name: userData.name,
          phone: userData.phone,
          role: userData.role || 'STUDENT',
          grade: userData.grade,
          wilaya: userData.wilaya,
          school: userData.school,
          parent_phone: userData.parentPhone,
          date_of_birth: userData.dateOfBirth,
          is_verified: true, // Mark users as verified by default (no SMS verification)
        });

      if (profileError) throw profileError;
    }

    return data;
  };

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      throw new Error('يرجى إعداد Supabase أولاً. اضغط على "Connect to Supabase" في الأعلى.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Update last login
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) throw error;

    // Refresh profile
    await fetchProfile(user.id);
  };

  const value = {
    user,
    profile,
    session,
    loading,
    refreshSession,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}