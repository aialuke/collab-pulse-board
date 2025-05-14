
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FeedbackType } from '@/types/feedback';
import { fetchFeedback } from '@/services/feedbackService';
import { useQuery } from '@tanstack/react-query';

export function useFeedbackData() {
  const [feedback, setFeedback] = useState<FeedbackType[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackType[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  // Properly typed React Query with a queryFn that matches expected signature
  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['feedback', retryCount],
    queryFn: async () => await fetchFeedback(), // Simplified queryFn that doesn't take parameters
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

  useEffect(() => {
    if (data) {
      // Make sure we handle data properly
      setFeedback(data.items || []);
      setFilteredFeedback(data.items || []);
      setLoadError(null);
    }
  }, [data]);

  const loadFeedback = useCallback(async () => {
    try {
      await refetch();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }, [refetch]);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return {
    feedback,
    setFeedback,
    filteredFeedback,
    setFilteredFeedback,
    isLoading,
    loadError,
    handleRetry,
    loadFeedback
  };
}
