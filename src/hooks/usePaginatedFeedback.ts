
import { useCallback, useEffect } from 'react';
import { usePagination } from './usePagination';
import { FeedbackType } from '@/types/feedback';
import { useToast } from './use-toast';
import { fetchFeedback } from '@/services/feedbackService';
import { useQuery } from '@tanstack/react-query';

interface UsePaginatedFeedbackOptions {
  pageSize?: number;
}

export function usePaginatedFeedback({
  pageSize = 10
}: UsePaginatedFeedbackOptions = {}) {
  const { toast } = useToast();
  
  const {
    page,
    items: feedback,
    setItems: setFeedback,
    isLoading: loadingMore,
    setIsLoading: setLoadingMore,
    hasMore,
    setHasMore,
    error: paginationError,
    setError: setPaginationError,
    sentinelRef,
    reset,
    setTotal
  } = usePagination<FeedbackType>({ pageSize });
  
  // Use React Query for the initial data fetch for better caching and state management
  const {
    data,
    isLoading: initialLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['feedback', 1, pageSize],
    queryFn: async () => {
      console.log("Fetching initial feedback data with page 1 and pageSize", pageSize);
      const result = await fetchFeedback(1, pageSize);
      console.log("Initial fetch result:", result);
      return result;
    },
    meta: {
      onSuccess: (data) => {
        console.log("Success fetching initial data:", data);
        if (data) {
          setFeedback(data.items || []);
          setHasMore(data.hasMore || false);
          if (data.total !== undefined) {
            setTotal(data.total);
          }
        }
      },
      onError: (error: Error) => {
        console.error("Error fetching initial data:", error);
        toast({
          title: 'Error',
          description: 'Failed to load feedback. Please try again.',
          variant: 'destructive',
        });
      }
    }
  });
  
  const isLoading = initialLoading || loadingMore;
  const error = queryError || paginationError;

  // Listen for cache updates from the service worker
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    
    // Only create BroadcastChannel if it's supported by the browser
    if ('BroadcastChannel' in window) {
      console.log("Setting up BroadcastChannel for cache updates");
      channel = new BroadcastChannel('api-updates');
      channel.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_UPDATED' && event.data.url === 'feed') {
          console.log("Cache updated notification received, refreshing data");
          // Refresh data if cache was updated
          refetch();
        }
      });
    }
    
    return () => {
      if (channel) channel.close();
    };
  }, [refetch]);
  
  // Load additional pages when needed
  const loadFeedbackPage = useCallback(async (pageToLoad: number) => {
    if (pageToLoad === 1) return; // First page is handled by React Query
    
    try {
      console.log(`Loading additional page ${pageToLoad}`);
      setLoadingMore(true);
      setPaginationError(null);
      
      const result = await fetchFeedback(pageToLoad, pageSize);
      console.log(`Page ${pageToLoad} result:`, result);
      
      // Use a functional update to prevent race conditions
      setFeedback(prev => [...prev, ...(result.items || [])]);
      
      // Update hasMore and total from API response
      setHasMore(result.hasMore || false);
      if (result.total !== undefined) {
        setTotal(result.total);
      }
    } catch (error: any) {
      console.error(`Error loading page ${pageToLoad}:`, error);
      setPaginationError('Failed to load feedback. Please try again.');
      
      toast({
        title: 'Error',
        description: 'Failed to load feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingMore(false);
    }
  }, [pageSize, setFeedback, setLoadingMore, setPaginationError, setHasMore, setTotal, toast]);
  
  // Load next page when page changes
  useEffect(() => {
    if (page > 1) {
      console.log(`Page changed to ${page}, loading additional data`);
      loadFeedbackPage(page);
    }
  }, [page, loadFeedbackPage]);
  
  // Modified refresh function to return Promise<void> instead of the refetch result
  const refresh = useCallback(async (): Promise<void> => {
    try {
      console.log("Refreshing feedback data");
      await refetch();
      return Promise.resolve();
    } catch (error) {
      console.error("Error refreshing feedback:", error);
      return Promise.resolve(); // Still resolve to void
    }
  }, [refetch]);
  
  return {
    feedback,
    isLoading,
    error: error ? String(error) : null,
    hasMore,
    sentinelRef,
    refresh
  };
}
