
import React, { useEffect } from 'react';
import { FeedbackType } from '@/types/feedback';
import { FeedbackList } from './FeedbackList';
import { FeedbackEmptyState } from './FeedbackEmptyState';
import { FeedbackLoading } from './FeedbackLoading';
import { FeedbackError } from './FeedbackError';
import { RepostDialog } from '../repost/RepostDialog';
import { useRefresh } from '@/contexts/RefreshContext';

interface MobileFeedbackViewProps {
  filteredFeedback: FeedbackType[];
  isLoading: boolean;
  loadError: string | null;
  feedback: FeedbackType[];
  feedbackToRepost: FeedbackType | null;
  repostDialogOpen: boolean;
  handleUpvote: (id: string) => void;
  handleComment: (id: string) => void;
  handleReport: (id: string) => void;
  handleDelete: (id: string) => void;
  openRepostDialog: (feedback: FeedbackType) => void;
  closeRepostDialog: () => void;
  handleRepost: (id: string, comment: string) => Promise<any>;
  handleRetry: () => void;
  loadFeedback: () => Promise<void>;
  sentinelRef?: React.RefCallback<HTMLDivElement>;
  hasMore: boolean;
}

export function MobileFeedbackView({
  filteredFeedback,
  isLoading,
  loadError,
  feedback,
  feedbackToRepost,
  repostDialogOpen,
  handleUpvote,
  handleComment,
  handleReport,
  handleDelete,
  openRepostDialog,
  closeRepostDialog,
  handleRepost,
  handleRetry,
  loadFeedback,
  sentinelRef,
  hasMore
}: MobileFeedbackViewProps) {
  const { setRefreshFunction } = useRefresh();
  
  // Register the loadFeedback function with the RefreshContext
  useEffect(() => {
    setRefreshFunction(loadFeedback);
  }, [loadFeedback, setRefreshFunction]);

  // Function to render the appropriate content based on loading/error state
  const renderContent = () => {
    if (isLoading && feedback.length === 0) {
      return <FeedbackLoading />;
    }

    if (loadError && feedback.length === 0) {
      return <FeedbackError error={loadError} onRetry={handleRetry} />;
    }

    return filteredFeedback.length > 0 ? (
      <>
        <FeedbackList
          feedback={filteredFeedback}
          onUpvote={handleUpvote}
          onComment={handleComment}
          onReport={handleReport}
          onDelete={handleDelete}
          onRepost={(id) => {
            const feedbackItem = feedback.find(item => item.id === id);
            if (feedbackItem) {
              openRepostDialog(feedbackItem);
            }
          }}
        />
        
        {/* Render sentinel for infinite scroll if needed */}
        {hasMore && sentinelRef && (
          <div ref={sentinelRef} className="py-4 flex justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
          </div>
        )}
      </>
    ) : (
      <FeedbackEmptyState />
    );
  };

  return (
    <>
      <div className="w-full h-full overflow-auto pb-16 px-0">
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
}
