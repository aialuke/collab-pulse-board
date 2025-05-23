
import React, { memo } from 'react';
import { FeedbackType } from '@/types/feedback';
import { FeedbackList } from './FeedbackList';
import { FeedbackEmptyState } from './FeedbackEmptyState';
import { FeedbackLoading } from './FeedbackLoading';
import { FeedbackError } from './LoadingStates';
import { RepostDialog } from '../repost/RepostDialog';

interface DesktopFeedbackViewProps {
  feedback: FeedbackType[];
  isLoading: boolean;
  loadError: string | null;
  feedbackToRepost: FeedbackType | null;
  repostDialogOpen: boolean;
  handleUpvote: (id: string) => void;
  handleReport: (id: string) => void;
  handleDelete: (id: string) => void;
  openRepostDialog: (feedback: FeedbackType) => void;
  closeRepostDialog: () => void;
  handleRepost: (id: string, comment: string) => Promise<any>;
  handleRetry: () => Promise<void>;
  sentinelRef?: React.RefCallback<HTMLDivElement>;
  hasMore: boolean;
  total?: number;
}

export const DesktopFeedbackView = memo(function DesktopFeedbackView({
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
  sentinelRef,
  hasMore,
  total
}: DesktopFeedbackViewProps) {
  // Function to handle opening the repost dialog with the selected feedback
  const handleOpenRepostDialog = React.useCallback((id: string) => {
    const feedbackItem = feedback.find(item => item.id === id);
    if (feedbackItem) {
      openRepostDialog(feedbackItem);
    }
  }, [feedback, openRepostDialog]);

  // Function to render the appropriate content based on loading/error state
  const renderContent = () => {
    if (isLoading && feedback.length === 0) {
      return <FeedbackLoading />;
    }

    if (loadError && feedback.length === 0) {
      return <FeedbackError error={loadError} onRetry={handleRetry} />;
    }

    return (
      <>
        {feedback.length > 0 ? (
          <FeedbackList
            feedback={feedback}
            onUpvote={handleUpvote}
            onReport={handleReport}
            onDelete={handleDelete}
            onRepost={handleOpenRepostDialog}
            hasMore={hasMore}
            sentinelRef={sentinelRef}
          />
        ) : (
          <FeedbackEmptyState />
        )}
        
        {/* Render sentinel for infinite scroll if needed */}
        {hasMore && sentinelRef && (
          <div ref={sentinelRef} className="py-4 flex justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="w-full flex-1 overflow-auto pb-10">
        {renderContent()}
      </div>

      {/* Repost Dialog */}
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
