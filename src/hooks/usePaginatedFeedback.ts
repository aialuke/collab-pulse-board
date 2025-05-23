
import { useCallback, useEffect, useRef, useMemo } from 'react';
import { usePagination } from './usePagination';
import { FeedbackType } from '@/types/feedback';
import { useToast } from './use-toast';
import { fetchFeedback } from '@/services/feedback/optimizedFeedbackService'; 
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface UsePaginatedFeedbackOptions {
  pageSize?: number;
  initialData?: FeedbackType[];
  staleTime?: number;
  gcTime?: number;
  category?: string;
  status?: string;
  search?: string;
}

interface UsePaginatedFeedbackResult {
  feedback: FeedbackType[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  sentinelRef: (node: HTMLElement | null) => void;
  refresh: () => Promise<void>;
  total: number;
}

/**
 * Enhanced hook for paginated feedback with performance optimizations
 * Uses the consolidated fetchFeedback implementation
 */
export function usePaginatedFeedback({
  pageSize = 10,
  initialData,
  staleTime = 60 * 1000, // 1 minute default stale time
  gcTime = 5 * 60 * 1000,  // 5 minutes default cache time
  category = '',
  status = '',
  search = ''
}: UsePaginatedFeedbackOptions = {}): UsePaginatedFeedbackResult {
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

  // Create a memoized query key that includes all dependencies for proper cache management
  const queryKey = useMemo(() => 
    ['feedback', { page, pageSize, category, status, search }], 
    [page, pageSize, category, status, search]
  );

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
        
        // Call consolidated fetchFeedback with all parameters
        return await fetchFeedback({
          page,
          limit: pageSize,
          category,
          status,
          search
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
    gcTime,    // Use configurable cache time
    refetchOnWindowFocus: false,
    // Only fetch if we have a valid page
    enabled: page > 0,
    // Initialize with previous data if available
    initialData: useMemo(() => {
      if (page === 1 && initialData) {
        return {
          items: initialData,
          hasMore: true,
          total: initialData.length
        };
      }
      return undefined;
    }, [page, initialData]),
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
  
  // Optimized reload function that uses queryClient
  const refresh = useCallback(async () => {
    reset(); // Reset pagination state
    return queryClient.invalidateQueries({ queryKey: ['feedback'] });
  }, [reset, queryClient]);
  
  // Memoize the return value
  return useMemo(() => ({
    feedback,
    isLoading,
    error,
    hasMore,
    sentinelRef,
    refresh,
    total: data?.total || 0
  }), [
    feedback, 
    isLoading, 
    error, 
    hasMore, 
    sentinelRef, 
    refresh, 
    data?.total
  ]);
}
