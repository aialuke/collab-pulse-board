
import { baseClient } from './base-client';
import type { Database } from './types';

// Type for table names
type TableNames = keyof Database['public']['Tables'];
type FunctionNames = keyof Database['public']['Functions'];

// Export the database-related methods with additional logging and proper typing
export const supabaseDb = {
  from: function<T extends TableNames>(table: T) {
    console.log(`Creating query for table: ${table}`);
    return baseClient.from(table);
  },
  rpc: function<T extends FunctionNames>(fn: T, params?: Database['public']['Functions'][T]['Args']) {
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
