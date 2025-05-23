
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRepost } from '@/contexts/RepostContext';
import { MobileFeedbackView } from './MobileFeedbackView';
import { DesktopFeedbackView } from './DesktopFeedbackView';
import { RepostDialog } from '@/components/feedback/repost/RepostDialog';
import { FeedbackProvider, useFeedback } from '@/hooks/feedback/useFeedbackContext';

// Inner component that uses the feedback context
function FeedbackContainerInner() {
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
    refresh: handleRetry,
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
  
  // Props shared between mobile and desktop views
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
    total
  };
  
  return (
    <>
      {/* Render the appropriate view based on device type */}
      {isMobile ? (
        <MobileFeedbackView {...viewProps} />
      ) : (
        <DesktopFeedbackView {...viewProps} />
      )}
      
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
}

// Outer component that provides the feedback context
export function FeedbackContainer() {
  return (
    <FeedbackProvider pageSize={10} staleTime={30 * 1000}>
      <FeedbackContainerInner />
    </FeedbackProvider>
  );
}
