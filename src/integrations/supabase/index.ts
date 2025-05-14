
/**
 * Supabase Integration
 * 
 * This file provides consolidated exports for all Supabase-related functionality.
 * Import the specialized client that matches your functionality needs.
 */

// Re-export the main client
export { supabase } from './client';

// Re-export specialized clients for direct access
export { supabaseAuth } from './auth-client';
export { supabaseDb } from './db-client';
export { supabaseStorage } from './storage-client';

// Export services object for lazy-loading
export { supabaseServices } from './client';

// Export base configuration if needed
export { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './base-client';
