
import { useCallback, useEffect, useState } from 'react';
import { usePagination } from './usePagination';
import { FeedbackType } from '@/types/feedback';
import { useToast } from './use-toast';
import { fetchFeedback } from '@/services/feedbackService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

interface UsePaginatedFeedbackOptions {
  pageSize?: number;
}

export function usePaginatedFeedback({
  pageSize = 10
}: UsePaginatedFeedbackOptions = {}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  // Set isReady when auth state is determined
  useEffect(() => {
    if (typeof isAuthenticated !== 'undefined') {
      console.log('usePaginatedFeedback: Auth state determined', { isAuthenticated, userId: user?.id });
      setIsReady(true);
    }
  }, [isAuthenticated, user]);
  
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
  
  // Use React Query for the initial data fetch with auth state as dependency
  const {
    data,
    isLoading: initialLoading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ['feedback', 1, pageSize, isAuthenticated, user?.id],
    queryFn: async () => {
      console.log(`usePaginatedFeedback: Fetching initial feedback data with page 1 and pageSize ${pageSize}, auth:`, 
        { isAuthenticated, userId: user?.id });
      
      if (!isAuthenticated) {
        console.log('usePaginatedFeedback: Not authenticated, skipping fetch');
        return { items: [], hasMore: false, total: 0 };
      }
      
      try {
        const result = await fetchFeedback(1, pageSize);
        console.log(`usePaginatedFeedback: Initial fetch returned ${result.items?.length || 0} items, hasMore: ${result.hasMore}, total: ${result.total}`);
        return result;
      } catch (error) {
        console.error("usePaginatedFeedback: Error fetching initial data:", error);
        throw error;
      }
    },
    meta: {
      onSuccess: (data) => {
        console.log(`usePaginatedFeedback: Success fetching initial data, items count: ${data?.items?.length || 0}`);
        if (data) {
          setFeedback(data.items || []);
          setHasMore(data.hasMore || false);
          if (data.total !== undefined) {
            setTotal(data.total);
          }
        }
      },
      onError: (error: Error) => {
        console.error("usePaginatedFeedback: Error in query:", error);
        toast({
          title: 'Error',
          description: 'Failed to load feedback. Please try again.',
          variant: 'destructive',
        });
      }
    },
    // Only enable query when auth is ready
    enabled: isReady,
    // Only retry once for better UX
    retry: 1,
    // Keep cached data for 1 minute
    staleTime: 60000
  });
  
  const isLoading = initialLoading || loadingMore;
  const error = queryError || paginationError;

  // Listen for cache updates from the service worker
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    
    // Only create BroadcastChannel if it's supported by the browser
    if ('BroadcastChannel' in window) {
      console.log("usePaginatedFeedback: Setting up BroadcastChannel for cache updates");
      channel = new BroadcastChannel('api-updates');
      channel.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_UPDATED' && event.data.url === 'feed') {
          console.log("usePaginatedFeedback: Cache updated notification received, refreshing data");
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
    if (!isAuthenticated) {
      console.log('usePaginatedFeedback: Not authenticated, skipping additional page fetch');
      return;
    }
    
    try {
      console.log(`usePaginatedFeedback: Loading additional page ${pageToLoad}`);
      setLoadingMore(true);
      setPaginationError(null);
      
      const result = await fetchFeedback(pageToLoad, pageSize);
      console.log(`usePaginatedFeedback: Page ${pageToLoad} returned ${result.items.length} items, hasMore: ${result.hasMore}`);
      
      // Use a functional update to prevent race conditions
      setFeedback(prev => {
        // Filter out any duplicates based on ID
        const existingIds = new Set(prev.map(item => item.id));
        const newItems = result.items.filter(item => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
      
      // Update hasMore and total from API response
      setHasMore(result.hasMore || false);
      if (result.total !== undefined) {
        setTotal(result.total);
      }
      
      // Update the query cache with the new data
      queryClient.setQueryData(['feedback', pageToLoad, pageSize, isAuthenticated, user?.id], result);
      
    } catch (error: any) {
      console.error(`usePaginatedFeedback: Error loading page ${pageToLoad}:`, error);
      setPaginationError('Failed to load feedback. Please try again.');
      
      toast({
        title: 'Error',
        description: 'Failed to load additional feedback items. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingMore(false);
    }
  }, [pageSize, setFeedback, setLoadingMore, setPaginationError, setHasMore, setTotal, toast, queryClient, isAuthenticated, user?.id]);
  
  // Load next page when page changes
  useEffect(() => {
    if (page > 1 && isAuthenticated) {
      console.log(`usePaginatedFeedback: Page changed to ${page}, loading additional data`);
      loadFeedbackPage(page);
    }
  }, [page, loadFeedbackPage, isAuthenticated]);
  
  // Clean up function that invalidates queries when component unmounts
  useEffect(() => {
    return () => {
      console.log("usePaginatedFeedback: Cleaning up queries on unmount");
    };
  }, []);
  
  // Modified refresh function to return Promise<void> instead of the refetch result
  const refresh = useCallback(async (): Promise<void> => {
    console.log("usePaginatedFeedback: Refreshing feedback data");
    try {
      reset(); // Reset pagination state
      await refetch();
      return Promise.resolve();
    } catch (error) {
      console.error("usePaginatedFeedback: Error refreshing feedback:", error);
      return Promise.resolve(); // Still resolve to void
    }
  }, [refetch, reset]);
  
  return {
    feedback,
    isLoading,
    error: error ? String(error) : null,
    hasMore,
    sentinelRef,
    refresh
  };
}
