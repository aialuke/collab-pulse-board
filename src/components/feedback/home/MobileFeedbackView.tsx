
import React, { useEffect } from 'react';
import { FeedbackType } from '@/types/feedback';
import { FeedbackList } from './FeedbackList';
import { FeedbackEmptyState } from './FeedbackEmptyState';
import { FeedbackLoading } from './FeedbackLoading';
import { FeedbackError } from './LoadingStates';
import { RepostDialog } from '../repost/RepostDialog';
import { useRefresh } from '@/contexts/RefreshContext';

interface MobileFeedbackViewProps {
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
  handleRetry: () => Promise<void>; // Updated to match expected return type
  hasMore: boolean;
  sentinelRef?: React.RefCallback<HTMLDivElement>;
}

export function MobileFeedbackView({
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
  hasMore
}: MobileFeedbackViewProps) {
  const { setRefreshFunction } = useRefresh();
  
  // Register the refresh function with the RefreshContext
  useEffect(() => {
    // Ensure handleRetry returns a Promise
    const wrappedHandleRetry = async () => {
      await handleRetry();
    };
    
    setRefreshFunction(wrappedHandleRetry);
  }, [handleRetry, setRefreshFunction]);

  // Function to render the appropriate content based on loading/error state
  const renderContent = () => {
    if (isLoading && feedback.length === 0) {
      return <FeedbackLoading />;
    }

    if (loadError && feedback.length === 0) {
      return <FeedbackError error={loadError} onRetry={handleRetry} />;
    }

    return feedback.length > 0 ? (
      <>
        <FeedbackList
          feedback={feedback}
          onUpvote={handleUpvote}
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
