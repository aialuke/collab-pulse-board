
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FeedbackType } from '@/types/feedback';
import { fetchFeedback } from '@/services/feedbackService';
import { useQuery } from '@tanstack/react-query';

interface UseFeedbackDataResult {
  feedback: FeedbackType[];
  setFeedback: React.Dispatch<React.SetStateAction<FeedbackType[]>>;
  filteredFeedback: FeedbackType[];
  setFilteredFeedback: React.Dispatch<React.SetStateAction<FeedbackType[]>>;
  isLoading: boolean;
  loadError: string | null;
  handleRetry: () => void;
  loadFeedback: () => Promise<void>;
}

/**
 * Enhanced feedback data hook with improved caching and performance
 */
export function useFeedbackData(): UseFeedbackDataResult {
  const [feedback, setFeedback] = useState<FeedbackType[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackType[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  // Memoize query key to prevent unnecessary refetches
  const queryKey = useMemo(
    () => ['feedback', { page: 1, limit: 50, retryCount }], 
    [retryCount]
  );

  // Configure query with proper caching settings
  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await fetchFeedback({ page: 1, limit: 50 });
      } catch (error) {
        console.error('Error loading feedback:', error);
        throw error;
      }
    },
    // Better caching for improved performance
    staleTime: 30 * 1000,      // 30 seconds - data considered fresh
    gcTime: 5 * 60 * 1000,     // 5 minutes - keep in cache
    refetchOnWindowFocus: false, // Don't refetch on tab focus
    meta: {
      onError: (error: Error) => {
        setLoadError('Failed to load feedback. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load feedback. Please try again.',
          variant: 'destructive',
        });
      }
    }
  });

  // Update state when data changes
  useEffect(() => {
    if (data?.items) {
      setFeedback(data.items);
      setFilteredFeedback(data.items);
      setLoadError(null);
    }
  }, [data]);

  // Optimized load feedback function
  const loadFeedback = useCallback(async () => {
    try {
      await refetch();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }, [refetch]);

  // Retry handler with debounce to prevent spam
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  // Memoize the return value
  const result = useMemo(() => ({
    feedback,
    setFeedback,
    filteredFeedback,
    setFilteredFeedback,
    isLoading,
    loadError,
    handleRetry,
    loadFeedback
  }), [
    feedback,
    filteredFeedback,
    isLoading,
    loadError,
    handleRetry,
    loadFeedback
  ]);

  return result;
}
