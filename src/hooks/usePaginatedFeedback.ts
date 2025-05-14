
import { useCallback, useEffect } from 'react';
import { usePagination } from './usePagination';
import { FeedbackType } from '@/types/feedback';
import { useToast } from './use-toast';
import { isOnline } from '@/services/offlineService';
import { fetchFeedback } from '@/services/feedback/readFeedbackService';

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
      
      // Calculate start index for pagination
      const startIndex = (pageToLoad - 1) * pageSize;
      
      // Use fetchFeedback from Supabase integration instead of REST API
      const fetchData = async () => {
        try {
          if (!isOnline()) {
            toast({
              title: 'Offline Mode',
              description: 'Loading cached feedback. Some content may not be up-to-date.',
              variant: 'default',
            });
          }
          
          // Use the fetchFeedback function with proper filtering
          const fetchedFeedback = await fetchFeedback(filterStatus);
          
          // Apply pagination manually since we're getting all results
          const paginatedFeedback = fetchedFeedback.slice(startIndex, startIndex + pageSize);
          
          // Check if there are more items
          const hasMoreItems = startIndex + pageSize < fetchedFeedback.length;
          
          return {
            items: paginatedFeedback,
            hasMore: hasMoreItems
          };
        } catch (error) {
          console.error('Error in fetchData:', error);
          throw error;
        }
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
  }, [filterStatus, reset]);
  
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
