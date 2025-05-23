
import { supabaseDb } from '@/integrations/supabase/db-client';
import { supabaseAuth } from '@/integrations/supabase/auth-client';
import { FeedbackType } from '@/types/feedback';
import { handleApiError, withSuccessToast } from './apiUtils';
import { FeedbackResponse, ProfileResponse } from '@/types/supabase';

// Simple in-memory cache for profiles
// This reduces redundant profile fetches during a session
const profileCache: Record<string, ProfileResponse> = {};
const CACHE_LIFETIME = 5 * 60 * 1000; // 5 minutes
const profileCacheTimestamps: Record<string, number> = {};

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
 * Fetch profiles for a list of user IDs with optimized caching
 * Uses an in-memory cache to avoid redundant database queries
 */
export async function fetchProfiles(userIds: string[]): Promise<Record<string, ProfileResponse>> {
  return handleApiError(async () => {
    // If no user IDs, return empty result
    if (!userIds.length) return {};

    const now = Date.now();
    const result: Record<string, ProfileResponse> = {};
    const idsToFetch: string[] = [];

    // Check cache first for each user ID
    userIds.forEach(id => {
      if (profileCache[id] && profileCacheTimestamps[id] > now - CACHE_LIFETIME) {
        // Use cached profile if it exists and isn't expired
        result[id] = profileCache[id];
      } else {
        // Mark this ID for fetching
        idsToFetch.push(id);
      }
    });

    // If all profiles were in cache, return immediately
    if (idsToFetch.length === 0) {
      return result;
    }

    // Fetch only the profiles we don't have in cache
    const { data: profilesData, error: profilesError } = await supabaseDb
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
          // Update cache
          profileCache[profile.id] = profile;
          profileCacheTimestamps[profile.id] = now;
          // Add to result
          result[profile.id] = profile;
        }
      });
    }

    return result;
  }, "Failed to fetch user profiles");
}

/**
 * Fetch upvotes for current user with optimized query
 * Uses a single efficient query to get all upvotes
 */
export async function fetchUserUpvotes(userId: string | undefined): Promise<Record<string, boolean>> {
  return handleApiError(async () => {
    if (!userId) return {};
    
    const { data: upvotes, error } = await supabaseDb
      .from('upvotes')
      .select('feedback_id')
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
    
    if (!upvotes) return {};
    
    // Use reduce for better performance than object assignment in a loop
    return upvotes.reduce((acc, upvote) => {
      if (upvote && upvote.feedback_id) {
        acc[upvote.feedback_id] = true;
      }
      return acc;
    }, {} as Record<string, boolean>);
  }, "Failed to fetch user upvotes");
}

/**
 * Fetch original posts for reposts with optimized batch query
 * Reduces multiple network roundtrips to a single database query
 */
export async function fetchOriginalPosts(
  originalPostIds: string[], 
  profilesMap: Record<string, ProfileResponse>,
  userUpvotes: Record<string, boolean>
): Promise<Record<string, FeedbackResponse>> {
  return handleApiError(async () => {
    if (!originalPostIds.length) return {};
    
    // Use a unique set of IDs to avoid duplicates
    const uniqueIds = [...new Set(originalPostIds)];
    
    // Optimize the columns we select to only what's needed
    const { data: originalPostsData, error: originalPostsError } = await supabaseDb
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
    
    // Get the profiles for original post authors that we don't already have
    const originalPostUserIds = originalPostsData
      .filter(item => item && typeof item.user_id === 'string')
      .map(item => item.user_id);
    
    // Create a Set from the array for uniqueness, then convert back to array
    const uniqueUserIds = [...new Set(originalPostUserIds)];
    
    // Only fetch profiles we don't already have
    const missingUserIds = uniqueUserIds.filter(id => !profilesMap[id]);
    
    if (missingUserIds.length > 0) {
      const additionalProfilesMap = await fetchProfiles(missingUserIds);
      // Merge with existing profiles map
      Object.assign(profilesMap, additionalProfilesMap);
    }
    
    // Create a map of original post id to post data
    const originalPostsMap: Record<string, FeedbackResponse> = {};
    
    if (originalPostsData && Array.isArray(originalPostsData)) {
      originalPostsData.forEach(post => {
        if (post && typeof post.user_id === 'string') {
          // Add profile to the post and ensure it's a valid FeedbackResponse
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
