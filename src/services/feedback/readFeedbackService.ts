
import { supabase } from '@/integrations/supabase/client';
import { FeedbackType } from '@/types/feedback';
import { createBaseFeedbackQuery, fetchProfiles, fetchUserUpvotes, fetchOriginalPosts } from './feedbackApi';
import { mapFeedbackItem, mapFeedbackItems } from './mappers';
import { FeedbackResponse } from '@/types/supabase';

/**
 * Optimized function to fetch all feedback items with pagination and sorting by newest first
 * Improved to reduce database load and network roundtrips
 */
export async function fetchFeedback(
  page: number = 1, 
  limit: number = 10
): Promise<{ items: FeedbackType[], hasMore: boolean, total: number }> {
  try {
    // Select only essential columns to improve query performance
    const columns = 'id, title, content, user_id, category_id, created_at, updated_at, upvotes_count, status, image_url, link_url, is_repost, original_post_id, comments_count, repost_comment';
    
    // Get the current user ID once for efficient upvote checking
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Use Range header instead of count query for better performance
    // This avoids a separate COUNT(*) query which can be slow on large tables
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // 1. Execute main query with optimized select and range
    const { data: feedbackData, error: feedbackError, count } = await supabase
      .from('feedback')
      .select(`
        ${columns},
        categories(name, id)
      `, { count: 'estimated' }) // Use estimated count for better performance
      .order('created_at', { ascending: false })
      .range(from, to);

    if (feedbackError) {
      console.error('Error fetching feedback:', feedbackError);
      throw feedbackError;
    }

    if (!feedbackData || feedbackData.length === 0) {
      return { items: [], hasMore: false, total: count || 0 };
    }

    // 2. Collect unique user IDs to batch fetch profiles
    const userIds = feedbackData
      .filter(item => item && typeof item.user_id === 'string')
      .map(item => item.user_id);
    
    // Create a unique set of user IDs to avoid duplicate queries
    const uniqueUserIds = [...new Set(userIds)];

    // 3. Parallel fetch for profiles and user upvotes to reduce latency
    const [profilesMap, userUpvotes] = await Promise.all([
      fetchProfiles(uniqueUserIds), 
      fetchUserUpvotes(userId)
    ]);

    // 4. Attach profiles to feedback items
    const feedbackWithProfiles: FeedbackResponse[] = feedbackData
      .filter(item => item !== null && typeof item === 'object')
      .map(item => ({
        ...item,
        profiles: profilesMap[item.user_id],
        // Use default values for missing properties
        updated_at: item.updated_at || item.created_at,
        comments_count: item.comments_count || 0,
        is_repost: Boolean(item.is_repost),
        original_post_id: item.original_post_id || null,
        repost_comment: item.repost_comment || null
      }));

    // 5. Identify and fetch original posts for reposts in a single batch
    const repostItems = feedbackWithProfiles.filter(item => 
      item.is_repost && item.original_post_id
    );
    
    let originalPostsMap = {};
    
    if (repostItems.length > 0) {
      const originalPostIds = [...new Set(
        repostItems
          .map(item => item.original_post_id)
          .filter(Boolean) as string[]
      )];
      
      originalPostsMap = await fetchOriginalPosts(
        originalPostIds,
        profilesMap,
        userUpvotes
      );
    }

    // 6. Map to frontend models with optimized processing
    const mappedItems = mapFeedbackItems(feedbackWithProfiles, userUpvotes, originalPostsMap);
    
    // 7. Determine if there are more items using the count
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
    // Get the current user ID once for efficient upvote checking
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // 1. Parallel fetch for the feedback item and user upvotes
    const [feedbackResponse, userUpvotes] = await Promise.all([
      supabase
        .from('feedback')
        .select(`
          id, title, content, user_id, category_id, created_at, updated_at, 
          upvotes_count, status, image_url, link_url, is_repost, 
          original_post_id, comments_count, repost_comment,
          categories(name, id)
        `)
        .eq('id', id)
        .maybeSingle(),
      fetchUserUpvotes(userId)
    ]);
    
    const { data: feedbackData, error: feedbackError } = feedbackResponse;

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
    
    // 4. Map the feedback item
    const feedbackItem = mapFeedbackItem(feedbackWithProfile, !!userUpvotes[feedbackData.id]);

    // 5. If it's a repost, fetch the original post
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
