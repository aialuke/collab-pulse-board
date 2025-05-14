
import { supabaseDb } from '@/integrations/supabase/db-client';

/**
 * Delete a feedback item by ID
 * This function will only succeed if the user has permission via RLS policies
 */
export async function deleteFeedback(id: string): Promise<void> {
  const { error } = await supabaseDb
    .from('feedback')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
}
