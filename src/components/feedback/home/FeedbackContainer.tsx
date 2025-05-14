
import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFeedbackActions } from '@/hooks/useFeedbackActions';
import { useRepost } from '@/contexts/RepostContext';
import { usePaginatedFeedback } from '@/hooks/usePaginatedFeedback';
import { MobileFeedbackView } from './MobileFeedbackView';
import { DesktopFeedbackView } from './DesktopFeedbackView';
import { FeedbackSkeleton, FeedbackError } from './LoadingStates';

export function FeedbackContainer() {
  const isMobile = useIsMobile();
  
  // Use the paginated feedback hook for optimized data loading and infinite scroll
  const {
    feedback,
    isLoading,
    error: loadError,
    hasMore,
    sentinelRef,
    refresh: handleRetry
  } = usePaginatedFeedback({
    pageSize: 10
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
    sentinelRef
  };
  
  // Render the appropriate view based on device type
  if (isMobile) {
    return <MobileFeedbackView {...viewProps} />;
  }

  return <DesktopFeedbackView {...viewProps} />;
}
