
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const SUPABASE_URL = "https://xvdpcpsmcehzliyuqeuh.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZHBjcHNtY2VoemxpeXVxZXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNzE3OTYsImV4cCI6MjA2MTg0Nzc5Nn0.CEwC7Zitceyc5QB4SpxzczJ4hdW4Ub6o0FfJKPErSpw";

// Create a single base Supabase client for the entire application
// with auth configuration included
export const baseClient = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Helper type for easier creation of specialized clients
export type SupabaseClient = typeof baseClient;
