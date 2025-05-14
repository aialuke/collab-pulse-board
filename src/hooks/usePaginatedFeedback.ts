
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
  
  // Load feedback with pagination - optimized version
  const loadFeedbackPage = useCallback(async (pageToLoad: number, reset: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Construct API URL with pagination and filtering
      let url = `/api/feedback?page=${pageToLoad}&limit=${pageSize}`;
      if (filterStatus && filterStatus !== 'all') {
        url += `&status=${filterStatus}`;
      }
      
      // Network request with retry logic and caching strategy
      const fetchData = async () => {
        if (!isOnline()) {
          // When offline, we'll use cached data from service worker
          const response = await fetch(url, {
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          return response.json();
        }
        
        // When online, use retry with backoff
        return retryWithBackoff(async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
          
          try {
            const response = await fetch(url, {
              headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Cache-Control': 'no-cache' // Prevent stale data issues
              },
              signal: controller.signal
            });
            
            if (!response.ok) {
              throw new Error(`API error: ${response.status}`);
            }
            
            return response.json();
          } finally {
            clearTimeout(timeoutId);
          }
        }, 3);
      };
      
      const data = await fetchData();
      
      if (reset) {
        setFeedback(data.items || []);
      } else {
        // Use a functional update to prevent race conditions
        setFeedback(prev => [...prev, ...(data.items || [])]);
      }
      
      // Update hasMore and total from API response
      setHasMore(data.hasMore || false);
      if (data.total !== undefined) {
        setTotal(data.total);
      }
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
  }, [pageSize, filterStatus, setFeedback, setIsLoading, setError, setHasMore, setTotal, toast]);
  
  // Load first page on mount or when filter changes
  useEffect(() => {
    // Add a small delay to prevent multiple requests when filters change rapidly
    const timeoutId = setTimeout(() => {
      reset();
      loadFeedbackPage(1, true);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [filterStatus]);
  
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
    loadFeedbackPage,
    refresh: () => loadFeedbackPage(1, true)
  };
}
