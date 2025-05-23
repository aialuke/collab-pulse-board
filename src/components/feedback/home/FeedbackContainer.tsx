
import React, { useMemo, Suspense, lazy } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRepost } from '@/contexts/RepostContext';
import { FeedbackProvider, useFeedback } from '@/hooks/feedback/useFeedbackContext';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { FeedbackSkeleton } from './LoadingStates';

// Lazy load view components
const MobileFeedbackView = lazy(() => 
  import(/* webpackChunkName: "mobile-feedback-view" */ './MobileFeedbackView')
  .then(module => ({ default: module.MobileFeedbackView }))
);
const DesktopFeedbackView = lazy(() => 
  import(/* webpackChunkName: "desktop-feedback-view" */ './DesktopFeedbackView')
  .then(module => ({ default: module.DesktopFeedbackView }))
);
const RepostDialog = lazy(() => 
  import(/* webpackChunkName: "repost-dialog" */ '@/components/feedback/repost/RepostDialog')
  .then(module => ({ default: module.RepostDialog }))
);

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
  
  return (
    <>
      <Suspense fallback={<FeedbackSkeleton />}>
        {isMobile ? (
          <MobileFeedbackView {...viewProps} />
        ) : (
          <DesktopFeedbackView {...viewProps} />
        )}
      </Suspense>
      
      {/* Add the RepostDialog component with Suspense */}
      {feedbackToRepost && (
        <Suspense fallback={null}>
          <RepostDialog
            isOpen={repostDialogOpen}
            onClose={closeRepostDialog}
            feedback={feedbackToRepost}
            onRepost={handleRepost}
          />
        </Suspense>
      )}
    </>
  );
});

// Outer component that provides the feedback context
export function FeedbackContainer() {
  return (
    <ErrorBoundary>
      <FeedbackProvider pageSize={10} staleTime={30 * 1000}>
        <FeedbackContainerInner />
      </FeedbackProvider>
    </ErrorBoundary>
  );
}
