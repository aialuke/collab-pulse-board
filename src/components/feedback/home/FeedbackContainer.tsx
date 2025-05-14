
import React, { useEffect } from 'react';
import { FeedbackType } from '@/types/feedback';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFeedbackActions } from '@/hooks/useFeedbackActions';
import { useRepost } from '@/contexts/RepostContext';
import { usePaginatedFeedback } from '@/hooks/usePaginatedFeedback';
import { MobileFeedbackView } from './MobileFeedbackView';
import { DesktopFeedbackView } from './DesktopFeedbackView';
import { FeedbackSkeleton, FeedbackError, LoadMoreSentinel } from './LoadingStates';

export function FeedbackContainer() {
  const isMobile = useIsMobile();
  
  // Use the paginated feedback hook for optimized data loading and infinite scroll
  // No longer passing filterStatus parameter
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
  } = useFeedbackActions((newFeedback) => {
    // This is a no-op now as pagination handles state management
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
  
  // We now use isMobile from useIsMobile() to determine which view to show
  if (isMobile) {
    return (
      <MobileFeedbackView
        filteredFeedback={feedback}
        isLoading={isLoading}
        loadError={loadError}
        feedback={feedback}
        feedbackToRepost={feedbackToRepost}
        repostDialogOpen={repostDialogOpen}
        handleUpvote={handleUpvote}
        handleReport={handleReport}
        handleDelete={handleDelete}
        openRepostDialog={openRepostDialog}
        closeRepostDialog={closeRepostDialog}
        handleRepost={handleRepost}
        handleRetry={handleRetry}
        loadFeedback={handleRetry}
        hasMore={hasMore}
        sentinelRef={sentinelRef}
      />
    );
  }

  // Desktop view for larger screens
  return (
    <DesktopFeedbackView
      filteredFeedback={feedback}
      isLoading={isLoading}
      loadError={loadError}
      feedback={feedback}
      feedbackToRepost={feedbackToRepost}
      repostDialogOpen={repostDialogOpen}
      handleUpvote={handleUpvote}
      handleReport={handleReport}
      handleDelete={handleDelete}
      openRepostDialog={openRepostDialog}
      closeRepostDialog={closeRepostDialog}
      handleRepost={handleRepost}
      handleRetry={handleRetry}
      hasMore={hasMore}
      sentinelRef={sentinelRef}
    />
  );
}
