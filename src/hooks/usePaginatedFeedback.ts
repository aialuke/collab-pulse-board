
import { useCallback, useEffect, useRef } from 'react';
import { usePagination } from './usePagination';
import { FeedbackType } from '@/types/feedback';
import { useToast } from './use-toast';
import { fetchFeedback } from '@/services/feedbackService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface UsePaginatedFeedbackOptions {
  pageSize?: number;
  initialData?: FeedbackType[];
  staleTime?: number;
  filterBy?: {
    category?: number;
    status?: string;
  };
}

/**
 * Enhanced hook for paginated feedback with performance optimizations
 */
export function usePaginatedFeedback({
  pageSize = 10,
  initialData,
  staleTime = 60 * 1000, // 1 minute default stale time
  filterBy
}: UsePaginatedFeedbackOptions = {}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const loadingRef = useRef<boolean>(false);
  
  const {
    page,
    items: feedback,
    setItems: setFeedback,
    isLoading,
    setIsLoading,
    hasMore,
    setHasMore,
    error,
    setError,
    sentinelRef,
    reset,
    setTotal
  } = usePagination<FeedbackType>({ pageSize, initialData });

  // Create a query key that includes all dependencies for proper cache management
  const queryKey = ['feedback', page, pageSize, filterBy?.category, filterBy?.status];

  // Use React Query for efficient data fetching and caching
  const { 
    data, 
    isLoading: isQueryLoading, 
    error: queryError,
    refetch 
  } = useQuery({
    queryKey,
    queryFn: async () => {
      // Prevent duplicate loading states
      if (loadingRef.current) return null;
      loadingRef.current = true;
      
      try {
        // Only fetch page > 1 data if we have previous pages
        if (page > 1 && feedback.length === 0) {
          throw new Error('Cannot fetch additional pages without loading the first page');
        }
        
        // Call fetchFeedback with the updated parameter structure
        return await fetchFeedback({
          page,
          limit: pageSize,
          filters: filterBy
        });
      } catch (error) {
        console.error('Error loading feedback:', error);
        throw error;
      } finally {
        loadingRef.current = false;
      }
    },
    // Optimized configuration for better performance
    staleTime, // Use configurable stale time
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    // Only fetch if we have a valid page
    enabled: page > 0,
    // Initialize with previous data if available
    initialData: page === 1 && initialData ? {
      items: initialData,
      hasMore: true,
      total: initialData.length
    } : undefined,
    meta: {
      onError: (error: Error) => {
        setError('Failed to load feedback. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load feedback. Please try again.',
          variant: 'destructive',
        });
      }
    }
  });

  // Update local state when data changes
  useEffect(() => {
    if (data) {
      if (page === 1) {
        // Reset data on first page load
        setFeedback(data.items || []);
      } else {
        // Append data for subsequent pages
        setFeedback(prev => [...prev, ...(data.items || [])]);
      }
      setHasMore(data.hasMore || false);
      setTotal(data.total || 0);
      setError(null);
    }
  }, [data, page, setFeedback, setHasMore, setTotal, setError]);

  // Update loading state based on query
  useEffect(() => {
    setIsLoading(isQueryLoading);
  }, [isQueryLoading, setIsLoading]);

  // Update error state based on query
  useEffect(() => {
    if (queryError) {
      setError((queryError as Error).message || 'Failed to load feedback');
    }
  }, [queryError, setError]);

  // Listen for cache updates from the service worker
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    
    // Only create BroadcastChannel if it's supported by the browser
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel('api-updates');
      channel.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_UPDATED' && event.data.url === 'feed') {
          // Use queryClient to invalidate queries on cache update
          queryClient.invalidateQueries({ queryKey: ['feedback'] });
        }
      });
    }
    
    return () => {
      if (channel) channel.close();
    };
  }, [queryClient]);
  
  // Optimized reload function that uses queryClient
  const refresh = useCallback(async () => {
    reset(); // Reset pagination state
    return queryClient.invalidateQueries({ queryKey: ['feedback'] });
  }, [reset, queryClient]);
  
  return {
    feedback,
    isLoading,
    error,
    hasMore,
    sentinelRef,
    refresh,
    // Add total for displaying counts
    total: data?.total || 0
  };
}
