
import { supabase } from '@/integrations/supabase/client';
import { FeedbackType, FeedbackStatus } from '@/types/feedback';
import { mapFeedbackItem } from './mappers';
import { FeedbackResponse } from '@/types/supabase';

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
    // Fetch all feedback marked as shout-out for the target user
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

    // Use a direct mapping approach that explicitly creates FeedbackType objects
    return data.map(item => {
      // Extract necessary data from the response and create a FeedbackType object
      const feedbackItem: FeedbackType = {
        id: item.id,
        content: item.content,
        author: {
          id: item.user_id,
          name: typeof item.author === 'object' && item.author ? item.author.name || 'Unknown User' : 'Unknown User',
          avatarUrl: typeof item.author === 'object' && item.author ? item.author.avatar_url || undefined : undefined,
          role: typeof item.author === 'object' && item.author ? item.author.role || undefined : undefined
        },
        createdAt: new Date(item.created_at),
        category: typeof item.category === 'object' && item.category ? item.category.name || 'Uncategorized' : 'Uncategorized',
        categoryId: item.category_id,
        upvotes: item.upvotes_count || 0,
        comments: item.comments_count || 0,
        status: item.status as FeedbackStatus, // Explicitly cast to FeedbackStatus
        imageUrl: item.image_url || undefined,
        linkUrl: item.link_url || undefined,
        isUpvoted: false,
        isShoutOut: true,
        targetUserId: item.target_user_id
      };

      return feedbackItem;
    });
  } catch (error) {
    console.error('Error getting shout outs for user:', error);
    return [];
  }
};
