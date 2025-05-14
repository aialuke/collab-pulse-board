import { supabase } from '@/integrations/supabase/client';
import { FeedbackType } from '@/types/feedback';
import { createBaseFeedbackQuery, fetchProfiles, fetchUserUpvotes, fetchOriginalPosts } from './feedbackApi';
import { mapFeedbackItem, mapFeedbackItems } from './mappers';
import { FeedbackResponse } from '@/types/supabase';

/**
 * Fetches all feedback items with optional status filter
 */
export async function fetchFeedback(filterStatus?: string): Promise<FeedbackType[]> {
  console.log('[fetchFeedback] Starting to fetch feedback, filter status:', filterStatus);
  try {
    // Check authentication status
    const { data: authData } = await supabase.auth.getUser();
    console.log('[fetchFeedback] Current auth state:', authData?.user ? 'Authenticated' : 'Not authenticated');
    
    // 1. Build and execute query
    console.log('[fetchFeedback] Building base query');
    let query = createBaseFeedbackQuery();

    // Apply status filter if provided
    if (filterStatus && filterStatus !== 'all') {
      console.log('[fetchFeedback] Applying status filter:', filterStatus);
      query = query.eq('status', filterStatus);
    }

    // Default sorting by newest
    query = query.order('created_at', { ascending: false });
    console.log('[fetchFeedback] Query built, about to execute');

    // Execute query
    const { data: feedbackData, error: feedbackError } = await query;

    if (feedbackError) {
      console.error('[fetchFeedback] Error fetching feedback:', feedbackError);
      throw feedbackError;
    }

    console.log('[fetchFeedback] Feedback data received:', feedbackData?.length || 0, 'items');
    
    if (!feedbackData || feedbackData.length === 0) {
      console.log('[fetchFeedback] No feedback data found, returning empty array');
      return [];
    }

    // 2. Collect all unique user IDs
    const userIds = [...new Set(feedbackData.map(item => item.user_id))];
    console.log('[fetchFeedback] Collected user IDs for profiles:', userIds.length);

    // 3. Fetch profiles in a single query
    console.log('[fetchFeedback] Fetching profiles');
    const profilesMap = await fetchProfiles(userIds);
    console.log('[fetchFeedback] Profiles fetched:', Object.keys(profilesMap).length);

    // 4. Attach profiles to feedback items
    const feedbackWithProfiles: FeedbackResponse[] = feedbackData.map(item => ({
      ...item,
      profiles: profilesMap[item.user_id]
    }));

    // 5. Get current user's upvotes
    console.log('[fetchFeedback] Fetching current user upvotes');
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const userUpvotes = await fetchUserUpvotes(userId);
    console.log('[fetchFeedback] User upvotes fetched:', Object.keys(userUpvotes).length);

    // 6. Handle reposts - fetch original posts if needed
    const repostItems = feedbackWithProfiles.filter(item => 
      item.is_repost && item.original_post_id
    );
    
    console.log('[fetchFeedback] Found repost items:', repostItems.length);
    
    let originalPostsMap = {};
    
    if (repostItems.length > 0) {
      const originalPostIds = repostItems
        .map(item => item.original_post_id)
        .filter(Boolean) as string[];
      
      console.log('[fetchFeedback] Fetching original posts:', originalPostIds.length);
      originalPostsMap = await fetchOriginalPosts(
        originalPostIds,
        profilesMap,
        userUpvotes
      );
      console.log('[fetchFeedback] Original posts fetched:', Object.keys(originalPostsMap).length);
    }

    // 7. Map to frontend models
    console.log('[fetchFeedback] Mapping feedback items to frontend models');
    const mappedItems = mapFeedbackItems(feedbackWithProfiles, userUpvotes, originalPostsMap);
    console.log('[fetchFeedback] Finished mapping, returning', mappedItems.length, 'items');
    
    return mappedItems;
  } catch (error) {
    console.error('[fetchFeedback] Error in fetchFeedback:', error);
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
      console.error('[fetchFeedbackById] Error fetching feedback by id:', feedbackError);
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
      profiles: profilesMap[feedbackData.user_id]
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
    console.error('[fetchFeedbackById] Error in fetchFeedbackById:', error);
    throw error;
  }
}
