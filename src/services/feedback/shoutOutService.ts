
import { supabase } from '@/integrations/supabase/client';
import { FeedbackType } from '@/types/feedback';
import { mapFeedbackItem } from './mappers';

/**
 * Create a new shout out post
 * @param userId The ID of the user creating the post
 * @param targetUserId The ID of the user being shouted out
 * @param content The content of the shout out
 * @param categoryId The category ID for the post
 * @returns The created shout out post
 */
export const createShoutOut = async (
  userId: string,
  targetUserId: string,
  content: string,
  categoryId: number
): Promise<FeedbackType | null> => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id: userId,
        content,
        category_id: categoryId,
        target_user_id: targetUserId,
        // Add custom metadata instead of column
        status: 'shout-out'
      })
      .select('*, author:profiles(*), category:categories(*)')
      .single();

    if (error) {
      console.error('Error creating shout out:', error);
      return null;
    }

    return mapFeedbackItem(data);
  } catch (error) {
    console.error('Error creating shout out:', error);
    return null;
  }
};

/**
 * Mark a feedback post as a shout out
 * @param feedbackId The ID of the feedback to mark as a shout out
 * @returns Success status
 */
export const markAsShoutOut = async (feedbackId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('feedback')
      .update({ 
        status: 'shout-out' // Use status field instead of custom column
      })
      .eq('id', feedbackId);

    if (error) {
      console.error('Error marking as shout out:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error marking as shout out:', error);
    return false;
  }
};

/**
 * Get all shout outs for a specific user
 * @param targetUserId The ID of the user to get shout outs for
 * @returns A list of shout out posts
 */
export const getShoutOutsForUser = async (targetUserId: string): Promise<FeedbackType[]> => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*, author:profiles(*), category:categories(*)')
      .eq('status', 'shout-out')
      .eq('target_user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error getting shout outs for user:', error);
      return [];
    }

    // Map each item individually with explicit typing to avoid recursive type issues
    return data.map(item => mapFeedbackItem(item, false));
  } catch (error) {
    console.error('Error getting shout outs for user:', error);
    return [];
  }
};
