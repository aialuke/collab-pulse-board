import { useQuery, useQueryClient, QueryOptions } from '@tanstack/react-query';
import { FeedbackType } from '@/types/feedback';
import { fetchFeedback, fetchFeedbackById } from '@/services/feedback/optimizedFeedbackService';
import { useToast } from '@/hooks/use-toast';

interface FeedbackQueryOptions {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

/**
 * Hook to fetch paginated feedback with React Query
 * Enhanced with improved caching configuration
 */
export function useFeedbackQuery({
  page = 1,
  limit = 10,
  category = '',
  status = '',
  search = '',
  enabled = true,
  staleTime = 60 * 1000, // 1 minute by default
  gcTime = 5 * 60 * 1000   // 5 minutes by default
}: FeedbackQueryOptions = {}) {
  const { toast } = useToast();
  
  // More precise query key with all parameters that affect the result
  const queryKey = ['feedback', { page, limit, category, status, search }];
  
  return useQuery({
    queryKey,
    queryFn: () => fetchFeedback({ page, limit, category, status, search }),
    staleTime,
    gcTime,
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
 * Enhanced with improved caching configuration
 */
export function useFeedbackItemQuery(
  id: string | undefined, 
  { 
    enabled = true, 
    staleTime = 60 * 1000,
    gcTime = 5 * 60 * 1000 
  } = {}
) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['feedback', 'item', id],
    queryFn: () => id ? fetchFeedbackById(id) : Promise.reject('No ID provided'),
    enabled: !!id && enabled,
    staleTime,
    gcTime,
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
      queryKey: ['feedback', 'item', id],
      queryFn: () => fetchFeedbackById(id),
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
    });
  };
}

/**
 * Hook to invalidate feedback queries
 * Enhanced with more specific invalidation targets
 */
export function useInvalidateFeedbackQueries() {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => 
      queryClient.invalidateQueries({ queryKey: ['feedback'] }),
      
    invalidateList: (filters?: {
      category?: string;
      status?: string;
      search?: string;
    }) => {
      if (filters) {
        // Invalidate specific filtered queries
        queryClient.invalidateQueries({
          queryKey: ['feedback', { ...filters }],
          exact: false
        });
      } else {
        // Invalidate all list queries but keep details
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey;
            return Array.isArray(queryKey) && 
                   queryKey[0] === 'feedback' && 
                   queryKey[1] !== 'item';
          }
        });
      }
    },
    
    invalidateItem: (id: string) => 
      queryClient.invalidateQueries({ queryKey: ['feedback', 'item', id] }),
  };
}
