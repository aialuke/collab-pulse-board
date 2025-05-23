
import React, { createContext, useContext, ReactNode } from 'react';
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

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export function FeedbackProvider({ 
  children,
  pageSize = 10,
  staleTime = 30 * 1000,
}: { 
  children: ReactNode;
  pageSize?: number;
  staleTime?: number;
}) {
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
  
  // Handle mutations
  const handleUpvote = (id: string) => {
    upvoteMutation.mutate(id);
  };
  
  const handleReport = (id: string) => {
    reportMutation.mutate(id);
  };
  
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };
  
  const handleRepost = async (id: string, comment: string) => {
    return repostMutation.mutateAsync({ feedbackId: id, comment });
  };
  
  // Extract feedback data or provide defaults
  const feedback = data?.items || [];
  const hasMore = data?.hasMore || false;
  const total = data?.total || 0;
  
  // Provide the context value
  const contextValue: FeedbackContextType = {
    feedback,
    isLoading,
    error: error as Error | null,
    hasMore,
    total,
    handleUpvote,
    handleReport,
    handleDelete,
    handleRepost,
    refresh: () => {
      invalidateAll();
      refetch();
    },
    prefetchItem
  };
  
  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  
  return context;
}
