
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateFeedbackInput, FeedbackType } from '@/types/feedback';
import { 
  createFeedback, 
  uploadFeedbackImage, 
  deleteFeedback,
  toggleUpvote, 
  reportFeedback, 
  createRepost 
} from '@/services/feedbackService';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to handle creating feedback with optimistic updates
 */
export function useCreateFeedbackMutation(options: {
  onSuccess?: (data: FeedbackType) => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateFeedbackInput) => {
      // Handle image upload first if there is an image
      let imageUrl: string | undefined = undefined;
      
      if (input.imageUrl && input.imageUrl.startsWith('data:')) {
        // Get the format from the data URL
        const formatInfo = input.imageUrl.split(';')[0].split(':')[1];
        const outputFormat = formatInfo === 'image/webp' ? 'webp' : 'jpeg';
        
        // Upload the image using our service
        imageUrl = await uploadFeedbackImage(input.imageUrl, outputFormat);
      } else if (input.imageUrl) {
        // If it's already a URL (not base64), use it directly
        imageUrl = input.imageUrl;
      }

      // Create feedback with the image URL if present
      return createFeedback({
        ...input,
        imageUrl
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'Your feedback has been successfully submitted.',
      });
      
      // Invalidate feedback queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'There was a problem submitting your feedback. Please try again.',
        variant: 'destructive',
      });
      
      if (options.onError) {
        options.onError(error);
      }
    },
  });
}

/**
 * Hook to handle upvoting feedback
 */
export function useUpvoteFeedbackMutation() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (feedbackId: string) => toggleUpvote(feedbackId),
    onMutate: async (feedbackId) => {
      if (!isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "Please log in to upvote feedback.",
          variant: "destructive",
        });
        throw new Error("Authentication required");
      }
      
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['feedback'] });
      
      // Apply optimistic update to all feedback queries
      // This is intentionally complex to update both list and individual item queries
      queryClient.setQueriesData(
        { queryKey: ['feedback'], exact: false },
        (oldData: any) => {
          // Handle the case where this is a feedback list
          if (oldData && 'items' in oldData) {
            return {
              ...oldData,
              items: oldData.items.map((item: FeedbackType) =>
                item.id === feedbackId
                  ? { 
                      ...item, 
                      isUpvoted: true,
                      upvotes: !item.isUpvoted ? item.upvotes + 1 : item.upvotes 
                    }
                  : item
              )
            };
          }
          
          // Handle the case where this is a single feedback item
          if (oldData && 'id' in oldData && oldData.id === feedbackId) {
            return {
              ...oldData,
              isUpvoted: true,
              upvotes: !oldData.isUpvoted ? oldData.upvotes + 1 : oldData.upvotes
            };
          }
          
          return oldData;
        }
      );
    },
    onError: (error: any, feedbackId) => {
      console.error(`Error upvoting feedback ${feedbackId}:`, error);
      toast({
        title: "Error",
        description: error.message || "Failed to update upvote. Please try again.",
        variant: "destructive",
      });
      
      // If error, invalidate to refetch correct data
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}

/**
 * Hook to handle reporting feedback
 */
export function useReportFeedbackMutation() {
  return useMutation({
    mutationFn: (feedbackId: string) => reportFeedback(feedbackId),
    onSuccess: () => {
      toast({
        title: "Report submitted",
        description: "Thank you for your report. Our team will review it.",
      });
    },
    onError: (error) => {
      console.error(`Error reporting feedback:`, error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    }
  });
}

/**
 * Hook to handle deleting feedback
 */
export function useDeleteFeedbackMutation(options: {
  onSuccess?: () => void;
} = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (feedbackId: string) => deleteFeedback(feedbackId),
    onSuccess: () => {
      toast({
        title: "Feedback deleted",
        description: "Your feedback has been permanently deleted.",
      });
      
      // Invalidate queries to refresh lists after deletion
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      
      if (options.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error) => {
      console.error(`Error deleting feedback:`, error);
      toast({
        title: "Error",
        description: "Failed to delete feedback. Please try again.",
        variant: "destructive",
      });
    }
  });
}

/**
 * Hook to handle creating reposts
 */
export function useRepostFeedbackMutation(options: {
  onSuccess?: (data: FeedbackType) => void;
} = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ feedbackId, comment }: { feedbackId: string; comment: string }) => 
      createRepost(feedbackId, comment),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Feedback reposted successfully",
      });
      
      // Invalidate queries to refresh after repost
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error(`Error creating repost:`, error);
      toast({
        title: "Error",
        description: "Failed to repost feedback. Please try again.",
        variant: "destructive",
      });
    }
  });
}
