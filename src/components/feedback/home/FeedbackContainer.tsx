
import React from 'react';
import { FeedbackType } from '@/types/feedback';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFeedbackActions } from '@/hooks/useFeedbackActions';
import { useFeedbackFilters } from '@/hooks/useFeedbackFilters';
import { RepostProvider, useRepost } from '@/contexts/RepostContext';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import { useFilteredFeedback } from '@/hooks/useFilteredFeedback';
import { MobileFeedbackView } from './MobileFeedbackView';
import { DesktopFeedbackView } from './DesktopFeedbackView';

function FeedbackContainerContent() {
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
    />
  );
}

export function FeedbackContainer() {
  return (
    <RepostProvider onRepostSuccess={(feedback) => {}}>
      <FeedbackContainerContent />
    </RepostProvider>
  );
}
