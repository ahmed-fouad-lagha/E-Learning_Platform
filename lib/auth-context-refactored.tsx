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
      // Ensure loading is always false after auth state change, regardless of session presence
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

  // Helper to standardize error handling across auth operations
  const handleApiError = useCallback((error: Error | AuthError | any, context: keyof AuthState['error']) => {
    console.error(`Auth error (${context}):`, error);
    const message = error?.message || 'An unexpected error occurred';
    dispatch({ type: 'SET_ERROR', payload: { key: context, message } });
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive',
    });
  }, [toast, dispatch]);

  // Generic handler for Supabase auth actions, normalizing their responses
  const performAuthAction = useCallback(async function <T>(
    action: () => Promise<any>,
    context: keyof AuthState['error']
  ): Promise<{ data: T | null; error: AuthError | null }> {
    if (!isConfigured) {
      const error = { name: 'ConfigurationError', message: 'Supabase not configured' } as AuthError;
      handleApiError(error, context);
      return { data: null, error };
    }

    dispatch({ type: 'SET_LOADING', payload: { key: context, value: true } });
    dispatch({ type: 'SET_ERROR', payload: { key: context, message: null } });

    try {
      const result = await action();
      // Normalize Supabase auth responses
      if ('error' in result && result.error) {
        handleApiError(result.error, context);
        return { data: null, error: result.error };
      }
      // Some responses have .data, some have .user, .session, etc.
      if ('data' in result) {
        return { data: result.data as T, error: null };
      }
      return { data: result as T, error: null };
    } catch (error: any) {
      // Special handling for network-related errors
      if (error.message?.includes('Failed to fetch') || error.code === 'NETWORK_ERROR') {
        const networkError = {
          name: 'NetworkError',
          message: 'Network connection error. Please check your internet connection and try again.'
        };
        console.error('Network error during auth operation:', error);
        handleApiError(networkError, context);
        return { data: null, error: networkError as AuthError };
      }

      handleApiError(error, context);
      return { data: null, error };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: context, value: false } });
    }
  }, [isConfigured, handleApiError]);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'profile', value: true } });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        handleApiError(error, 'profile');
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
    console.log('Supabase configuration status:', { isConfigured, url: process.env.NEXT_PUBLIC_SUPABASE_URL });

    if (!isConfigured) {
      console.warn('Supabase is not configured correctly. Using dummy client.');
      dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
      dispatch({ type: 'SET_ERROR', payload: { key: 'auth', message: 'Authentication service is not configured' } });
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ type: 'AUTH_STATE_CHANGE', payload: { session, user: session?.user ?? null } });
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        // Ensure loading state is set to false even when no session exists
        dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
        console.log('Auth - No active session found, setting loading to false');
      }
    }).catch(error => {
      console.error('Error checking session:', error);
      // Make sure loading state is turned off even on error
      dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
      handleApiError(error, 'auth');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Auth - State change event: ${event}`, !!session);

        // Update auth state for all events
        dispatch({ type: 'AUTH_STATE_CHANGE', payload: { session, user: session?.user ?? null } });

        // Handle specific events
        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              await fetchProfile(session.user.id);
            }
            break;

          case 'SIGNED_OUT':
            dispatch({ type: 'CLEAR_STATE' });
            break;

          case 'USER_UPDATED':
            if (session?.user) {
              await fetchProfile(session.user.id);
            }
            break;

          case 'INITIAL_SESSION':
            // This ensures loading is set to false for initial session detection
            if (!session) {
              dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
            }
            break;
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = useCallback((email: string, password: string, userData?: any) =>
    performAuthAction(() => supabase.auth.signUp({ email, password, options: { data: userData } }), 'action'),
    [performAuthAction]
  );

  const signIn = useCallback((email: string, password: string) =>
    performAuthAction(() => supabase.auth.signInWithPassword({ email, password }), 'action'),
    [performAuthAction]
  );

  const signInWithOAuth = useCallback((provider: 'google' | 'github') =>
    performAuthAction(() => supabase.auth.signInWithOAuth({ provider, options: {
        redirectTo: `${window.location.origin}/auth/callback`,
    }}), 'action'),
    [performAuthAction]
  );

  const signOut = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'action', value: true } });
    const { error } = await supabase.auth.signOut();
    if (error) handleApiError(error, 'action');
    dispatch({ type: 'CLEAR_STATE' });
    dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
    dispatch({ type: 'SET_LOADING', payload: { key: 'action', value: false } });
  }, [handleApiError]);

  const refreshSession = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: true } });
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) handleApiError(error, 'auth');
    dispatch({ type: 'AUTH_STATE_CHANGE', payload: { session, user: session?.user ?? null } });
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
    dispatch({ type: 'SET_LOADING', payload: { key: 'auth', value: false } });
  }, [handleApiError, fetchProfile]);

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