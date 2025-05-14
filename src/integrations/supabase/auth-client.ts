
import { baseClient } from './base-client';

// Configure auth options directly on the base client
baseClient.auth.setOptions({
  storage: localStorage,
  persistSession: true,
  autoRefreshToken: true,
});

// Export only the auth-related methods
export const supabaseAuth = {
  auth: baseClient.auth,
  getUser: async () => await baseClient.auth.getUser(),
  getSession: async () => await baseClient.auth.getSession(),
};
