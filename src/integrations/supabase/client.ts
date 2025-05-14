
// Main Supabase client entry point providing consistent access patterns
import { baseClient, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './base-client';
import { supabaseAuth } from './auth-client';
import { supabaseDb } from './db-client';
import { supabaseStorage } from './storage-client';

// Export the base client as the default client
export const supabase = baseClient;

// Export config values
export { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY };

// Export individual services directly for simpler imports
export { supabaseAuth, supabaseDb, supabaseStorage };

/**
 * Lazy-loaded specialized modules - only imported when needed
 * This improves initial bundle size and load time
 */
export const supabaseServices = {
  // Lazy-loaded auth module
  auth: async () => {
    const { createAuthClient } = await import('./auth-service');
    return createAuthClient(baseClient);
  },
  
  // Lazy-loaded database module
  db: async () => {
    const { createDbClient } = await import('./db-service');
    return createDbClient(baseClient);
  },
  
  // Lazy-loaded storage module
  storage: async () => {
    const { createStorageClient } = await import('./storage-service');
    return createStorageClient(baseClient);
  }
};
