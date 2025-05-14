
import { FeedbackResponse } from '@/types/supabase';
import { FeedbackType, FeedbackStatus } from '@/types/feedback';

// Define the category ID for shout outs
const SHOUT_OUT_CATEGORY_ID = 5;

/**
 * Extract first name from full name
 * @param name - Full name
 * @returns First name
 */
export function getFirstName(name: string): string {
  return name.split(' ')[0] || 'User';
}

/**
 * Safely extract category name from category object
 * @param categories - Category object from database
 * @returns Category name or "Uncategorized" if not available
 */
export function extractCategoryName(categories: { name: string } | null | undefined): string {
  return categories?.name || 'Uncategorized';
}

/**
 * Safely extract profile information
 * @param profiles - Profile data from the database
 * @returns Structured profile information
 */
export function extractProfileInfo(profiles: any): { 
  name: string; 
  avatarUrl?: string; 
  role?: string;
  id?: string;
} {
  let profileInfo = {
    name: 'Unknown User',
    avatarUrl: undefined as string | undefined,
    role: 'user' as string,
    id: undefined as string | undefined
  };
  
  if (profiles && 
      typeof profiles === 'object' && 
      'name' in profiles) {
    profileInfo = {
      name: profiles.name || 'Unknown User',
      avatarUrl: profiles.avatar_url || undefined,
      role: profiles.role || 'user',
      id: profiles.id
    };
  }

  return profileInfo;
}

/**
 * Type guard to check if an object is a valid profile response
 * @param profiles - Potential profile response
 * @returns Boolean indicating if it's a valid profile
 */
export function isValidProfileResponse(profiles: any): profiles is {
  id: string;
  name: string;
  avatar_url: string | null;
  role: string | null;
} {
  return profiles && 
         typeof profiles === 'object' && 
         !('error' in profiles) &&
         'name' in profiles;
}

/**
 * Map database feedback item to frontend model
 * @param item - Database feedback item
 * @param isUpvoted - Whether the current user upvoted this feedback
 * @param originalPostsMap - Map of original posts for reposts
 * @returns Frontend feedback model
 */
export function mapFeedbackItem(
  item: FeedbackResponse, 
  isUpvoted: boolean = false,
  originalPostsMap?: Record<string, FeedbackResponse>
): FeedbackType {
  // Handle author information using the consolidated function
  const authorId = item.user_id;
  
  // Ensure we have a valid profiles object
  let authorInfo = { 
    name: 'Unknown User', 
    id: authorId, 
    avatar_url: null as string | null, 
    role: 'user' as string 
  };
  
  if (item.profiles && isValidProfileResponse(item.profiles)) {
    authorInfo = {
      id: authorId,
      name: item.profiles.name,
      avatar_url: item.profiles.avatar_url,
      role: item.profiles.role || 'user'
    };
  }
  
  // Check if this is a shout out post based on category ID
  const isShoutOut = item.category_id === SHOUT_OUT_CATEGORY_ID;
  
  // Map to frontend model
  const feedbackItem: FeedbackType = {
    id: item.id,
    title: item.title || undefined,
    content: item.content,
    author: {
      id: authorId,
      name: authorInfo.name,
      avatarUrl: authorInfo.avatar_url || undefined,
      role: authorInfo.role || 'user',
    },
    createdAt: new Date(item.created_at),
    category: extractCategoryName(item.categories),
    categoryId: item.category_id,
    upvotes: item.upvotes_count || 0,
    status: item.status as FeedbackStatus,
    imageUrl: item.image_url || undefined,
    linkUrl: item.link_url || undefined,
    isUpvoted,
    image: item.image_url || undefined, // For backward compatibility
    isRepost: item.is_repost || false,
    originalPostId: item.original_post_id || undefined,
    repostComment: item.repost_comment || undefined,
    isShoutOut, // Set based on category ID
  };
  
  // Add original post if this is a repost and we have the original post data
  if (item.is_repost && 
      item.original_post_id && 
      originalPostsMap && 
      originalPostsMap[item.original_post_id]) {
    const originalPost = originalPostsMap[item.original_post_id];
    feedbackItem.originalPost = mapFeedbackItem(originalPost, false);
  }
  
  return feedbackItem;
}

/**
 * Map a collection of feedback items
 * @param items - Database feedback items
 * @param userUpvotes - Map of user upvotes
 * @param originalPostsMap - Map of original posts for reposts
 * @returns Array of frontend feedback models
 */
export function mapFeedbackItems(
  items: FeedbackResponse[], 
  userUpvotes: Record<string, boolean>,
  originalPostsMap?: Record<string, FeedbackResponse>
): FeedbackType[] {
  return items.map(item => 
    mapFeedbackItem(
      item, 
      !!userUpvotes[item.id],
      originalPostsMap
    )
  );
}
