
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { supabaseAuth } from '@/integrations/supabase/auth-client';
import { useAuthState } from '@/hooks/useAuthState';
import { fetchUserProfile, updateTermsAcceptance } from '@/services/profileService';
import { signInWithEmailAndPassword, signUpWithEmailAndPassword, signOut } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { 
    user, setUser,
    supabaseUser, setSupabaseUser,
    session, setSession,
    isLoading, setIsLoading
  } = useAuthState();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setSupabaseUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (currentSession?.user) {
            try {
              // Delay the profile fetch to prevent deadlock
              setTimeout(async () => {
                const profile = await fetchUserProfile(currentSession.user.id);
                if (profile) {
                  setUser(profile);
                }
              }, 0);
            } catch (error) {
              console.error('Error fetching user profile:', error);
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
          const profile = await fetchUserProfile(currentSession.user.id);
          if (profile) {
            setUser(profile);
          }
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await signInWithEmailAndPassword(email, password);
      
      if (response.error) {
        throw response.error;
      }
      
      return response;
    } catch (error: any) {
      console.error('Login failed:', error);
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await signUpWithEmailAndPassword(name, email, password);
      
      if (response.error) {
        throw response.error;
      }
      
      return response;
    } catch (error: any) {
      console.error('Signup failed:', error);
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error('Logout failed:', error);
    }
  };

  const acceptTerms = async (accepted: boolean) => {
    if (!user) {
      throw new Error('User must be logged in to accept terms');
    }

    try {
      await updateTermsAcceptance(user.id, accepted);
      
      // Update local user state
      setUser({
        ...user,
        hasAcceptedTerms: accepted,
        termsAcceptedAt: accepted ? new Date().toISOString() : undefined,
      });
      
    } catch (error) {
      console.error('Failed to update terms acceptance:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    supabaseUser,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    acceptTerms,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
