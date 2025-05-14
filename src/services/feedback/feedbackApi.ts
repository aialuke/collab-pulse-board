
import { supabase } from '@/integrations/supabase/client';
import { FeedbackResponse, ProfileResponse, UpvoteResponse } from '@/types/supabase';

/**
 * Base query builder for feedback with column selection optimization
 * Only selects the columns that are actually needed
 */
export function createBaseFeedbackQuery(columns = '*') {
  return supabase
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
    if (!userIds.length) return {};

    // Use a single batch query instead of multiple queries
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, role')
      .in('id', userIds)
      .order('name')
      // Remove the options property as it's not supported
      .limit(userIds.length);  // Use limit directly instead of options

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      throw profilesError;
    }

    // Create a map of user_id to profile data for quick lookups
    const profilesMap: Record<string, ProfileResponse> = {};
    if (profilesData) {
      profilesData.forEach(profile => {
        profilesMap[profile.id] = profile;
      });
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
    if (!userId) return {};
    
    const { data: upvotes } = await supabase
      .from('upvotes')
      .select('feedback_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!upvotes) return {};
    
    // Use reduce for better performance than object assignment in a loop
    return upvotes.reduce((acc, upvote) => {
      acc[upvote.feedback_id] = true;
      return acc;
    }, {} as Record<string, boolean>);
  } catch (error) {
    console.error('Error fetching user upvotes:', error);
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
    if (!originalPostIds.length) return {};
    
    // Optimize the columns we select to only what's needed
    const { data: originalPostsData, error: originalPostsError } = await supabase
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
    
    if (!originalPostsData) return {};
    
    // Get the profiles for original post authors
    const originalPostUserIds = [...new Set(originalPostsData.map(item => item.user_id))];
    
    // Only fetch profiles we don't already have
    const missingUserIds = originalPostUserIds.filter(id => !profilesMap[id]);
    
    if (missingUserIds.length > 0) {
      const additionalProfilesMap = await fetchProfiles(missingUserIds);
      // Merge with existing profiles map
      Object.assign(profilesMap, additionalProfilesMap);
    }
    
    // Create a map of original post id to post data
    const originalPostsMap: Record<string, FeedbackResponse> = {};
    
    originalPostsData.forEach(post => {
      // Add profile to the post
      originalPostsMap[post.id] = {
        ...post,
        profiles: profilesMap[post.user_id]
      };
    });
    
    return originalPostsMap;
  } catch (error) {
    console.error('Error in fetchOriginalPosts:', error);
    throw error;
  }
}
