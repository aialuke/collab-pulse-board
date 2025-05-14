
import React, { useState } from 'react';
import { usePaginatedFeedback } from '@/hooks/usePaginatedFeedback';
import { useFeedbackFilters } from '@/hooks/useFeedbackFilters';
import { useFeedbackActions } from '@/hooks/useFeedbackActions';
import { useRepost } from '@/contexts/RepostContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileFeedbackView } from './MobileFeedbackView';
import { DesktopFeedbackView } from './DesktopFeedbackView';
import { FeedbackSkeleton, FeedbackError, LoadMoreSentinel } from './LoadingStates';
import { FeedbackList } from './FeedbackList';
import { FeedbackEmptyState } from './FeedbackEmptyState';

export function OptimizedFeedbackContainer() {
  const isMobile = useIsMobile();
  const { filters } = useFeedbackFilters();
  const [feedback, setFeedback] = useState([]);
  
  // Use our new paginated feedback hook
  const {
    feedback: paginatedFeedback,
    isLoading,
    error,
    hasMore,
    sentinelRef,
    refresh
  } = usePaginatedFeedback({
    filterStatus: filters.status,
    pageSize: 10
  });
  
  // Combine with our existing feedback actions
  const {
    handleUpvote,
    handleComment,
    handleReport,
    handleDelete,
  } = useFeedbackActions(setFeedback);
  
  // Use the repost context
  const {
    feedbackToRepost,
    repostDialogOpen,
    handleRepost,
    openRepostDialog,
    closeRepostDialog
  } = useRepost();

  // Render the appropriate content based on state
  const renderContent = () => {
    if (isLoading && paginatedFeedback.length === 0) {
      return <FeedbackSkeleton />;
    }

    if (error && paginatedFeedback.length === 0) {
      return <FeedbackError message={error} onRetry={refresh} />;
    }

    if (paginatedFeedback.length === 0) {
      return <FeedbackEmptyState />;
    }

    return (
      <div className="space-y-4">
        <FeedbackList
          feedback={paginatedFeedback}
          onUpvote={handleUpvote}
          onComment={handleComment}
          onReport={handleReport}
          onDelete={handleDelete}
          onRepost={(id) => {
            const feedbackItem = paginatedFeedback.find(item => item.id === id);
            if (feedbackItem) {
              openRepostDialog(feedbackItem);
            }
          }}
        />
        
        {/* Render sentinel for infinite scroll */}
        {hasMore && <LoadMoreSentinel ref={sentinelRef} />}
      </div>
    );
  };

  // Render based on device type
  if (isMobile) {
    return (
      <MobileFeedbackView
        filteredFeedback={paginatedFeedback}
        isLoading={isLoading}
        loadError={error}
        feedback={paginatedFeedback}
        feedbackToRepost={feedbackToRepost}
        repostDialogOpen={repostDialogOpen}
        handleUpvote={handleUpvote}
        handleComment={handleComment}
        handleReport={handleReport}
        handleDelete={handleDelete}
        openRepostDialog={openRepostDialog}
        closeRepostDialog={closeRepostDialog}
        handleRepost={handleRepost}
        handleRetry={refresh}
        loadFeedback={refresh}
        sentinelRef={sentinelRef}
        hasMore={hasMore}
      />
    );
  }

  return (
    <DesktopFeedbackView
      filteredFeedback={paginatedFeedback}
      isLoading={isLoading}
      loadError={error}
      feedback={paginatedFeedback}
      feedbackToRepost={feedbackToRepost}
      repostDialogOpen={repostDialogOpen}
      handleUpvote={handleUpvote}
      handleComment={handleComment}
      handleReport={handleReport}
      handleDelete={handleDelete}
      openRepostDialog={openRepostDialog}
      closeRepostDialog={closeRepostDialog}
      handleRepost={handleRepost}
      handleRetry={refresh}
      sentinelRef={sentinelRef}
      hasMore={hasMore}
    />
  );
}
