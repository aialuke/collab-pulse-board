
import { supabase } from '@/integrations/supabase/client';
import { mapFeedbackItem } from './utils';
import { FeedbackType } from '@/types/feedback';

/**
 * Creates a repost of an existing feedback item
 */
export async function repostFeedback(originalPostId: string, comment: string): Promise<FeedbackType> {
  try {
    // First, get the original post to copy its category
    const { data: originalPost, error: originalPostError } = await supabase
      .from('feedback')
      .select('*')
      .eq('id', originalPostId)
      .single();

    if (originalPostError) {
      console.error('Error fetching original post:', originalPostError);
      throw originalPostError;
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Create the repost - with minimal content since we'll display the original post
    const { data: repostData, error: repostError } = await supabase
      .from('feedback')
      .insert({
        content: "Repost", // Minimal placeholder for database requirements
        category_id: originalPost.category_id, // Copy original category
        user_id: user.id,
        is_repost: true,
        original_post_id: originalPostId,
        repost_comment: comment,
        status: 'pending', // Default status
      })
      .select()
      .single();

    if (repostError) {
      console.error('Error creating repost:', repostError);
      throw repostError;
    }

    // Now fetch the category information
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('name')
      .eq('id', repostData.category_id)
      .single();

    if (categoryError) {
      console.error('Error fetching category:', categoryError);
      // Continue without category rather than failing completely
    }

    // Fetch the profile information
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      // Continue without profile rather than failing completely
    }

    // Add profile and category data to feedback item
    const feedbackWithData = {
      ...repostData,
      categories: categoryData || { name: 'Uncategorized' },
      profiles: profileData || { name: 'Unknown User' }
    };

    return mapFeedbackItem(feedbackWithData);
  } catch (error) {
    console.error('Error in repostFeedback:', error);
    throw error;
  }
}
