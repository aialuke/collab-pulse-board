
import { supabase } from '@/integrations/supabase/client';

export async function toggleUpvote(feedbackId: string): Promise<boolean> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return false;

  // First check if the item is a repost - we don't allow upvoting reposts
  const { data: feedbackItem } = await supabase
    .from('feedback')
    .select('user_id, is_repost')
    .eq('id', feedbackId)
    .single();
  
  // Don't allow upvoting reposts
  if (feedbackItem?.is_repost) {
    throw new Error("Reposts cannot be upvoted");
  }
  
  // Check if the feedback belongs to the current user
  if (feedbackItem?.user_id === userId) {
    // User trying to upvote their own post
    throw new Error("You cannot upvote your own feedback");
  }

  // Check if the user has already upvoted
  const { data: existingUpvote } = await supabase
    .from('upvotes')
    .select('id')
    .eq('user_id', userId)
    .eq('feedback_id', feedbackId)
    .single();

  if (existingUpvote) {
    // No longer allow removing upvotes
    return true;
  } else {
    // Add the upvote
    const { error } = await supabase
      .from('upvotes')
      .insert({
        user_id: userId,
        feedback_id: feedbackId
      });

    if (error) {
      console.error('Error adding upvote:', error);
      throw error;
    }
    return true;
  }
}

export async function getUserUpvotes(userId: string | undefined): Promise<Record<string, boolean>> {
  if (!userId) return {};
  
  const { data: upvotes } = await supabase
    .from('upvotes')
    .select('feedback_id')
    .eq('user_id', userId);
  
  if (!upvotes) return {};
  
  return upvotes.reduce((acc, upvote) => {
    acc[upvote.feedback_id] = true;
    return acc;
  }, {} as Record<string, boolean>);
}
