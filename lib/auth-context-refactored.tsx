'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useReducer,
  ReactNode,
  useMemo,
} from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, Profile, isConfigured } from './supabase-client';
import { useToast } from '@/hooks/use-toast';

// --- STATE AND REDUCER ---

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: {
    auth: boolean; // For initial session load
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
      return initialState;
    default:
      return state;
  }
}

// --- CONTEXT TYPE ---

interface AuthContextType extends AuthState {
  // Methods
  signUp: (email: string, password: string, userData?: any) => Promise<{data: any; error: AuthError | null}>;
  signIn: (email: string, password: string) => Promise<{data: any; error: AuthError | null}>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{data: any; error: AuthError | null}>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  createProfile: (userId: string, profileData: Partial<Profile>) => Promise<Profile | null>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  
  // Utilities
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- PROVIDER COMPONENT ---

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();

  const handleApiError = useCallback((error: AuthError | Error | null, context: 'auth' | 'profile' | 'action') => {
    if (!error) return;
    const message = error.message || 'An unknown error occurred.';
    dispatch({ type: 'SET_ERROR', payload: { key: context, message } });
    toast({
      title: `Error: ${context.charAt(0).toUpperCase() + context.slice(1)}`,
      description: message,
      variant: 'destructive',
    });
  }, [toast]);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'profile', value: true } });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Ignore "no rows found"
          handleApiError(error, 'profile');
        }
        dispatch({ type: 'PROFILE_LOADED', payload: { profile: null } });
        return null;
      }
      
      dispatch({ type: 'PROFILE_LOADED', payload: { profile: data } });
      return data;
    } catch (error) {
      handleApiError(error as Error, 'profile');
      dispatch({ type: 'PROFILE_LOADED', payload: { profile: null } });
      return null;
    }
  }, [handleApiError]);

  useEffect(() => {
    if (!isConfigured) {
      dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ type: 'AUTH_STATE_CHANGE', payload: { session, user: session?.user ?? null } });
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        dispatch({ type: 'AUTH_STATE_CHANGE', payload: { session, user: session?.user ?? null } });
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchProfile(session.user.id);
        }
        if (event === 'SIGNED_OUT') {
            dispatch({ type: 'CLEAR_STATE' });
            dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const performAuthAction = async <T>(
    action: () => Promise<{ data: T; error: AuthError | null }>,
    context: 'action'
  ): Promise<{ data: T; error: AuthError | null }> => {
    if (!isConfigured) {
        const error = { name: 'ConfigurationError', message: 'Supabase not configured' } as AuthError;
        handleApiError(error, context);
        return { data: null as T, error };
    }
    
    dispatch({ type: 'SET_LOADING', payload: { key: context, value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: context, message: null } });
    
    try {
      const { data, error } = await action();
      if (error) {
        handleApiError(error, context);
      }
      return { data, error };
    } catch (error) {
      handleApiError(error as AuthError, context);
      return { data: null as T, error: error as AuthError };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: context, value: false } });
    }
  };

  const signUp = (email: string, password: string, userData?: any) => 
    performAuthAction(() => supabase.auth.signUp({ email, password, options: { data: userData } }), 'action');

  const signIn = (email: string, password: string) =>
    performAuthAction(() => supabase.auth.signInWithPassword({ email, password }), 'action');

  const signInWithOAuth = (provider: 'google' | 'github') =>
    performAuthAction(() => supabase.auth.signInWithOAuth({ provider, options: {
        redirectTo: `${window.location.origin}/auth/callback`,
    }}), 'action');

  const signOut = async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'action', value: true } });
    const { error } = await supabase.auth.signOut();
    if (error) handleApiError(error, 'action');
    dispatch({ type: 'CLEAR_STATE' });
    dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
    dispatch({ type: 'SET_LOADING', payload: { key: 'action', value: false } });
  };

  const refreshSession = async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: true } });
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) handleApiError(error, 'auth');
    dispatch({ type: 'AUTH_STATE_CHANGE', payload: { session, user: session?.user ?? null } });
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
    dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
  };

  const createProfile = useCallback(async (userId: string, profileData: Partial<Profile>) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'profile', value: true } });
    try {
        const { data, error } = await supabase
            .from('profiles')
            .insert({ id: userId, ...profileData })
            .select()
            .single();

        if (error) {
            handleApiError(error, 'profile');
            dispatch({ type: 'PROFILE_LOADED', payload: { profile: null } });
            return null;
        }
        
        dispatch({ type: 'PROFILE_LOADED', payload: { profile: data } });
        toast({ title: 'Profile Created', description: 'Your profile has been successfully created.' });
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
      toast({ title: 'Success', description: 'Profile updated successfully.' });
    } catch (error) {
      handleApiError(error as Error, 'profile');
    }
  }, [state.user, handleApiError, toast]);

  const value = useMemo(() => ({
    ...state,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    refreshSession,
    createProfile,
    updateProfile,
    isConfigured,
  }), [state, signUp, signIn, signInWithOAuth, signOut, refreshSession, createProfile, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- HOOKS ---

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRequireAuth() {
  const auth = useAuth();
  return {
    ...auth,
    isAuthenticated: !!auth.user,
    isLoading: auth.loading.auth,
  };
}
