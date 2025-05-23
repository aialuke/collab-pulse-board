
import { supabaseDb } from '@/integrations/supabase/db-client';
import { toastService } from '@/services/toastService';

/**
 * Delete a feedback item by ID
 * This function will only succeed if the user has permission via RLS policies
 * @param id - The ID of the feedback item to delete
 * @returns Promise that resolves when deletion is successful
 * @throws Error if deletion fails
 */
export async function deleteFeedback(id: string): Promise<void> {
  try {
    // Check if the feedback exists before attempting to delete
    // This helps provide better error messages
    const { data: feedbackExists, error: checkError } = await supabaseDb
      .from('feedback')
      .select('id')
      .eq('id', id)
      .single();
    
    if (checkError || !feedbackExists) {
      console.error('Feedback not found:', checkError || 'Item may have been already deleted');
      throw new Error('Feedback not found or already deleted');
    }
    
    // Delete related upvotes first to maintain data integrity
    // This prevents foreign key constraint errors
    const { error: upvotesError } = await supabaseDb
      .from('upvotes')
      .delete()
      .eq('feedback_id', id);
    
    if (upvotesError) {
      console.error('Error deleting related upvotes:', upvotesError);
      throw upvotesError;
    }
    
    // Now delete the actual feedback item
    const { error } = await supabaseDb
      .from('feedback')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
    
    // Show success toast using the safe toast service
    toastService.success("Feedback deleted successfully");
  } catch (error) {
    console.error('Error in deleteFeedback:', error);
    toastService.error("Failed to delete feedback. Please try again.");
    throw error;
  }
}
