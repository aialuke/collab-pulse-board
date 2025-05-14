
import { useCallback, useEffect } from 'react';
import { usePagination } from './usePagination';
import { FeedbackType } from '@/types/feedback';
import { useToast } from './use-toast';
import { isOnline, retryWithBackoff } from '@/services/offlineService';

interface UsePaginatedFeedbackOptions {
  pageSize?: number;
  filterStatus?: string;
}

export function usePaginatedFeedback({
  pageSize = 10,
  filterStatus
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
    reset
  } = usePagination<FeedbackType>({ pageSize });

  // Listen for cache updates from the service worker
  useEffect(() => {
    const channel = new BroadcastChannel('api-updates');
    channel.addEventListener('message', (event) => {
      if (event.data.type === 'CACHE_UPDATED' && event.data.url === 'feed') {
        // Refresh data if cache was updated
        loadFeedbackPage(1, true);
      }
    });
    
    return () => channel.close();
  }, []);
  
  // Load feedback with pagination
  const loadFeedbackPage = useCallback(async (pageToLoad: number, reset: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Construct API URL with pagination and filtering
      let url = `/api/feedback?page=${pageToLoad}&limit=${pageSize}`;
      if (filterStatus && filterStatus !== 'all') {
        url += `&status=${filterStatus}`;
      }
      
      // Network request with retry logic
      const fetchData = async () => {
        if (!isOnline()) {
          // When offline, we'll use cached data from service worker
          const response = await fetch(url);
          return response.json();
        }
        
        // When online, use retry with backoff
        return retryWithBackoff(async () => {
          const response = await fetch(url, {
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          return response.json();
        }, 3);
      };
      
      const data = await fetchData();
      
      if (reset) {
        setFeedback(data.items || []);
      } else {
        setFeedback(prev => [...prev, ...(data.items || [])]);
      }
      
      setHasMore(data.hasMore || false);
    } catch (error) {
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
  }, [pageSize, filterStatus, setFeedback, setIsLoading, setError, setHasMore, toast]);
  
  // Load first page on mount or when filter changes
  useEffect(() => {
    reset();
    loadFeedbackPage(1, true);
  }, [filterStatus]);
  
  // Load next page when page changes
  useEffect(() => {
    if (page > 1) {
      loadFeedbackPage(page);
    }
  }, [page]);
  
  return {
    feedback,
    isLoading,
    error,
    hasMore,
    sentinelRef,
    loadFeedbackPage,
    refresh: () => loadFeedbackPage(1, true)
  };
}
