
import React from 'react';
import { FeedbackType } from '@/types/feedback';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFeedbackActions } from '@/hooks/useFeedbackActions';
import { useFeedbackFilters } from '@/hooks/useFeedbackFilters';
import { useRepost } from '@/contexts/RepostContext';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import { useFilteredFeedback } from '@/hooks/useFilteredFeedback';
import { MobileFeedbackView } from './MobileFeedbackView';
import { DesktopFeedbackView } from './DesktopFeedbackView';

export function FeedbackContainer() {
  const isMobile = useIsMobile();
  const { filters } = useFeedbackFilters();
  const {
    feedback,
    setFeedback,
    filteredFeedback,
    setFilteredFeedback,
    isLoading,
    loadError,
    handleRetry,
    loadFeedback
  } = useFeedbackData();
  
  const { 
    handleUpvote, 
    handleComment, 
    handleReport, 
    handleDelete,
  } = useFeedbackActions(setFeedback);
  
  const { 
    feedbackToRepost,
    repostDialogOpen,
    handleRepost,
    openRepostDialog,
    closeRepostDialog
  } = useRepost();

  // Use the filtering hook
  useFilteredFeedback(feedback, filters, setFilteredFeedback);
  
  // Since we don't have actual pagination implemented in useFeedbackData yet,
  // we'll set hasMore to false for now - this can be updated when real pagination is implemented
  const hasMore = false;
  
  // We now use isMobile from useIsMobile() to determine which view to show
  if (isMobile) {
    return (
      <MobileFeedbackView
        filteredFeedback={filteredFeedback}
        isLoading={isLoading}
        loadError={loadError}
        feedback={feedback}
        feedbackToRepost={feedbackToRepost}
        repostDialogOpen={repostDialogOpen}
        handleUpvote={handleUpvote}
        handleComment={handleComment}
        handleReport={handleReport}
        handleDelete={handleDelete}
        openRepostDialog={openRepostDialog}
        closeRepostDialog={closeRepostDialog}
        handleRepost={handleRepost}
        handleRetry={handleRetry}
        loadFeedback={loadFeedback}
        hasMore={hasMore}
        sentinelRef={null} // Adding null for now as we don't have an actual sentinel ref yet
      />
    );
  }

  // Desktop view for larger screens
  return (
    <DesktopFeedbackView
      filteredFeedback={filteredFeedback}
      isLoading={isLoading}
      loadError={loadError}
      feedback={feedback}
      feedbackToRepost={feedbackToRepost}
      repostDialogOpen={repostDialogOpen}
      handleUpvote={handleUpvote}
      handleComment={handleComment}
      handleReport={handleReport}
      handleDelete={handleDelete}
      openRepostDialog={openRepostDialog}
      closeRepostDialog={closeRepostDialog}
      handleRepost={handleRepost}
      handleRetry={handleRetry}
      hasMore={hasMore}
      sentinelRef={null} // Adding null for now as we don't have an actual sentinel ref yet
    />
  );
}
