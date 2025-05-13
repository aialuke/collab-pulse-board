
import { FeedbackResponse } from '@/types/supabase';
import { FeedbackType, FeedbackStatus } from '@/types/feedback';

// Extract first name from full name
export function getFirstName(name: string): string {
  return name.split(' ')[0] || 'User';
}

// Safely extract category information
export function extractCategoryName(categories: { name: string } | null | undefined): string {
  return categories?.name || 'Uncategorized';
}

// Type guard to check if profiles has required properties
function isFullProfileInfo(profiles: any): profiles is { 
  id: string;
  name: string;
  avatar_url: string | null;
  role: string | null;
} {
  return profiles && 
         typeof profiles === 'object' && 
         'name' in profiles &&
         'avatar_url' in profiles &&
         'role' in profiles;
}

// Map database feedback item to frontend model
export function mapFeedbackItem(
  item: FeedbackResponse, 
  isUpvoted: boolean = false,
  originalPostsMap?: Record<string, FeedbackResponse>
): FeedbackType {
  // Handle author information - use type guard for proper type checking
  const authorId = item.user_id;
  const authorInfo = item.profiles || { name: 'Unknown User' };
  
  // Map to frontend model
  const feedbackItem: FeedbackType = {
    id: item.id,
    title: item.title || undefined,
    content: item.content,
    author: {
      id: authorId,
      name: authorInfo.name,
      avatarUrl: isFullProfileInfo(authorInfo) ? authorInfo.avatar_url || undefined : undefined,
      role: isFullProfileInfo(authorInfo) ? authorInfo.role || 'user' : 'user',
    },
    createdAt: new Date(item.created_at),
    category: extractCategoryName(item.categories),
    categoryId: item.category_id,
    upvotes: item.upvotes_count || 0,
    comments: item.comments_count || 0,
    status: item.status as FeedbackStatus,
    imageUrl: item.image_url || undefined,
    linkUrl: item.link_url || undefined,
    isUpvoted,
    image: item.image_url || undefined, // For backward compatibility
    isRepost: item.is_repost || false,
    originalPostId: item.original_post_id || undefined,
    repostComment: item.repost_comment || undefined,
  };
  
  // Add original post if this is a repost and we have the original post data
  if (item.is_repost && 
      item.original_post_id && 
      originalPostsMap && 
      originalPostsMap[item.original_post_id]) {
    const originalPost = originalPostsMap[item.original_post_id];
    feedbackItem.originalPost = mapFeedbackItem(originalPost, !!originalPost.id);
  }
  
  return feedbackItem;
}

// Map a collection of feedback items
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
