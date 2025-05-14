
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
  
  console.log("Rendering FeedbackContainer");
  
  // Use the paginated feedback hook for optimized data loading and infinite scroll
  const {
    feedback,
    isLoading,
    error: loadError,
    hasMore,
    sentinelRef,
    refresh
  } = usePaginatedFeedback({
    pageSize: 10
  });
  
  console.log("FeedbackContainer state:", { 
    feedbackCount: feedback?.length, 
    isLoading, 
    loadError, 
    hasMore 
  });
  
  // Use the existing feedback actions hook
  const { 
    handleUpvote, 
    handleReport, 
    handleDelete,
  } = useFeedbackActions(() => {
    console.log('Feedback updated via actions, refreshing data');
    refresh();
  });
  
  // Use the repost context
  const { 
    feedbackToRepost,
    repostDialogOpen,
    handleRepost,
    openRepostDialog,
    closeRepostDialog
  } = useRepost();
  
  // Log when the component mounts and unmounts to track lifecycle
  useEffect(() => {
    console.log("FeedbackContainer mounted");
    return () => {
      console.log("FeedbackContainer unmounted");
    };
  }, []);

  // Log when feedback data changes
  useEffect(() => {
    if (feedback) {
      console.log(`FeedbackContainer received ${feedback.length} feedback items`);
    }
  }, [feedback]);
  
  // Common props for both mobile and desktop views
  const viewProps = {
    feedback,
    isLoading,
    loadError: loadError || null,
    feedbackToRepost,
    repostDialogOpen,
    handleUpvote,
    handleReport,
    handleDelete,
    openRepostDialog,
    closeRepostDialog,
    handleRepost,
    handleRetry: refresh, // Use refresh as handleRetry
    hasMore,
    sentinelRef
  };
  
  // Render the appropriate view based on device type
  if (isMobile) {
    return <MobileFeedbackView {...viewProps} />;
  }

  return <DesktopFeedbackView {...viewProps} />;
}
