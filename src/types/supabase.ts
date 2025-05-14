
// Types for raw Supabase database responses
export interface FeedbackResponse {
  id: string;
  content: string;
  title: string | null;
  user_id: string;
  category_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  upvotes_count: number;
  comments_count: number;
  image_url: string | null;
  link_url: string | null;
  is_repost: boolean | null;
  original_post_id: string | null;
  repost_comment: string | null;
  categories?: { name: string; id: number } | null;
  profiles?: ProfileResponse | null | { error: true } & String;
}

export interface ProfileResponse {
  id: string;
  name: string;
  avatar_url: string | null;
  role: string | null;
}

export interface UpvoteResponse {
  feedback_id: string;
}
