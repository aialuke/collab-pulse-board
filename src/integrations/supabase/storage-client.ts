
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './base-client';

// Specialized Supabase client for storage operations
const storageClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Export only the storage-related methods
export const supabaseStorage = {
  storage: storageClient.storage,
};
