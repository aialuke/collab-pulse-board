
import { supabase } from '@/integrations/supabase/client';
import { CommentType, CreateCommentInput } from '@/types/comments';
import { extractProfileInfo } from './utils';

export async function fetchComments(feedbackId: string): Promise<CommentType[]> {
  try {
    // Fetch comments for a specific feedback item
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('feedback_id', feedbackId)
      .order('created_at', { ascending: true });
    
    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
      throw commentsError;
    }

    if (!commentsData || commentsData.length === 0) {
      return [];
    }

    // Collect all unique user IDs from the comments
    const userIds = [...new Set(commentsData.map(comment => comment.user_id))];

    // Fetch profiles for these user IDs in a single query
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles for comments:', profilesError);
      // Continue without profiles rather than failing completely
    }

    // Create a map of user_id to profile data for quick lookups
    const profilesMap: Record<string, { name: string; avatar_url?: string }> = {};
    if (profilesData) {
      profilesData.forEach(profile => {
        profilesMap[profile.id] = {
          name: profile.name,
          avatar_url: profile.avatar_url
        };
      });
    }

    // Map to our frontend model
    return commentsData.map(comment => {
      const profile = profilesMap[comment.user_id] || { name: 'Unknown User', avatar_url: undefined };

      return {
        id: comment.id,
        content: comment.content,
        author: {
          id: comment.user_id,
          name: profile.name,
          avatarUrl: profile.avatar_url,
        },
        feedbackId: comment.feedback_id,
        createdAt: new Date(comment.created_at),
      };
    });
  } catch (error) {
    console.error('Error in fetchComments:', error);
    throw error;
  }
}

export async function addComment(input: CreateCommentInput): Promise<CommentType> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    // Insert the comment
    const { data, error } = await supabase
      .from('comments')
      .insert({
        content: input.content,
        feedback_id: input.feedbackId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }

    // Fetch the user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile for comment:', profileError);
      // Continue with a default profile rather than failing
    }

    const profile = profileData || { name: 'Unknown User', avatar_url: undefined };

    return {
      id: data.id,
      content: data.content,
      author: {
        id: userId,
        name: profile.name,
        avatarUrl: profile.avatar_url,
      },
      feedbackId: data.feedback_id,
      createdAt: new Date(data.created_at),
    };
  } catch (error) {
    console.error('Error in addComment:', error);
    throw error;
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteComment:', error);
    throw error;
  }
}
