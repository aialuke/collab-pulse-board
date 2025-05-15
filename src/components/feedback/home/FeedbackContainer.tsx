
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFeedbackActions } from '@/hooks/useFeedbackActions';
import { useRepost } from '@/contexts/RepostContext';
import { usePaginatedFeedback } from '@/hooks/usePaginatedFeedback';
import { MobileFeedbackView } from './MobileFeedbackView';
import { DesktopFeedbackView } from './DesktopFeedbackView';
import { FeedbackSkeleton, FeedbackError } from './LoadingStates';
import { useFeedbackFilters } from '@/hooks/useFeedbackFilters';

export function FeedbackContainer() {
  const isMobile = useIsMobile();
  const { selectedCategory, selectedStatus } = useFeedbackFilters();
  
  // Use the enhanced paginated feedback hook with filters
  const {
    feedback,
    isLoading,
    error: loadError,
    hasMore,
    sentinelRef,
    refresh: handleRetry,
    total
  } = usePaginatedFeedback({
    pageSize: 10,
    filterBy: {
      category: selectedCategory !== 'all' ? Number(selectedCategory) : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined
    },
    staleTime: 30 * 1000 // 30 seconds stale time
  });
  
  // Use the existing feedback actions hook
  const { 
    handleUpvote, 
    handleReport, 
    handleDelete,
  } = useFeedbackActions(() => {
    console.log('Feedback updated via actions');
  });
  
  // Use the repost context
  const { 
    feedbackToRepost,
    repostDialogOpen,
    handleRepost,
    openRepostDialog,
    closeRepostDialog
  } = useRepost();
  
  // Common props for both mobile and desktop views
  const viewProps = {
    feedback,
    isLoading,
    loadError,
    feedbackToRepost,
    repostDialogOpen,
    handleUpvote,
    handleReport,
    handleDelete,
    openRepostDialog,
    closeRepostDialog,
    handleRepost,
    handleRetry,
    hasMore,
    sentinelRef,
    total
  };
  
  // Render the appropriate view based on device type
  if (isMobile) {
    return <MobileFeedbackView {...viewProps} />;
  }

  return <DesktopFeedbackView {...viewProps} />;
}
