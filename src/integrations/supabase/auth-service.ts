
import { SupabaseClient } from './base-client';

// Create a function that applies auth configuration to the base client
export const createAuthClient = (baseClient: SupabaseClient) => {
  return {
    auth: baseClient.auth,
    getUser: async () => await baseClient.auth.getUser(),
    getSession: async () => await baseClient.auth.getSession(),
  };
};
