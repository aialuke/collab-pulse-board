
import { supabaseDb } from '@/integrations/supabase/db-client';
import { supabaseAuth } from '@/integrations/supabase/auth-client';
import { User, UserRole } from '@/types/auth';

/**
 * Fetches a user profile by ID and handles cases where profile doesn't exist yet
 */
export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    // Use maybeSingle instead of single to avoid errors when profile doesn't exist
    const { data, error } = await supabaseDb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
        avatarUrl: data.avatar_url,
        hasAcceptedTerms: data.has_accepted_terms || false,
        termsAcceptedAt: data.terms_accepted_at,
      };
    } else {
      // If no profile exists but we have a user, create a default user state
      // This handles race conditions during signup when profile might not be created yet
      console.warn('User profile not found for ID:', userId);
      
      // Get basic user info from Supabase user object
      const { data: userData } = await supabaseAuth.getUser();
      if (userData?.user) {
        return {
          id: userId,
          name: userData.user.user_metadata?.name || userData.user.email?.split('@')[0] || 'User',
          email: userData.user.email || '',
          role: 'user' as UserRole,
          hasAcceptedTerms: false,
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Updates a user's terms acceptance status
 */
export async function updateTermsAcceptance(userId: string, accepted: boolean): Promise<void> {
  const now = new Date().toISOString();
  
  const { error } = await supabaseDb
    .from('profiles')
    .update({
      has_accepted_terms: accepted,
      terms_accepted_at: accepted ? now : null,
    })
    .eq('id', userId);

  if (error) throw error;
}
