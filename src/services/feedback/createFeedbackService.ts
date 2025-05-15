
import { supabase } from '@/integrations/supabase/client';
import { FeedbackType, CreateFeedbackInput } from '@/types/feedback';
import { extractCategoryName } from '@/services/feedback/mappers';

/**
 * Creates a new feedback item in the database
 */
export async function createFeedback(input: CreateFeedbackInput): Promise<FeedbackType> {
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      title: null, // Set title to null
      content: input.content,
      category_id: input.categoryId,
      image_url: input.imageUrl,
      link_url: input.linkUrl,
      user_id: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating feedback:', error);
    throw error;
  }

  // After insert, fetch the complete data with category info
  const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .select('name')
    .eq('id', data.category_id)
    .single();

  // Fetch profile data separately
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('name, avatar_url')
    .eq('id', data.user_id)
    .single();

  if (categoryError) {
    console.error('Error fetching category:', categoryError);
  }

  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }

  // Get category name safely
  const categoryName = categoryData ? categoryData.name : 'Uncategorized';
  
  // Get profile info safely
  const profileName = profileData?.name || 'Unknown User';
  const profileAvatarUrl = profileData?.avatar_url || undefined;

  return {
    id: data.id,
    title: data.title || undefined, // Handle title being null
    content: data.content,
    author: {
      id: data.user_id,
      name: profileName,
      avatarUrl: profileAvatarUrl,
    },
    category: categoryName,
    categoryId: data.category_id,
    createdAt: new Date(data.created_at),
    upvotes: data.upvotes_count,
    imageUrl: data.image_url || undefined,
    linkUrl: data.link_url || undefined,
    isUpvoted: false,
    image: data.image_url || undefined, // For backward compatibility
  };
}
