
import { supabase } from '@/integrations/supabase/client';
import { FeedbackType } from '@/types/feedback';
import { handleApiError } from '../api/apiUtils';
import { FeedbackResponse, ProfileResponse } from '@/types/supabase';

// Improved profile cache with proper expiration handling
const profileCache = new Map<string, ProfileResponse>();
const profileCacheTimestamps = new Map<string, number>();
const PROFILE_CACHE_LIFETIME = 5 * 60 * 1000; // 5 minutes

// Cache for upvotes to prevent redundant fetches
const upvotesCache = new Map<string, Record<string, boolean>>();
const upvotesCacheTimestamps = new Map<string, number>();
const UPVOTES_CACHE_LIFETIME = 2 * 60 * 1000; // 2 minutes

/**
 * Enhanced profile fetching with efficient caching
 */
export async function fetchProfiles(
  userIds: string[]
): Promise<Record<string, ProfileResponse>> {
  return handleApiError(async () => {
    if (!userIds.length) return {};

    const now = Date.now();
    const result: Record<string, ProfileResponse> = {};
    const idsToFetch: string[] = [];

    // Check cache first for each user ID with proper expiration
    userIds.forEach(id => {
      const timestamp = profileCacheTimestamps.get(id);
      const profile = profileCache.get(id);
      
      if (profile && timestamp && now - timestamp < PROFILE_CACHE_LIFETIME) {
        result[id] = profile;
      } else {
        idsToFetch.push(id);
        
        // Clean up expired cache entries
        if (timestamp && now - timestamp >= PROFILE_CACHE_LIFETIME) {
          profileCache.delete(id);
          profileCacheTimestamps.delete(id);
        }
      }
    });

    // If all profiles were in cache, return immediately
    if (idsToFetch.length === 0) {
      return result;
    }

    // Fetch only the profiles we don't have in cache
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, role')
      .in('id', idsToFetch);

    if (profilesError) {
      throw profilesError;
    }

    // Update cache and result with new profiles
    if (profilesData) {
      profilesData.forEach(profile => {
        if (profile && profile.id) {
          profileCache.set(profile.id, profile);
          profileCacheTimestamps.set(profile.id, now);
          result[profile.id] = profile;
        }
      });
    }

    return result;
  }, "Failed to fetch user profiles");
}

/**
 * Enhanced upvotes fetching with caching
 */
export async function fetchUserUpvotes(
  userId: string | undefined
): Promise<Record<string, boolean>> {
  return handleApiError(async () => {
    if (!userId) return {};
    
    const now = Date.now();
    const cacheKey = userId;
    const cachedTimestamp = upvotesCacheTimestamps.get(cacheKey);
    const cachedUpvotes = upvotesCache.get(cacheKey);
    
    // Return cached data if valid
    if (cachedUpvotes && cachedTimestamp && now - cachedTimestamp < UPVOTES_CACHE_LIFETIME) {
      return cachedUpvotes;
    }
    
    // Fetch fresh data
    const { data: upvotes, error } = await supabase
      .from('upvotes')
      .select('feedback_id')
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
    
    // Transform and cache results
    const upvotesMap = (upvotes || []).reduce((acc, upvote) => {
      if (upvote && upvote.feedback_id) {
        acc[upvote.feedback_id] = true;
      }
      return acc;
    }, {} as Record<string, boolean>);
    
    // Update cache
    upvotesCache.set(cacheKey, upvotesMap);
    upvotesCacheTimestamps.set(cacheKey, now);
    
    return upvotesMap;
  }, "Failed to fetch user upvotes");
}

/**
 * Optimized function to fetch original posts for reposts
 */
export async function fetchOriginalPosts(
  originalPostIds: string[]
): Promise<Record<string, FeedbackResponse>> {
  return handleApiError(async () => {
    if (!originalPostIds.length) return {};
    
    // Filter to unique IDs
    const uniqueIds = [...new Set(originalPostIds)];
    
    // Fetch original posts
    const { data: originalPostsData, error: originalPostsError } = await supabase
      .from('feedback')
      .select(`
        id, title, content, user_id, category_id, 
        created_at, upvotes_count, image_url, link_url,
        updated_at, comments_count, is_repost, original_post_id, repost_comment,
        categories(name, id)
      `)
      .in('id', uniqueIds);
      
    if (originalPostsError) {
      throw originalPostsError;
    }
    
    if (!originalPostsData) return {};
    
    // Get all user IDs from posts
    const originalPostUserIds = originalPostsData
      .filter(item => item && typeof item.user_id === 'string')
      .map(item => item.user_id);
    
    // Create a Set from the array for uniqueness
    const uniqueUserIds = [...new Set(originalPostUserIds)];
    
    // Fetch all profiles in one go
    const profilesMap = await fetchProfiles(uniqueUserIds);
    
    // Get current user's upvotes
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const userUpvotes = await fetchUserUpvotes(userId);
    
    // Create a map of original post id to post data
    const originalPostsMap: Record<string, FeedbackResponse> = {};
    
    if (originalPostsData) {
      originalPostsData.forEach(post => {
        if (post && typeof post.user_id === 'string') {
          originalPostsMap[post.id] = {
            ...post,
            profiles: profilesMap[post.user_id]
          } as FeedbackResponse;
        }
      });
    }
    
    return originalPostsMap;
  }, "Failed to fetch original posts");
}

/**
 * Unified, optimized feedback fetching function that replaces duplicates
 */
export async function fetchFeedback({
  page = 1,
  limit = 10,
  category = '',
  status = '',
  search = ''
}: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
} = {}): Promise<{ items: FeedbackType[], hasMore: boolean, total: number }> {
  return handleApiError(async () => {
    // Calculate pagination range
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Begin constructing query
    let query = supabase
      .from('feedback')
      .select(`
        id, title, content, user_id, category_id, created_at, updated_at, 
        upvotes_count, image_url, link_url, is_repost, original_post_id, 
        comments_count, repost_comment, categories(name, id)
      `, { count: 'estimated' });
    
    // Apply filters if provided
    if (category && category !== 'all') {
      // Join with categories table to filter by category name
      query = query.eq('categories.name', category);
    }
    
    // Apply search filter if provided
    if (search) {
      query = query.ilike('content', `%${search}%`);
    }
    
    // Apply sorting and pagination
    const { data: feedbackData, error: feedbackError, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (feedbackError) {
      throw feedbackError;
    }

    if (!feedbackData || feedbackData.length === 0) {
      return { items: [], hasMore: false, total: count || 0 };
    }

    // Extract user IDs for batch profile fetching
    const userIds = feedbackData
      .filter(item => item && typeof item.user_id === 'string')
      .map(item => item.user_id);
    const uniqueUserIds = [...new Set(userIds)];

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Fetch profiles and user upvotes in parallel
    const [profilesMap, userUpvotes] = await Promise.all([
      fetchProfiles(uniqueUserIds),
      fetchUserUpvotes(userId)
    ]);

    // Collect original post IDs for reposts
    const originalPostIds = feedbackData
      .filter(item => item.is_repost && item.original_post_id)
      .map(item => item.original_post_id as string);
    
    // Fetch original posts if needed
    const originalPostsMap = originalPostIds.length > 0
      ? await fetchOriginalPosts(originalPostIds)
      : {};

    // Process feedback data with profiles
    const processedFeedback = feedbackData.map(item => {
      const author = profilesMap[item.user_id];
      const isRepost = Boolean(item.is_repost);
      const originalPost = isRepost && item.original_post_id && originalPostsMap[item.original_post_id] 
        ? {
            id: originalPostsMap[item.original_post_id].id,
            title: originalPostsMap[item.original_post_id].title || undefined,
            content: originalPostsMap[item.original_post_id].content,
            author: {
              id: originalPostsMap[item.original_post_id].user_id,
              name: originalPostsMap[item.original_post_id].profiles?.name || 'Unknown User',
              avatarUrl: originalPostsMap[item.original_post_id].profiles?.avatar_url || undefined,
            },
            category: originalPostsMap[item.original_post_id].categories?.name || 'Uncategorized',
            categoryId: originalPostsMap[item.original_post_id].category_id,
            createdAt: new Date(originalPostsMap[item.original_post_id].created_at),
            upvotes: originalPostsMap[item.original_post_id].upvotes_count,
            imageUrl: originalPostsMap[item.original_post_id].image_url || undefined,
            linkUrl: originalPostsMap[item.original_post_id].link_url || undefined,
            isUpvoted: Boolean(userUpvotes[originalPostsMap[item.original_post_id].id]),
          }
        : undefined;

      return {
        id: item.id,
        title: item.title || undefined,
        content: item.content,
        author: {
          id: item.user_id,
          name: author?.name || 'Unknown User',
          avatarUrl: author?.avatar_url || undefined,
        },
        category: item.categories?.name || 'Uncategorized',
        categoryId: item.category_id,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at || item.created_at),
        upvotes: item.upvotes_count,
        imageUrl: item.image_url || undefined,
        linkUrl: item.link_url || undefined,
        isRepost,
        originalPostId: item.original_post_id || undefined,
        originalPost,
        repostComment: item.repost_comment || undefined,
        commentsCount: item.comments_count || 0,
        isUpvoted: Boolean(userUpvotes[item.id]),
        image: item.image_url || undefined, // For backward compatibility
      };
    });

    return {
      items: processedFeedback,
      hasMore: count ? from + feedbackData.length < count : false,
      total: count || 0
    };
  }, "Failed to fetch feedback");
}

/**
 * Optimized function to fetch a single feedback item by ID
 */
export async function fetchFeedbackById(id: string): Promise<FeedbackType> {
  return handleApiError(async () => {
    // Get current user for upvote checking
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    
    // Fetch the feedback item
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('feedback')
      .select(`
        id, title, content, user_id, category_id, created_at, updated_at, 
        upvotes_count, image_url, link_url, is_repost, 
        original_post_id, comments_count, repost_comment,
        categories(name, id)
      `)
      .eq('id', id)
      .maybeSingle();

    if (feedbackError) {
      throw feedbackError;
    }

    if (!feedbackData) {
      throw new Error('Feedback not found');
    }

    // Get user upvotes and profile in parallel
    const [userUpvotes, profilesMap] = await Promise.all([
      fetchUserUpvotes(userId),
      fetchProfiles([feedbackData.user_id])
    ]);

    // Get author info
    const author = profilesMap[feedbackData.user_id];
    const isRepost = Boolean(feedbackData.is_repost);
    
    // Fetch original post if this is a repost
    let originalPost;
    if (isRepost && feedbackData.original_post_id) {
      const originalPostsMap = await fetchOriginalPosts([feedbackData.original_post_id]);
      const originalPostData = originalPostsMap[feedbackData.original_post_id];
      
      if (originalPostData) {
        const originalAuthor = await fetchProfiles([originalPostData.user_id]);
        originalPost = {
          id: originalPostData.id,
          title: originalPostData.title || undefined,
          content: originalPostData.content,
          author: {
            id: originalPostData.user_id,
            name: originalAuthor[originalPostData.user_id]?.name || 'Unknown User',
            avatarUrl: originalAuthor[originalPostData.user_id]?.avatar_url || undefined,
          },
          category: originalPostData.categories?.name || 'Uncategorized',
          categoryId: originalPostData.category_id,
          createdAt: new Date(originalPostData.created_at),
          upvotes: originalPostData.upvotes_count,
          imageUrl: originalPostData.image_url || undefined,
          linkUrl: originalPostData.link_url || undefined,
          isUpvoted: Boolean(userUpvotes[originalPostData.id]),
        };
      }
    }

    // Build and return the response
    return {
      id: feedbackData.id,
      title: feedbackData.title || undefined,
      content: feedbackData.content,
      author: {
        id: feedbackData.user_id,
        name: author?.name || 'Unknown User',
        avatarUrl: author?.avatar_url || undefined,
      },
      category: feedbackData.categories?.name || 'Uncategorized',
      categoryId: feedbackData.category_id,
      createdAt: new Date(feedbackData.created_at),
      updatedAt: new Date(feedbackData.updated_at || feedbackData.created_at),
      upvotes: feedbackData.upvotes_count,
      imageUrl: feedbackData.image_url || undefined,
      linkUrl: feedbackData.link_url || undefined,
      isRepost,
      originalPostId: feedbackData.original_post_id || undefined,
      originalPost,
      repostComment: feedbackData.repost_comment || undefined,
      commentsCount: feedbackData.comments_count || 0,
      isUpvoted: Boolean(userUpvotes[feedbackData.id]),
      image: feedbackData.image_url || undefined, // For backward compatibility
    };
  }, "Failed to fetch feedback details");
}
