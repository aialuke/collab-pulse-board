
import { supabase } from '@/integrations/supabase/client';
import { FeedbackType, CreateFeedbackInput } from '@/types/feedback';
import { handleApiError, withSuccessToast } from '../api/apiUtils';
import { createBaseFeedbackQuery, fetchProfiles, fetchUserUpvotes, fetchOriginalPosts } from '../api/feedbackClient';
import { mapFeedbackItem, mapFeedbackItems } from './mappers';
import { FeedbackResponse } from '@/types/supabase';

// Define the interface for the function parameters
interface FetchFeedbackParams {
  page?: number;
  limit?: number;
}

interface FetchFeedbackResult {
  items: FeedbackType[];
  hasMore: boolean;
  total: number;
}

/**
 * Fetch all feedback items with pagination
 */
export async function fetchFeedback({
  page = 1, 
  limit = 10
}: FetchFeedbackParams = {}): Promise<FetchFeedbackResult> {
  return handleApiError(async () => {
    // Select only essential columns to improve query performance
    const columns = 'id, title, content, user_id, category_id, created_at, updated_at, upvotes_count, image_url, link_url, is_repost, original_post_id, comments_count, repost_comment';
    
    // Get the current user ID once for efficient upvote checking
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Use Range header instead of count query for better performance
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Initialize query and execute
    const { data: feedbackData, error: feedbackError, count } = await supabase
      .from('feedback')
      .select(`
        ${columns},
        categories(name, id)
      `, { count: 'estimated' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (feedbackError) {
      throw feedbackError;
    }

    if (!feedbackData || feedbackData.length === 0) {
      return { items: [], hasMore: false, total: count || 0 };
    }

    // Collect unique user IDs to batch fetch profiles
    const userIds = feedbackData
      .filter(item => item && typeof item.user_id === 'string')
      .map(item => item.user_id);
    
    // Create a unique set of user IDs to avoid duplicate queries
    const uniqueUserIds = [...new Set(userIds)];

    // Parallel fetch for profiles and user upvotes to reduce latency
    const [profilesMap, userUpvotes] = await Promise.all([
      fetchProfiles(uniqueUserIds), 
      fetchUserUpvotes(userId)
    ]);

    // Attach profiles to feedback items
    const feedbackWithProfiles = feedbackData
      .filter(item => item !== null && typeof item === 'object')
      .map(item => ({
        ...item,
        profiles: profilesMap[item.user_id],
        // Use default values for missing properties
        updated_at: item.updated_at || item.created_at,
        comments_count: item.comments_count || 0,
        is_repost: Boolean(item.is_repost),
        original_post_id: item.original_post_id || null,
        repost_comment: item.repost_comment || null
      })) as FeedbackResponse[];

    // Identify and fetch original posts for reposts in a single batch
    const repostItems = feedbackWithProfiles.filter(item => 
      item.is_repost && item.original_post_id
    );
    
    let originalPostsMap = {};
    
    if (repostItems.length > 0) {
      const originalPostIds = [...new Set(
        repostItems
          .map(item => item.original_post_id)
          .filter(Boolean) as string[]
      )];
      
      originalPostsMap = await fetchOriginalPosts(
        originalPostIds,
        profilesMap,
        userUpvotes
      );
    }

    // Map to frontend models with optimized processing
    const mappedItems = mapFeedbackItems(feedbackWithProfiles, userUpvotes, originalPostsMap);
    
    // Determine if there are more items using the count
    const hasMore = count ? from + feedbackData.length < count : false;
    
    return {
      items: mappedItems,
      hasMore,
      total: count || 0
    };
  }, "Failed to fetch feedback");
}

/**
 * Fetch a single feedback item by ID
 */
export async function fetchFeedbackById(id: string): Promise<FeedbackType> {
  return handleApiError(async () => {
    // Get the current user ID once for efficient upvote checking
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    // Parallel fetch for the feedback item and user upvotes
    const [feedbackResponse, userUpvotes] = await Promise.all([
      supabase
        .from('feedback')
        .select(`
          id, title, content, user_id, category_id, created_at, updated_at, 
          upvotes_count, image_url, link_url, is_repost, 
          original_post_id, comments_count, repost_comment,
          categories(name, id)
        `)
        .eq('id', id)
        .maybeSingle(),
      fetchUserUpvotes(userId)
    ]);
    
    const { data: feedbackData, error: feedbackError } = feedbackResponse;

    if (feedbackError) {
      throw feedbackError;
    }

    if (!feedbackData) {
      throw new Error('Feedback not found');
    }

    // Fetch profile for the feedback author
    const profilesMap = await fetchProfiles([feedbackData.user_id]);
    
    // Add profile to feedback
    const feedbackWithProfile = {
      ...feedbackData,
      profiles: profilesMap[feedbackData.user_id],
      // Ensure required properties have default values if missing
      updated_at: feedbackData.updated_at || feedbackData.created_at,
      comments_count: feedbackData.comments_count || 0,
      is_repost: Boolean(feedbackData.is_repost),
      original_post_id: feedbackData.original_post_id || null,
      repost_comment: feedbackData.repost_comment || null
    } as FeedbackResponse;
    
    // Map the feedback item
    const feedbackItem = mapFeedbackItem(feedbackWithProfile, !!userUpvotes[feedbackData.id]);

    // If it's a repost, fetch the original post
    if (feedbackItem.isRepost && feedbackItem.originalPostId) {
      const originalPostsMap = await fetchOriginalPosts(
        [feedbackItem.originalPostId],
        profilesMap,
        userUpvotes
      );
      
      if (originalPostsMap[feedbackItem.originalPostId]) {
        feedbackItem.originalPost = mapFeedbackItem(
          originalPostsMap[feedbackItem.originalPostId],
          !!userUpvotes[feedbackItem.originalPostId]
        );
      }
    }

    return feedbackItem;
  }, "Failed to fetch feedback details");
}

/**
 * Create a new feedback item
 */
export async function createFeedback(input: CreateFeedbackInput): Promise<FeedbackType> {
  return withSuccessToast(
    handleApiError(async () => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) {
        throw new Error("You must be logged in to create feedback");
      }
      
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          title: null, // Set title to null
          content: input.content,
          category_id: input.categoryId,
          image_url: input.imageUrl,
          link_url: input.linkUrl,
          user_id: userId,
        })
        .select()
        .single();

      if (error) {
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
    }, "Failed to create feedback"),
    "Feedback created successfully"
  );
}

/**
 * Delete a feedback item by ID
 */
export async function deleteFeedback(id: string): Promise<void> {
  return withSuccessToast(
    handleApiError(async () => {
      // Check if the feedback exists before attempting to delete
      const { data: feedbackExists, error: checkError } = await supabaseDb
        .from('feedback')
        .select('id')
        .eq('id', id)
        .single();
      
      if (checkError || !feedbackExists) {
        throw new Error('Feedback not found or already deleted');
      }
      
      // Delete related upvotes first to maintain data integrity
      const { error: upvotesError } = await supabaseDb
        .from('upvotes')
        .delete()
        .eq('feedback_id', id);
      
      if (upvotesError) {
        throw upvotesError;
      }
      
      // Now delete the actual feedback item
      const { error } = await supabaseDb
        .from('feedback')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
    }, "Failed to delete feedback"),
    "Feedback deleted successfully"
  );
}

/**
 * Toggle upvote on a feedback item
 */
export async function toggleFeedbackUpvote(feedbackId: string): Promise<boolean> {
  return handleApiError(async () => {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      throw new Error("You must be logged in to upvote feedback");
    }

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
        throw error;
      }
      return true;
    }
  }, "Failed to update upvote");
}

/**
 * Report feedback for review
 */
export async function reportFeedback(feedbackId: string): Promise<void> {
  return withSuccessToast(
    handleApiError(async () => {
      // For now, just log the report. In a real app, this would store the report in a database
      console.log(`Feedback ${feedbackId} reported`);
      // Could be implemented as a table in the future
      return Promise.resolve();
    }, "Failed to submit report"),
    "Report submitted. Our team will review it."
  );
}

/**
 * Create a repost of an existing feedback item
 */
export async function createRepost(originalPostId: string, comment: string): Promise<FeedbackType> {
  return withSuccessToast(
    handleApiError(async () => {
      // First, get the original post to copy its category
      const { data: originalPost, error: originalPostError } = await supabase
        .from('feedback')
        .select('*')
        .eq('id', originalPostId)
        .single();

      if (originalPostError) {
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
        })
        .select()
        .single();

      if (repostError) {
        throw repostError;
      }

      // Now fetch the category information
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('name, id')  // Make sure we select the id field
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
        categories: categoryData || { name: 'Uncategorized', id: repostData.category_id },
        profiles: profileData || { 
          id: user.id,
          name: 'Unknown User',
          avatar_url: null, 
          role: null
        }
      } as FeedbackResponse;

      return mapFeedbackItem(feedbackWithData);
    }, "Failed to create repost"),
    "Repost created successfully"
  );
}

/**
 * Upload a feedback image from data URL
 */
export async function uploadFeedbackImage(
  dataUrl: string, 
  outputFormat: 'jpeg' | 'webp' = 'webp'
): Promise<string> {
  return handleApiError(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Convert data URL to File object
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    
    const fileName = `feedback_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${outputFormat}`;
    const file = new File([blob], fileName, { type: `image/${outputFormat}` });
    
    // Use the FEEDBACK_IMAGES_BUCKET constant and uploadImage function from imageService
    const FEEDBACK_IMAGES_BUCKET = 'feedback-images';
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${fileName}`;

    // Use the consolidated storage client
    const { data, error } = await supabase.storage
      .from(FEEDBACK_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '31536000', // 1 year cache
        contentType: file.type,
        upsert: true
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(FEEDBACK_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  }, "Failed to upload image");
}
