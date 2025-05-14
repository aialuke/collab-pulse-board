
import { supabase } from '@/integrations/supabase/client';
import { FeedbackType } from '@/types/feedback';
import { createBaseFeedbackQuery, fetchProfiles, fetchUserUpvotes, fetchOriginalPosts } from './feedbackApi';
import { mapFeedbackItem, mapFeedbackItems } from './mappers';
import { FeedbackResponse } from '@/types/supabase';

/**
 * Fetches all feedback items with optional status filter
 */
export async function fetchFeedback(filterStatus?: string): Promise<FeedbackType[]> {
  try {
    // 1. Build and execute query
    let query = createBaseFeedbackQuery();

    // Apply status filter if provided
    if (filterStatus && filterStatus !== 'all') {
      query = query.eq('status', filterStatus);
    }

    // Default sorting by newest
    query = query.order('created_at', { ascending: false });

    // Execute query
    const { data: feedbackData, error: feedbackError } = await query;

    if (feedbackError) {
      console.error('Error fetching feedback:', feedbackError);
      throw feedbackError;
    }

    if (!feedbackData || feedbackData.length === 0) {
      return [];
    }

    // 2. Collect all unique user IDs
    const userIds = [...new Set(feedbackData.map(item => item.user_id))];

    // 3. Fetch profiles in a single query
    const profilesMap = await fetchProfiles(userIds);

    // 4. Attach profiles to feedback items
    const feedbackWithProfiles: FeedbackResponse[] = feedbackData.map(item => ({
      ...item,
      profiles: profilesMap[item.user_id],
      target_user_id: item.target_user_id || null // Ensure target_user_id exists
    }));

    // 5. Get current user's upvotes
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const userUpvotes = await fetchUserUpvotes(userId);

    // 6. Handle reposts - fetch original posts if needed
    const repostItems = feedbackWithProfiles.filter(item => 
      item.is_repost && item.original_post_id
    );
    
    let originalPostsMap = {};
    
    if (repostItems.length > 0) {
      const originalPostIds = repostItems
        .map(item => item.original_post_id)
        .filter(Boolean) as string[];
      
      originalPostsMap = await fetchOriginalPosts(
        originalPostIds,
        profilesMap,
        userUpvotes
      );
    }

    // 7. Map to frontend models
    return mapFeedbackItems(feedbackWithProfiles, userUpvotes, originalPostsMap);
  } catch (error) {
    console.error('Error in fetchFeedback:', error);
    throw error;
  }
}

/**
 * Fetches a single feedback item by ID
 */
export async function fetchFeedbackById(id: string): Promise<FeedbackType> {
  try {
    // 1. Fetch the specific feedback item
    const { data: feedbackData, error: feedbackError } = await createBaseFeedbackQuery()
      .eq('id', id)
      .single();

    if (feedbackError) {
      console.error('Error fetching feedback by id:', feedbackError);
      throw feedbackError;
    }

    if (!feedbackData) {
      throw new Error('Feedback not found');
    }

    // 2. Fetch profile for the feedback author
    const profilesMap = await fetchProfiles([feedbackData.user_id]);
    
    // 3. Add profile to feedback
    const feedbackWithProfile: FeedbackResponse = {
      ...feedbackData,
      profiles: profilesMap[feedbackData.user_id],
      target_user_id: feedbackData.target_user_id || null // Ensure target_user_id exists
    };

    // 4. Get current user's upvotes
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const userUpvotes = await fetchUserUpvotes(userId);
    
    // 5. Map the feedback item
    const feedbackItem = mapFeedbackItem(feedbackWithProfile, !!userUpvotes[feedbackData.id]);

    // 6. If it's a repost, fetch the original post
    if (feedbackItem.isRepost && feedbackItem.originalPostId) {
      const originalPostsMap = await fetchOriginalPosts(
        [feedbackItem.originalPostId],
        profilesMap,
        userUpvotes
      );
      
      if (originalPostsMap[feedbackItem.originalPostId]) {
        feedbackItem.originalPost = mapFeedbackItem(
          originalPostsMap[feedbackItem.originalPostId],
          !!userUpvotes[feedbackItem.originalPostId]
        );
      }
    }

    return feedbackItem;
  } catch (error) {
    console.error('Error in fetchFeedbackById:', error);
    throw error;
  }
}
