
import { supabase } from '@/integrations/supabase/client';
import { FeedbackType, FeedbackStatus } from '@/types/feedback';
import { mapFeedbackItem } from './mappers';

// Define the category ID for shout outs
const SHOUT_OUT_CATEGORY_ID = 5;

/**
 * Create a new shout out post
 * @param userId The ID of the user creating the post
 * @param content The content of the shout out
 * @returns The created shout out post
 */
export const createShoutOut = async (
  userId: string,
  content: string
): Promise<FeedbackType | null> => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        user_id: userId,
        content,
        category_id: SHOUT_OUT_CATEGORY_ID, // Use the shout out category ID
        status: 'completed' // Use a standard status
      })
      .select('*, categories(*), profiles(*)')
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
 * Get all shout outs
 * @returns A list of shout out posts
 */
export const getAllShoutOuts = async (): Promise<FeedbackType[]> => {
  try {
    // Fetch all feedback with the shout out category
    const { data, error } = await supabase
      .from('feedback')
      .select('*, categories(*), profiles(*)')
      .eq('category_id', SHOUT_OUT_CATEGORY_ID)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error getting shout outs:', error);
      return [];
    }

    // Use the standard mapping function
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Default all to not upvoted for now - we could fetch upvotes if needed
    const userUpvotes = Object.fromEntries(data.map(item => [item.id, false]));

    return data.map(item => mapFeedbackItem(item, userUpvotes[item.id]));
  } catch (error) {
    console.error('Error getting shout outs:', error);
    return [];
  }
};

/**
 * Get shout outs for a specific user (as creator)
 * @param userId The ID of the user to get shout outs for
 * @returns A list of shout out posts
 */
export const getShoutOutsForUser = async (userId: string): Promise<FeedbackType[]> => {
  try {
    // Fetch shout outs where user is the creator
    const { data, error } = await supabase
      .from('feedback')
      .select('*, categories(*), profiles(*)')
      .eq('category_id', SHOUT_OUT_CATEGORY_ID)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error getting shout outs for user:', error);
      return [];
    }

    // Map to frontend models with standard mapping function
    const currentUserId = (await supabase.auth.getUser()).data.user?.id;
    
    // Default all to not upvoted for now
    const userUpvotes = Object.fromEntries(data.map(item => [item.id, false]));

    return data.map(item => mapFeedbackItem(item, userUpvotes[item.id]));
  } catch (error) {
    console.error('Error getting shout outs for user:', error);
    return [];
  }
};
