
import { FeedbackType, FeedbackStatus } from '@/types/feedback';

/**
 * Extracts the first name from a full name string
 */
export function getFirstName(fullName: string): string {
  if (!fullName) return 'User';
  return fullName.split(' ')[0];
}

/**
 * Safely extract profile information with proper type checking
 */
export function extractProfileInfo(profiles: any): { name: string; avatarUrl?: string } {
  let profileName = 'Unknown User';
  let profileAvatarUrl: string | undefined = undefined;
  
  if (profiles && 
      typeof profiles === 'object' && 
      'name' in profiles) {
    profileName = profiles.name || 'Unknown User';
    profileAvatarUrl = profiles.avatar_url;
  }

  return { name: profileName, avatarUrl: profileAvatarUrl };
}

/**
 * Safely extract category information
 */
export function extractCategoryInfo(categories: any): string {
  if (categories && 
      typeof categories === 'object' && 
      'name' in categories) {
    return categories.name || 'Uncategorized';
  }
  return 'Uncategorized';
}

/**
 * Map database feedback item to frontend model
 */
export function mapFeedbackItem(item: any, isUpvoted: boolean = false): FeedbackType {
  // Use null coalescing to handle potential undefined values
  const categoryName = item.categories ? extractCategoryInfo(item.categories) : 'Uncategorized';
  
  // Handle potential missing author data gracefully
  const authorId = item.user_id || 'unknown';
  const authorName = item.profiles?.name || 'Unknown User';
  const authorAvatarUrl = item.profiles?.avatar_url;

  return {
    id: item.id,
    title: item.title,
    content: item.content,
    author: {
      id: authorId,
      name: authorName,
      avatarUrl: authorAvatarUrl,
    },
    createdAt: new Date(item.created_at),
    category: categoryName,
    categoryId: item.category_id,
    upvotes: item.upvotes_count || 0,
    status: item.status as FeedbackStatus,
    imageUrl: item.image_url || undefined,
    linkUrl: item.link_url || undefined,
    isUpvoted,
    image: item.image_url || undefined, // For backward compatibility
  };
}
