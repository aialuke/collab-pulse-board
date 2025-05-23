
import React, { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRepost } from '@/contexts/RepostContext';
import { MobileFeedbackView } from './MobileFeedbackView';
import { DesktopFeedbackView } from './DesktopFeedbackView';
import { RepostDialog } from '@/components/feedback/repost/RepostDialog';
import { FeedbackProvider, useFeedback } from '@/hooks/feedback/useFeedbackContext';

// Inner component that uses the feedback context with optimized memoization
const FeedbackContainerInner = React.memo(function FeedbackContainerInner() {
  const isMobile = useIsMobile();
  
  // Get feedback data and operations from context
  const {
    feedback,
    isLoading,
    error: loadError,
    hasMore,
    handleUpvote, 
    handleReport, 
    handleDelete,
    refresh: originalHandleRetry,
    total
  } = useFeedback();
  
  // Use the repost context
  const { 
    feedbackToRepost,
    repostDialogOpen,
    handleRepost,
    openRepostDialog,
    closeRepostDialog
  } = useRepost();
  
  // Convert the Error object to string for the view components
  const errorMessage = loadError ? loadError.message || 'An error occurred' : null;
  
  // Wrap handleRetry to ensure it returns a Promise
  const handleRetry = async (): Promise<void> => {
    return Promise.resolve(originalHandleRetry());
  };
  
  // Memoize the view props to prevent unnecessary re-renders
  const viewProps = useMemo(() => ({
    feedback,
    isLoading,
    loadError: errorMessage,
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
    total
  }), [
    feedback,
    isLoading,
    errorMessage,
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
    total
  ]);
  
  // Memoize the appropriate view component based on device type
  const CurrentView = useMemo(() => 
    isMobile ? (
      <MobileFeedbackView {...viewProps} />
    ) : (
      <DesktopFeedbackView {...viewProps} />
    ), [viewProps, isMobile]
  );

  return (
    <>
      {/* Render the memoized view */}
      {CurrentView}
      
      {/* Add the RepostDialog component */}
      {feedbackToRepost && (
        <RepostDialog
          isOpen={repostDialogOpen}
          onClose={closeRepostDialog}
          feedback={feedbackToRepost}
          onRepost={handleRepost}
        />
      )}
    </>
  );
});

// Outer component that provides the feedback context
export function FeedbackContainer() {
  return (
    <FeedbackProvider pageSize={10} staleTime={30 * 1000}>
      <FeedbackContainerInner />
    </FeedbackProvider>
  );
}
