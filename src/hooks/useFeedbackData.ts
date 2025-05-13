
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { FeedbackType } from '@/types/feedback';
import { fetchFeedback } from '@/services/feedbackService';
import { useQuery } from '@tanstack/react-query';

export function useFeedbackData() {
  const [feedback, setFeedback] = useState<FeedbackType[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackType[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();

  // Enhanced React Query configuration with optimal cache settings
  const { 
    data, 
    isLoading, 
    refetch,
    isFetching
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
    staleTime: 3 * 60 * 1000, // 3 minutes - data is considered fresh for 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - keep unused data in cache for 10 minutes
    refetchOnWindowFocus: true, // Refresh data when window gains focus
    refetchOnMount: true, // Refresh data when component mounts
    refetchOnReconnect: true, // Refresh when network reconnects
    retry: 2, // Retry failed requests twice
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
    isFetching, // Expose fetching state for UI refresh indicators
    loadError,
    handleRetry,
    loadFeedback,
    refetch, // Expose refetch function directly
    isStale: false, // Additional helper for UI cues
  };
}
