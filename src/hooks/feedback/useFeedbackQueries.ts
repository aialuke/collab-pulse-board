
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FeedbackType } from '@/types/feedback';
import { fetchFeedback, fetchFeedbackById } from '@/services/feedbackService';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to fetch paginated feedback with React Query
 */
export function useFeedbackQuery({
  page = 1,
  limit = 10,
  enabled = true,
  staleTime = 60 * 1000 // 1 minute
}: {
  page?: number;
  limit?: number;
  enabled?: boolean;
  staleTime?: number;
} = {}) {
  return useQuery({
    queryKey: ['feedback', { page, limit }],
    queryFn: () => fetchFeedback({ page, limit }),
    staleTime,
    enabled,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: 'Failed to load feedback. Please try again.',
          variant: 'destructive',
        });
      }
    }
  });
}

/**
 * Hook to fetch a single feedback item by ID
 */
export function useFeedbackItemQuery(
  id: string | undefined, 
  { enabled = true, staleTime = 60 * 1000 } = {}
) {
  return useQuery({
    queryKey: ['feedback', id],
    queryFn: () => id ? fetchFeedbackById(id) : Promise.reject('No ID provided'),
    enabled: !!id && enabled,
    staleTime,
    meta: {
      onError: (error: Error) => {
        toast({
          title: 'Error',
          description: 'Failed to load feedback details. Please try again.',
          variant: 'destructive',
        });
      }
    }
  });
}

/**
 * Hook to prefetch a feedback item
 * Useful for improving perceived performance when navigating to detail pages
 */
export function usePrefetchFeedbackItem() {
  const queryClient = useQueryClient();
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ['feedback', id],
      queryFn: () => fetchFeedbackById(id),
      staleTime: 10 * 1000, // 10 seconds
    });
  };
}

/**
 * Hook to invalidate feedback queries
 * Useful after mutations to ensure data is fresh
 */
export function useInvalidateFeedbackQueries() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: ['feedback'] }),
    invalidatePage: (page: number, limit: number = 10) => 
      queryClient.invalidateQueries({ queryKey: ['feedback', { page, limit }] }),
    invalidateItem: (id: string) => 
      queryClient.invalidateQueries({ queryKey: ['feedback', id] })
  };
}
