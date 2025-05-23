
import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { FeedbackType } from '@/types/feedback';
import { 
  useFeedbackQuery,
  usePrefetchFeedbackItem,
  useInvalidateFeedbackQueries
} from './useFeedbackQueries';
import {
  useUpvoteFeedbackMutation,
  useReportFeedbackMutation,
  useDeleteFeedbackMutation,
  useRepostFeedbackMutation
} from './useFeedbackMutations';

interface FeedbackContextType {
  // Queries
  feedback: FeedbackType[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  total: number;
  
  // Mutations
  handleUpvote: (id: string) => void;
  handleReport: (id: string) => void;
  handleDelete: (id: string) => void;
  handleRepost: (id: string, comment: string) => Promise<FeedbackType>;
  
  // Actions
  refresh: () => void;
  prefetchItem: (id: string) => void;
}

interface FeedbackProviderProps {
  children: ReactNode;
  pageSize?: number;
  staleTime?: number;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export function FeedbackProvider({ 
  children,
  pageSize = 10,
  staleTime = 30 * 1000,
}: FeedbackProviderProps) {
  // Use the dedicated query hook
  const { 
    data,
    isLoading,
    error,
    refetch
  } = useFeedbackQuery({
    limit: pageSize,
    page: 1,
    staleTime
  });
  
  // Use the dedicated mutation hooks
  const upvoteMutation = useUpvoteFeedbackMutation();
  const reportMutation = useReportFeedbackMutation();
  const deleteMutation = useDeleteFeedbackMutation();
  const repostMutation = useRepostFeedbackMutation();
  
  // Get utility functions from hooks
  const prefetchItem = usePrefetchFeedbackItem();
  const { invalidateAll } = useInvalidateFeedbackQueries();
  
  // Memoized handlers for better performance
  const handleUpvote = useCallback((id: string) => {
    upvoteMutation.mutate(id);
  }, [upvoteMutation]);
  
  const handleReport = useCallback((id: string) => {
    reportMutation.mutate(id);
  }, [reportMutation]);
  
  const handleDelete = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);
  
  const handleRepost = useCallback(async (id: string, comment: string) => {
    return repostMutation.mutateAsync({ feedbackId: id, comment });
  }, [repostMutation]);
  
  const refresh = useCallback(() => {
    invalidateAll();
    refetch();
  }, [invalidateAll, refetch]);
  
  // Extract feedback data or provide defaults
  const feedback = useMemo(() => data?.items || [], [data?.items]);
  const hasMore = useMemo(() => data?.hasMore || false, [data?.hasMore]);
  const total = useMemo(() => data?.total || 0, [data?.total]);
  
  // Memoize the entire context value to prevent unnecessary re-renders
  const contextValue = useMemo<FeedbackContextType>(() => ({
    feedback,
    isLoading,
    error: error as Error | null,
    hasMore,
    total,
    handleUpvote,
    handleReport,
    handleDelete,
    handleRepost,
    refresh,
    prefetchItem
  }), [
    feedback,
    isLoading,
    error,
    hasMore,
    total,
    handleUpvote,
    handleReport,
    handleDelete,
    handleRepost,
    refresh,
    prefetchItem
  ]);
  
  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackContextType {
  const context = useContext(FeedbackContext);
  
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  
  return context;
}
