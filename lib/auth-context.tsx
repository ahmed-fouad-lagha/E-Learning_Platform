'use client';

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, Profile, isConfigured } from './supabase';
import { useToast } from '@/hooks/use-toast';

// --- STATE AND REDUCER ---

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: {
    auth: boolean; // For initial session load and session refresh
    profile: boolean; // For profile-specific fetches/updates
    action: boolean; // For sign-in/sign-up/sign-out actions
  };
  error: {
    auth: string | null;
    profile: string | null;
    action: string | null;
  };
}

type AuthAction =
  | { type: 'AUTH_STATE_CHANGE'; payload: { session: Session | null; user: User | null } }
  | { type: 'PROFILE_LOADED'; payload: { profile: Profile | null } }
  | { type: 'SET_LOADING'; payload: { key: keyof AuthState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: keyof AuthState['error']; message: string | null } }
  | { type: 'CLEAR_STATE' };

const initialState: AuthState = {
  user: null,
  profile: null,
  session: null,
  loading: {
    auth: true,
    profile: false,
    action: false,
  },
  error: {
    auth: null,
    profile: null,
    action: null,
  },
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_STATE_CHANGE':
      return {
        ...state,
        session: action.payload.session,
        user: action.payload.user,
        loading: { ...state.loading, auth: false },
        error: { ...state.error, auth: null },
      };
    case 'PROFILE_LOADED':
      return {
        ...state,
        profile: action.payload.profile,
        loading: { ...state.loading, profile: false },
        error: { ...state.error, profile: null },
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value },
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: { ...state.error, [action.payload.key]: action.payload.message },
      };
    case 'CLEAR_STATE':
      // Keep loading.auth false so we don't show a full-page loader on sign-out
      return { ...initialState, loading: { auth: false, profile: false, action: false } };
    default:
      return state;
  }
}

// --- CONTEXT TYPE ---

interface AuthContextType extends AuthState {
  // Methods
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<any>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  createProfile: (userId: string, profileData: Partial<Profile>) => Promise<Profile | null>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  clearError: (key: keyof AuthState['error']) => void;
  
  // Utilities
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- CUSTOM HOOK ---

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- PROVIDER COMPONENT ---

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();

  const handleApiError = useCallback((error: AuthError | Error | null, context: keyof AuthState['error']) => {
    if (!error) return;
    
    let message = 'An unknown error occurred.';
    
    if (error.message) {
      // Handle common Supabase auth errors with user-friendly messages
      switch (error.message) {
        case 'Invalid login credentials':
          message = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
          break;
        case 'User already registered':
          message = 'هذا البريد الإلكتروني مسجل بالفعل';
          break;
        case 'Email not confirmed':
          message = 'يرجى تأكيد البريد الإلكتروني أولاً';
          break;
        case 'Password should be at least 6 characters':
          message = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
          break;
        case 'Unable to validate email address: invalid format':
          message = 'تنسيق البريد الإلكتروني غير صحيح';
          break;
        case 'Signup requires a valid password':
          message = 'كلمة المرور مطلوبة';
          break;
        default:
          message = error.message;
      }
    }
    
    console.error(`Auth Error (${context}):`, error);
    dispatch({ type: 'SET_ERROR', payload: { key: context, message } });
    
    // Only show toast for action errors (not auth state or profile errors)
    if (context === 'action') {
      toast({
        title: 'خطأ في المصادقة',
        description: message,
        variant: 'destructive',
      });
    }
  }, [toast]);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    console.log('Auth - Starting profile fetch for user:', userId);
    dispatch({ type: 'SET_LOADING', payload: { key: 'profile', value: true } });
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Auth - Profile query result:', { 
        hasData: !!data, 
        hasError: !!error,
        errorCode: error?.code,
        errorMessage: error?.message,
        errorDetails: error?.details 
      });

      if (error) {
        console.error('Auth - Profile fetch error:', JSON.stringify(error, null, 2));
        
        // "No rows found" is not a critical error, just means profile doesn't exist yet.
        if (error.code !== 'PGRST116') { 
          handleApiError(error, 'profile');
        } else {
          console.warn('Auth - Profile not found for user (no rows), this is expected for new users');
          dispatch({ type: 'SET_ERROR', payload: { key: 'profile', message: null } });
        }
        dispatch({ type: 'PROFILE_LOADED', payload: { profile: null } });
        return null;
      }

      if (!data) {
        console.warn(`Auth - No profile data returned for user ${userId}, but no error was thrown. This could be an RLS issue.`);
        dispatch({ type: 'SET_ERROR', payload: { key: 'profile', message: 'Profile not found.' } });
        dispatch({ type: 'PROFILE_LOADED', payload: { profile: null } });
        return null;
      }
      
      console.log('Auth - Profile fetched successfully:', data);
      dispatch({ type: 'PROFILE_LOADED', payload: { profile: data } });
      return data;
    } catch (error) {
      console.error('Auth - Unexpected error in fetchProfile:', error);
      handleApiError(error as Error, 'profile');
      dispatch({ type: 'PROFILE_LOADED', payload: { profile: null } });
      return null;
    }
  }, [handleApiError]);

  const createProfileIfNeeded = useCallback(async (user: User): Promise<void> => {
    if (!user) return;
    
    console.log('Auth - Checking if profile exists for user:', user.id);
    
    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        console.log('Auth - Creating profile for new user');
        
        // Extract user information from metadata
        const userMetadata = user.user_metadata;
        const name = userMetadata?.full_name || userMetadata?.name || user.email?.split('@')[0] || '';
        const avatarUrl = userMetadata?.avatar_url || userMetadata?.picture;

        const profileData = {
          id: user.id,
          email: user.email!,
          name: name,
          avatar_url: avatarUrl,
          role: 'STUDENT' as const,
          is_verified: true,
          subscription: 'FREE' as const,
          total_points: 0,
          streak: 0,
          is_active: true,
          last_active: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();

        if (error) {
          console.error('Auth - Profile creation failed:', error);
          handleApiError(error, 'profile');
        } else {
          console.log('Auth - Profile created successfully:', data);
          dispatch({ type: 'PROFILE_LOADED', payload: { profile: data } });
          toast({
            title: 'مرحباً بك!',
            description: 'تم إنشاء حسابك بنجاح',
            variant: 'default',
          });
        }
      } else {
        // Update last activity for existing user
        console.log('Auth - Updating last activity for existing user');
        await supabase
          .from('profiles')
          .update({ 
            last_active: new Date().toISOString(),
            last_login: new Date().toISOString(),
            is_active: true
          })
          .eq('id', user.id);
        
        // Fetch the updated profile
        await fetchProfile(user.id);
      }
    } catch (error) {
      console.error('Auth - Profile handling error:', error);
      handleApiError(error as Error, 'profile');
    }
  }, [handleApiError, fetchProfile, toast]);

  useEffect(() => {
    if (!isConfigured) {
      console.warn("Supabase client not configured. Check environment variables.");
      dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Auth - Initial session check:', !!session);
      dispatch({ type: 'AUTH_STATE_CHANGE', payload: { session, user: session?.user ?? null } });
      if (session?.user) {
        createProfileIfNeeded(session.user);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth - State change event:', event, !!session);
        dispatch({ type: 'AUTH_STATE_CHANGE', payload: { session, user: session?.user ?? null } });
        
        if (event === 'SIGNED_IN' && session?.user) {
          await createProfileIfNeeded(session.user);
        }
        
        if (event === 'SIGNED_OUT') {
          dispatch({ type: 'CLEAR_STATE' });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [createProfileIfNeeded]);

  const signUp = useCallback(async (email: string, password: string, userData?: any) => {
    console.log('Auth - Starting sign up for:', email);
    
    if (!isConfigured) {
      const error = { name: 'ConfigurationError', message: 'Supabase not configured' } as AuthError;
      handleApiError(error, 'action');
      return { data: null, error };
    }
    
    dispatch({ type: 'SET_LOADING', payload: { key: 'action', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'action', message: null } });
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { 
          data: userData,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (!error && data.user && !data.session) {
        // Email confirmation required
        toast({
          title: 'تأكيد البريد الإلكتروني',
          description: 'تم إرسال رابط التأكيد إلى بريدك الإلكتروني',
          variant: 'default',
        });
      }
      
      if (error) {
        handleApiError(error, 'action');
      }
      
      return { data, error };
    } catch (error) {
      handleApiError(error as AuthError, 'action');
      return { data: null, error: error as AuthError };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'action', value: false } });
    }
  }, [handleApiError, toast]);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('Auth - Starting sign in for:', email);
    
    if (!isConfigured) {
      const error = { name: 'ConfigurationError', message: 'Supabase not configured' } as AuthError;
      handleApiError(error, 'action');
      return { data: null, error };
    }
    
    dispatch({ type: 'SET_LOADING', payload: { key: 'action', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'action', message: null } });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        handleApiError(error, 'action');
      }
      
      return { data, error };
    } catch (error) {
      handleApiError(error as AuthError, 'action');
      return { data: null, error: error as AuthError };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'action', value: false } });
    }
  }, [handleApiError]);

  const signInWithOAuth = useCallback(async (provider: 'google' | 'github') => {
    console.log('Auth - Starting OAuth sign in with:', provider);
    
    if (!isConfigured) {
      const error = { name: 'ConfigurationError', message: 'Supabase not configured' } as AuthError;
      handleApiError(error, 'action');
      return { data: null, error };
    }
    
    dispatch({ type: 'SET_LOADING', payload: { key: 'action', value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: 'action', message: null } });
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ 
        provider, 
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        handleApiError(error, 'action');
      }
      
      return { data, error };
    } catch (error) {
      handleApiError(error as AuthError, 'action');
      return { data: null, error: error as AuthError };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'action', value: false } });
    }
  }, [handleApiError]);

  const signOut = useCallback(async () => {
    console.log('Auth - Starting sign out');
    dispatch({ type: 'SET_LOADING', payload: { key: 'action', value: true } });
    const { error } = await supabase.auth.signOut();
    if (error) {
      handleApiError(error, 'action');
    } else {
      toast({
        title: 'تم تسجيل الخروج',
        description: 'تم تسجيل خروجك بنجاح',
        variant: 'default',
      });
    }
    // onAuthStateChange will handle clearing state via CLEAR_STATE
    dispatch({ type: 'SET_LOADING', payload: { key: 'action', value: false } });
  }, [handleApiError, toast]);

  const refreshSession = useCallback(async () => {
    console.log('Auth - Refreshing session');
    dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: true } });
    const { error } = await supabase.auth.refreshSession();
    if (error) handleApiError(error, 'auth');
    // onAuthStateChange will handle the session update
    dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
  }, [handleApiError]);

  const createProfile = useCallback(async (userId: string, profileData: Partial<Profile>) => {
    console.log('Auth - Creating profile for user:', userId);
    dispatch({ type: 'SET_LOADING', payload: { key: 'profile', value: true } });
    try {
        const { data, error } = await supabase
            .from('profiles')
            .insert({ 
              id: userId, 
              ...profileData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            handleApiError(error, 'profile');
            dispatch({ type: 'PROFILE_LOADED', payload: { profile: null } });
            return null;
        }
        
        dispatch({ type: 'PROFILE_LOADED', payload: { profile: data } });
        toast({ 
          title: 'تم إنشاء الملف الشخصي', 
          description: 'تم إنشاء ملفك الشخصي بنجاح',
          variant: 'default'
        });
        return data;
    } catch (error) {
        handleApiError(error as Error, 'profile');
        dispatch({ type: 'PROFILE_LOADED', payload: { profile: null } });
        return null;
    }
  }, [handleApiError, toast]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!state.user) {
      handleApiError(new Error("No user is signed in to update profile."), 'profile');
      return;
    }
    
    console.log('Auth - Updating profile for user:', state.user.id);
    dispatch({ type: 'SET_LOADING', payload: { key: 'profile', value: true } });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', state.user.id)
        .select()
        .single();

      if (error) {
        handleApiError(error, 'profile');
        return;
      }
      
      dispatch({ type: 'PROFILE_LOADED', payload: { profile: data } });
      toast({ 
        title: 'تم التحديث', 
        description: 'تم تحديث ملفك الشخصي بنجاح',
        variant: 'default'
      });
    } catch (error) {
      handleApiError(error as Error, 'profile');
    }
  }, [state.user, handleApiError, toast]);

  const clearError = useCallback((key: keyof AuthState['error']) => {
    dispatch({ type: 'SET_ERROR', payload: { key, message: null } });
  }, []);

  const value = useMemo(() => ({
    ...state,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    refreshSession,
    createProfile,
    updateProfile,
    clearError,
    isConfigured,
  }), [state, signUp, signIn, signInWithOAuth, signOut, refreshSession, createProfile, updateProfile, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- HOOKS ---

export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();
  
  return {
    ...auth,
    isAuthenticated: !!auth.user,
    requireAuth: !auth.loading.auth && !auth.user, // Need redirect if not loading and no user
    isLoading: auth.loading.auth, // Keep for backward compatibility
  };
}
