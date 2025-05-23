
import { useState, useEffect } from 'react';
import { User, AuthResponse } from '@supabase/supabase-js';
import { User as AppUser } from '@/types/auth';
import { supabaseAuth } from '@/integrations/supabase/auth-client';
import { fetchUserProfile, updateTermsAcceptance } from '@/services/profileService';
import { signInWithEmailAndPassword, signUpWithEmailAndPassword, signOut } from '@/services/authService';
import { cleanupAuthState } from '@/utils/authUtils';

interface UseAuthenticationResult {
  user: AppUser | null;
  supabaseUser: User | null;
  session: any | null; // Keeping as any since the session type is complex
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: Error | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  acceptTerms: (acceptedTerms: boolean) => Promise<void>;
}

export function useAuthentication(): UseAuthenticationResult {
  const [user, setUser] = useState<AppUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<Error | null>(null);

  // Set up auth state listener
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange(
      async (event, currentSession) => {
        // Clear any previous errors
        setAuthError(null);
        setSession(currentSession);
        setSupabaseUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (currentSession?.user) {
            try {
              // Delay the profile fetch to prevent deadlock
              setTimeout(async () => {
                try {
                  const profile = await fetchUserProfile(currentSession.user.id);
                  if (profile) {
                    setUser(profile);
                  }
                } catch (error) {
                  console.error('Error fetching user profile:', error);
                  setAuthError(error instanceof Error ? error : new Error('Failed to fetch user profile'));
                }
              }, 0);
            } catch (error) {
              console.error('Error in auth state change handler:', error);
              setAuthError(error instanceof Error ? error : new Error('Authentication error'));
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabaseAuth.getSession();
        setSession(currentSession);
        setSupabaseUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          try {
            const profile = await fetchUserProfile(currentSession.user.id);
            if (profile) {
              setUser(profile);
            }
          } catch (profileError) {
            console.error('Error fetching user profile during initialization:', profileError);
            setAuthError(profileError instanceof Error ? profileError : new Error('Failed to fetch user profile'));
          }
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        setAuthError(error instanceof Error ? error : new Error('Failed to check authentication state'));
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Clean up existing auth state before attempting login
      cleanupAuthState();
      
      const response = await signInWithEmailAndPassword(email, password);
      
      if (response.error) {
        throw response.error;
      }
      
      return response;
    } catch (error: unknown) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      console.error('Login failed:', typedError);
      setAuthError(typedError);
      throw typedError;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Clean up existing auth state before attempting signup
      cleanupAuthState();
      
      const response = await signUpWithEmailAndPassword(name, email, password);
      
      if (response.error) {
        throw response.error;
      }
      
      return response;
    } catch (error: unknown) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      console.error('Signup failed:', typedError);
      setAuthError(typedError);
      throw typedError;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      await signOut();
    } catch (error: unknown) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      console.error('Logout failed:', typedError);
      setAuthError(typedError);
      throw typedError;
    } finally {
      setIsLoading(false);
    }
  };

  const acceptTerms = async (accepted: boolean): Promise<void> => {
    if (!user) {
      const error = new Error('User must be logged in to accept terms');
      setAuthError(error);
      throw error;
    }

    try {
      await updateTermsAcceptance(user.id, accepted);
      
      // Update local user state
      setUser({
        ...user,
        hasAcceptedTerms: accepted,
        termsAcceptedAt: accepted ? new Date().toISOString() : undefined,
      });
    } catch (error: unknown) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      console.error('Failed to update terms acceptance:', typedError);
      setAuthError(typedError);
      throw typedError;
    }
  };

  return {
    user,
    supabaseUser,
    session,
    isAuthenticated: !!user,
    isLoading,
    authError,
    login,
    signup,
    logout,
    acceptTerms,
  };
}
