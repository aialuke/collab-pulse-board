
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
    queryFn: () => fetchFeedback(1, pageSize),
    meta: {
      onSuccess: (data) => {
        if (data) {
          setFeedback(data.items || []);
          setHasMore(data.hasMore || false);
          if (data.total !== undefined) {
            setTotal(data.total);
          }
        }
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
      channel = new BroadcastChannel('api-updates');
      channel.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_UPDATED' && event.data.url === 'feed') {
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
      setLoadingMore(true);
      setPaginationError(null);
      
      const result = await fetchFeedback(pageToLoad, pageSize);
      
      // Use a functional update to prevent race conditions
      setFeedback(prev => [...prev, ...(result.items || [])]);
      
      // Update hasMore and total from API response
      setHasMore(result.hasMore || false);
      if (result.total !== undefined) {
        setTotal(result.total);
      }
    } catch (error: any) {
      console.error('Error loading feedback:', error);
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
      loadFeedbackPage(page);
    }
  }, [page, loadFeedbackPage]);
  
  return {
    feedback,
    isLoading,
    error: error ? String(error) : null,
    hasMore,
    sentinelRef,
    refresh: () => refetch()
  };
}
