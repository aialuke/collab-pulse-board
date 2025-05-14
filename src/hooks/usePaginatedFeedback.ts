
import { useCallback, useEffect } from 'react';
import { usePagination } from './usePagination';
import { FeedbackType } from '@/types/feedback';
import { useToast } from './use-toast';
import { isOnline, retryWithBackoff } from '@/services/offlineService';
import { fetchFeedback } from '@/services/feedbackService';

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
    isLoading,
    setIsLoading,
    hasMore,
    setHasMore,
    error,
    setError,
    sentinelRef,
    reset,
    setTotal
  } = usePagination<FeedbackType>({ pageSize });

  // Listen for cache updates from the service worker
  useEffect(() => {
    const channel = new BroadcastChannel('api-updates');
    channel.addEventListener('message', (event) => {
      if (event.data.type === 'CACHE_UPDATED' && event.data.url === 'feed') {
        // Refresh data if cache was updated, but use a debounce to avoid multiple refreshes
        const timeoutId = setTimeout(() => {
          loadFeedbackPage(1, true);
        }, 300);
        
        return () => clearTimeout(timeoutId);
      }
    });
    
    return () => channel.close();
  }, []);
  
  // Load feedback with pagination - simplified version without filtering
  const loadFeedbackPage = useCallback(async (pageToLoad: number, reset: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the fetchFeedback service directly with only pagination parameters
      const result = await fetchFeedback(pageToLoad, pageSize);
      
      if (reset) {
        setFeedback(result.items || []);
      } else {
        // Use a functional update to prevent race conditions
        setFeedback(prev => [...prev, ...(result.items || [])]);
      }
      
      // Update hasMore and total from API response
      setHasMore(result.hasMore || false);
      if (result.total !== undefined) {
        setTotal(result.total);
      }
    } catch (error: any) {
      console.error('Error loading feedback:', error);
      setError('Failed to load feedback. Please try again.');
      
      toast({
        title: 'Error',
        description: 'Failed to load feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, setFeedback, setIsLoading, setError, setHasMore, setTotal, toast]);
  
  // Load first page on mount
  useEffect(() => {
    // Add a small delay to prevent multiple requests
    const timeoutId = setTimeout(() => {
      reset();
      loadFeedbackPage(1, true);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [reset]);
  
  // Load next page when page changes
  useEffect(() => {
    if (page > 1) {
      loadFeedbackPage(page);
    }
  }, [page, loadFeedbackPage]);
  
  return {
    feedback,
    isLoading,
    error,
    hasMore,
    sentinelRef,
    refresh: () => loadFeedbackPage(1, true)
  };
}
