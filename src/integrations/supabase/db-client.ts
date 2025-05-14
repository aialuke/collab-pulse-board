
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './base-client';

// Specialized Supabase client for database operations
const dbClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Export only the database-related methods
export const supabaseDb = {
  from: dbClient.from.bind(dbClient),
  rpc: dbClient.rpc.bind(dbClient),
};
