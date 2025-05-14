
import { useState, useEffect } from 'react';
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

  const { 
    data, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['feedback', retryCount],
    queryFn: async () => {
      try {
        return await fetchFeedback();
      } catch (error) {
        console.error('Error loading feedback:', error);
        setLoadError('Failed to load feedback. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load feedback. Please try again.',
          variant: 'destructive',
        });
        throw error;
      }
    },
  });

  useEffect(() => {
    if (data) {
      setFeedback(data);
      setFilteredFeedback(data);
      setLoadError(null);
    }
  }, [data]);

  const loadFeedback = async () => {
    try {
      await refetch();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

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
