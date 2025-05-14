
import { supabase } from '@/integrations/supabase/client';
import { FeedbackType } from '@/types/feedback';
import { createBaseFeedbackQuery, fetchProfiles, fetchUserUpvotes, fetchOriginalPosts } from './feedbackApi';
import { mapFeedbackItem, mapFeedbackItems } from './mappers';
import { FeedbackResponse } from '@/types/supabase';

/**
 * Optimized function to fetch all feedback items with pagination and sorting by newest first
 */
export async function fetchFeedback(
  page: number = 1, 
  limit: number = 10
): Promise<{ items: FeedbackType[], hasMore: boolean, total: number }> {
  try {
    // Select only the columns we need to improve query performance
    const columns = 'id, title, content, user_id, category_id, created_at, updated_at, upvotes_count, status, image_url, link_url, is_repost, original_post_id, comments_count, repost_comment';
    
    // 1. Build query with pagination
    let query = supabase
      .from('feedback')
      .select(`
        ${columns},
        categories(name, id)
      `);

    // Count total before applying pagination (for hasMore calculation)
    const { count } = await supabase.from('feedback').select('*', { count: 'exact', head: true });
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Default sorting by newest
    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    // Execute query
    const { data: feedbackData, error: feedbackError } = await query;

    if (feedbackError) {
      console.error('Error fetching feedback:', feedbackError);
      throw feedbackError;
    }

    if (!feedbackData || feedbackData.length === 0) {
      return { items: [], hasMore: false, total: count || 0 };
    }

    // 2. Collect all unique user IDs
    const userIds = feedbackData
      .filter(item => item && typeof item.user_id === 'string')
      .map(item => item.user_id);

    // 3. Fetch profiles in a single query
    const profilesMap = await fetchProfiles(userIds);

    // 4. Attach profiles to feedback items
    const feedbackWithProfiles: FeedbackResponse[] = feedbackData
      .filter(item => item !== null && typeof item === 'object')
      .map(item => {
        // We need to ensure all required properties are present, adding defaults for optional ones
        return {
          ...item,
          profiles: profilesMap[item.user_id],
          // Make sure all required properties are present, defaulting if necessary
          updated_at: item.updated_at || item.created_at,
          comments_count: item.comments_count || 0,
          is_repost: Boolean(item.is_repost),
          original_post_id: item.original_post_id || null,
          repost_comment: item.repost_comment || null
        };
      });

    // 5. Get current user's upvotes - using optimized query
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const userUpvotes = await fetchUserUpvotes(userId);

    // 6. Handle reposts efficiently - fetch original posts if needed
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
    const mappedItems = mapFeedbackItems(feedbackWithProfiles, userUpvotes, originalPostsMap);
    
    // 8. Determine if there are more items
    const hasMore = count ? from + feedbackData.length < count : false;
    
    return {
      items: mappedItems,
      hasMore,
      total: count || 0
    };
  } catch (error) {
    console.error('Error in fetchFeedback:', error);
    throw error;
  }
}

/**
 * Optimized function to fetch a single feedback item by ID
 */
export async function fetchFeedbackById(id: string): Promise<FeedbackType> {
  try {
    // 1. Fetch the specific feedback item with only necessary columns
    const columns = 'id, title, content, user_id, category_id, created_at, updated_at, upvotes_count, status, image_url, link_url, is_repost, original_post_id, comments_count, repost_comment';
    
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('feedback')
      .select(`
        ${columns},
        categories(name, id)
      `)
      .eq('id', id)
      .maybeSingle();

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
      // Ensure required properties have default values if missing
      updated_at: feedbackData.updated_at || feedbackData.created_at,
      comments_count: feedbackData.comments_count || 0,
      is_repost: Boolean(feedbackData.is_repost),
      original_post_id: feedbackData.original_post_id || null,
      repost_comment: feedbackData.repost_comment || null
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
