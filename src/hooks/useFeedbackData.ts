
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

export function useFeedbackData(): UseFeedbackDataResult {
  const [feedback, setFeedback] = useState<FeedbackType[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackType[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  // Memoize query key to prevent unnecessary refetches
  const queryKey = useMemo(() => ['feedback', retryCount], [retryCount]);

  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await fetchFeedback();
      } catch (error) {
        console.error('Error loading feedback:', error);
        throw error; // Let React Query handle the error
      }
    },
    meta: {
      onError: (error: Error) => {
        // This will run when the query encounters an error
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
      // Extract the items array from the response
      setFeedback(data.items);
      setFilteredFeedback(data.items);
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
