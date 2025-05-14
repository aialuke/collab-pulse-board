
import { baseClient } from './base-client';

// Export the database-related methods with additional logging
export const supabaseDb = {
  from: function(table: string) {
    console.log(`Creating query for table: ${table}`);
    return baseClient.from(table);
  },
  rpc: function(fn: string, params?: object) {
    console.log(`Calling RPC function: ${fn}`, params || {});
    return baseClient.rpc(fn, params);
  }
};

// Export a debug function to check auth state
export const debugAuthState = async () => {
  try {
    const { data, error } = await baseClient.auth.getSession();
    if (error) {
      console.error('Error getting auth session:', error);
      return { authenticated: false, error };
    }
    return { 
      authenticated: !!data.session, 
      session: data.session,
      user: data.session?.user
    };
  } catch (error) {
    console.error('Exception getting auth session:', error);
    return { authenticated: false, error };
  }
};
