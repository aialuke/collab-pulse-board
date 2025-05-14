
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './base-client';

// Specialized Supabase client for authentication operations
const authClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Export only the auth-related methods
export const supabaseAuth = {
  auth: authClient.auth,
  getUser: async () => await authClient.auth.getUser(),
  getSession: async () => await authClient.auth.getSession(),
};
