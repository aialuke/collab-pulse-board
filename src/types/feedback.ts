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
  imageUrl?: string;
  linkUrl?: string;
  isUpvoted?: boolean;
  // Keeping image property for backward compatibility until fully migrated
  image?: string;
  // Repost fields
  isRepost?: boolean;
  originalPostId?: string;
  originalPost?: FeedbackType;
  repostComment?: string;
  // Shout out field
  isShoutOut?: boolean;
};

export type CreateFeedbackInput = {
  content: string;
  categoryId: number;
  imageUrl?: string;
  linkUrl?: string;
  isRepost?: boolean;
  originalPostId?: string;
  repostComment?: string;
};

export type Category = {
  id: number;
  name: string;
};
