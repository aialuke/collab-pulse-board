
import React, { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFeedbackActions } from '@/hooks/useFeedbackActions';
import { useRepost } from '@/contexts/RepostContext';
import { usePaginatedFeedback } from '@/hooks/usePaginatedFeedback';
import { MobileFeedbackView } from './MobileFeedbackView';
import { DesktopFeedbackView } from './DesktopFeedbackView';
import { FeedbackSkeleton, FeedbackError } from './LoadingStates';
import { RepostDialog } from '@/components/feedback/repost/RepostDialog';

export function FeedbackContainer() {
  const isMobile = useIsMobile();
  
  // Use the enhanced paginated feedback hook without filters
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
  
  // Memoize props to prevent unnecessary re-renders
  const viewProps = useMemo(() => ({
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
  }), [
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
  ]);
  
  // Use React.memo to avoid unnecessary re-renders of child components
  const MobileView = React.useMemo(() => <MobileFeedbackView {...viewProps} />, [viewProps, isMobile]);
  const DesktopView = React.useMemo(() => <DesktopFeedbackView {...viewProps} />, [viewProps, isMobile]);
  
  return (
    <>
      {/* Render the appropriate view based on device type */}
      {isMobile ? MobileView : DesktopView}
      
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
