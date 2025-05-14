
// This file provides the main entry point for Supabase services
import { baseClient, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './base-client';

// Export the base client as the default client
export const supabase = baseClient;

// Export the config values
export { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY };

// Dynamically load specialized modules only when needed
export const supabaseServices = {
  // Lazy-loaded auth module
  auth: async () => {
    // Only import when needed
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

// Export individual services directly for backward compatibility and simpler imports
export { supabaseAuth } from './auth-client';
export { supabaseDb } from './db-client';
export { supabaseStorage } from './storage-client';
