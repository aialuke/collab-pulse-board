
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
    queryFn: async () => {
      console.log("Fetching feedback data");
      const result = await fetchFeedback();
      console.log("Fetch result:", result);
      return result;
    },
    meta: {
      onError: (error: Error) => {
        console.error("Query error:", error);
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
      console.log("Setting data from query result:", data);
      // Make sure we handle data properly
      setFeedback(data.items || []);
      setFilteredFeedback(data.items || []);
      setLoadError(null);
    }
  }, [data]);

  const loadFeedback = useCallback(async () => {
    try {
      console.log("Manually triggering refetch");
      await refetch();
      return Promise.resolve();
    } catch (error) {
      console.error("Refetch error:", error);
      return Promise.reject(error);
    }
  }, [refetch]);

  const handleRetry = useCallback(() => {
    console.log("Retry triggered, incrementing count");
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
