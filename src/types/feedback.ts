
export type FeedbackStatus = 'pending' | 'in-progress' | 'completed' | 'shout-out';

export type FeedbackType = {
  id: string;
  title?: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  createdAt: Date;
  category: string;
  categoryId: number;
  upvotes: number;
  comments: number;
  status: FeedbackStatus; // Now supporting 'shout-out' status
  imageUrl?: string;
  linkUrl?: string;
  isUpvoted?: boolean;
  // Add image property for backward compatibility with existing components
  image?: string;
  // Add repost fields
  isRepost?: boolean;
  originalPostId?: string;
  originalPost?: FeedbackType;
  repostComment?: string;
  // Add shout out field
  isShoutOut?: boolean;
  targetUserId?: string; // ID of the user being shouted out
};

export type CreateFeedbackInput = {
  content: string;
  categoryId: number;
  imageUrl?: string;
  linkUrl?: string;
  // Add repost fields
  isRepost?: boolean;
  originalPostId?: string;
  repostComment?: string;
  // Add shout out fields
  isShoutOut?: boolean;
  targetUserId?: string;
};

export type FeedbackFilterOptions = {
  search: string;
  category: string;
  status: string; // Keeping for backward compatibility
  sortBy: 'newest' | 'oldest' | 'upvotes' | 'comments';
};

export type Category = {
  id: number;
  name: string;
};
