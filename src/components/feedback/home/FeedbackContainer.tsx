
import React from 'react';
import { usePaginatedFeedback } from '@/hooks/usePaginatedFeedback';
import { useFeedbackFilters } from '@/hooks/useFeedbackFilters';
import { useFeedbackActions } from '@/hooks/useFeedbackActions';
import { useRepost } from '@/contexts/RepostContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileFeedbackView } from './MobileFeedbackView';
import { DesktopFeedbackView } from './DesktopFeedbackView';

export function FeedbackContainer() {
  const isMobile = useIsMobile();
  const { filters } = useFeedbackFilters();
  
  // Use our optimized paginated feedback hook
  const {
    feedback,
    isLoading,
    error: loadError,
    hasMore,
    sentinelRef,
    refresh: handleRetry
  } = usePaginatedFeedback({
    filterStatus: filters.status,
    pageSize: 10
  });
  
  // Use feedback actions
  const {
    handleUpvote,
    handleReport,
    handleDelete,
  } = useFeedbackActions((newFeedback) => {
    // This is a no-op since usePaginatedFeedback manages its own state
    // We just need to pass a function to satisfy the API
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
        sentinelRef={sentinelRef}
        hasMore={hasMore}
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
      sentinelRef={sentinelRef}
      hasMore={hasMore}
    />
  );
}
