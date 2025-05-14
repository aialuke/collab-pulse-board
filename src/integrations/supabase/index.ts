
/**
 * Supabase Client Modules
 * 
 * This file provides convenient imports for all Supabase client modules.
 * Import the specialized client that matches your functionality needs.
 */

// Re-export all clients
export { supabaseAuth } from './auth-client';
export { supabaseDb } from './db-client';
export { supabaseStorage } from './storage-client';

// For backward compatibility (deprecated, use specialized clients instead)
export { supabase } from './client';

// Export base configuration if needed
export { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './base-client';
