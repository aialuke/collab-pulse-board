
import { baseClient } from './base-client';

// Export only the auth-related methods
export const supabaseAuth = {
  auth: baseClient.auth,
  getUser: async () => await baseClient.auth.getUser(),
  getSession: async () => await baseClient.auth.getSession(),
};

// Note: Modern Supabase client doesn't use setOptions directly
// Auth options should be configured when creating the client in base-client.ts
