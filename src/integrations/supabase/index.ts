
/**
 * Supabase Client Modules
 * 
 * This file provides convenient imports for all Supabase client modules.
 * Import the specialized client that matches your functionality needs.
 */

// Re-export the optimized client
export { supabase, supabaseServices } from './client';

// Re-export specialized clients for direct access (deprecated approach)
export { supabaseAuth } from './auth-client';
export { supabaseDb } from './db-client';
export { supabaseStorage } from './storage-client';

// Export base configuration if needed
export { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './base-client';
