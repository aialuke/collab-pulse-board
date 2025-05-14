
import { AuthResponse } from '@supabase/supabase-js';
import { supabaseAuth } from '@/integrations/supabase/auth-client';
import { cleanupAuthState } from '@/utils/authUtils';

/**
 * Sign in with email and password
 */
export async function signInWithEmailAndPassword(
  email: string, 
  password: string
): Promise<AuthResponse> {
  return await supabaseAuth.auth.signInWithPassword({ email, password });
}

/**
 * Sign up with email, password, and name
 */
export async function signUpWithEmailAndPassword(
  name: string, 
  email: string, 
  password: string
): Promise<AuthResponse> {
  return await supabaseAuth.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        name,
      },
    }
  });
}

/**
 * Sign out from all devices
 */
export async function signOut(): Promise<void> {
  // Clean up local storage auth state
  cleanupAuthState();
  
  // Sign out with scope: 'global' to sign out on all devices
  await supabaseAuth.auth.signOut({ scope: 'global' });
}
