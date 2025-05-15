
import { baseClient } from './base-client';

// Export only the auth-related methods
export const supabaseAuth = {
  auth: baseClient.auth,
  getUser: async () => await baseClient.auth.getUser(),
  getSession: async () => await baseClient.auth.getSession(),
};
