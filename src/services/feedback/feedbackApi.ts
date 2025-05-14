
import { supabaseDb } from '@/integrations/supabase/db-client';
import { FeedbackResponse, ProfileResponse } from '@/types/supabase';

/**
 * Base query builder for feedback with column selection optimization
 * Only selects the columns that are actually needed
 */
export function createBaseFeedbackQuery(columns = '*') {
  return supabaseDb
    .from('feedback')
    .select(`
      ${columns},
      categories(name, id)
    `);
}

/**
 * Fetch profiles for a list of user IDs with caching optimization
 */
export async function fetchProfiles(userIds: string[]): Promise<Record<string, ProfileResponse>> {
  try {
    // If no user IDs, return empty result
    if (!userIds.length) {
      console.log('No user IDs provided to fetchProfiles');
      return {};
    }

    console.log(`Fetching profiles for ${userIds.length} users`);
    
    // Use a single batch query instead of multiple queries
    const { data: profilesData, error: profilesError } = await supabaseDb
      .from('profiles')
      .select('id, name, avatar_url, role')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    // Create a map of user_id to profile data for quick lookups
    const profilesMap: Record<string, ProfileResponse> = {};
    if (profilesData && profilesData.length > 0) {
      console.log(`Successfully fetched ${profilesData.length} profiles`);
      profilesData.forEach(profile => {
        if (profile && profile.id) {
          profilesMap[profile.id] = profile;
        }
      });
    } else {
      console.log('No profile data returned from query');
    }

    return profilesMap;
  } catch (error) {
    console.error('Error in fetchProfiles:', error);
    throw error;
  }
}

/**
 * Fetch upvotes for current user with optimized query
 */
export async function fetchUserUpvotes(userId: string | undefined): Promise<Record<string, boolean>> {
  try {
    if (!userId) {
      console.log('No user ID provided to fetchUserUpvotes, returning empty result');
      return {};
    }
    
    console.log(`Fetching upvotes for user ${userId}`);
    
    const { data: upvotes, error } = await supabaseDb
      .from('upvotes')
      .select('feedback_id')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user upvotes:', error);
      return {};
    }
    
    if (!upvotes || upvotes.length === 0) {
      console.log('No upvotes found for user');
      return {};
    }
    
    console.log(`Found ${upvotes.length} upvotes for user`);
    
    // Use reduce for better performance than object assignment in a loop
    return upvotes.reduce((acc, upvote) => {
      if (upvote && upvote.feedback_id) {
        acc[upvote.feedback_id] = true;
      }
      return acc;
    }, {} as Record<string, boolean>);
  } catch (error) {
    console.error('Error in fetchUserUpvotes:', error);
    return {};
  }
}

/**
 * Fetch original posts for reposts with optimized batch query
 */
export async function fetchOriginalPosts(
  originalPostIds: string[], 
  profilesMap: Record<string, ProfileResponse>,
  userUpvotes: Record<string, boolean>
): Promise<Record<string, FeedbackResponse>> {
  try {
    if (!originalPostIds.length) {
      console.log('No original post IDs provided to fetchOriginalPosts');
      return {};
    }
    
    console.log(`Fetching ${originalPostIds.length} original posts`);
    
    // Optimize the columns we select to only what's needed
    const { data: originalPostsData, error: originalPostsError } = await supabaseDb
      .from('feedback')
      .select(`
        id, title, content, user_id, category_id, 
        created_at, upvotes_count, status, image_url, link_url,
        updated_at, comments_count, is_repost, original_post_id, repost_comment,
        categories(name, id)
      `)
      .in('id', originalPostIds);
      
    if (originalPostsError) {
      console.error('Error fetching original posts:', originalPostsError);
      throw originalPostsError;
    }
    
    if (!originalPostsData || originalPostsData.length === 0) {
      console.log('No original posts found');
      return {};
    }
    
    console.log(`Successfully fetched ${originalPostsData.length} original posts`);
    
    // Get the profiles for original post authors - Fix #1: Use type guards and filter
    const originalPostUserIds: string[] = originalPostsData
      .map(item => item.user_id)
      .filter((id): id is string => typeof id === 'string' && id.length > 0);
    
    // Create a Set from the array for uniqueness, then convert back to array
    const uniqueUserIds = [...new Set(originalPostUserIds)];
    
    // Only fetch profiles we don't already have - Fix #2: Add type safety for profilesMap indexing
    const missingUserIds = uniqueUserIds.filter(id => !Object.prototype.hasOwnProperty.call(profilesMap, id));
    
    if (missingUserIds.length > 0) {
      console.log(`Fetching ${missingUserIds.length} missing profiles for original posts`);
      const additionalProfilesMap = await fetchProfiles(missingUserIds);
      // Merge with existing profiles map
      Object.assign(profilesMap, additionalProfilesMap);
    }
    
    // Create a map of original post id to post data
    const originalPostsMap: Record<string, FeedbackResponse> = {};
    
    originalPostsData.forEach(post => {
      if (post && typeof post.user_id === 'string') {
        // Add profile to the post - Fix #3: Add safer access to profilesMap
        originalPostsMap[post.id] = {
          ...post,
          profiles: Object.prototype.hasOwnProperty.call(profilesMap, post.user_id) 
            ? profilesMap[post.user_id] 
            : null
        };
      }
    });
    
    return originalPostsMap;
  } catch (error) {
    console.error('Error in fetchOriginalPosts:', error);
    throw error;
  }
}
