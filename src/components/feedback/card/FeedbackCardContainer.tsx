
import React, { useState, useCallback, memo } from 'react';
import { FeedbackCard } from './FeedbackCard';
import { FeedbackType } from '@/types/feedback';
import { useAuth } from '@/contexts/AuthContext';

interface FeedbackCardContainerProps {
  feedback: FeedbackType;
  onUpvote: (id: string) => void;
  onReport: (id: string) => void;
  onDelete?: (id: string) => void;
  onRepost?: (id: string) => void;
}

// Memoize the component to prevent unnecessary re-renders
export const FeedbackCardContainer = memo(function FeedbackCardContainer({
  feedback,
  onUpvote,
  onReport,
  onDelete,
  onRepost
}: FeedbackCardContainerProps) {
  const { user } = useAuth();
  const [isUpvoted, setIsUpvoted] = useState(feedback.isUpvoted || false);
  const [upvotes, setUpvotes] = useState(feedback.upvotes);

  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const isAuthor = user?.id === feedback.author.id;
  const isOwnFeedback = isAuthor;

  const handleUpvote = useCallback(() => {
    // Don't process upvotes for reposts
    if (feedback.isRepost) return;
    
    if (isOwnFeedback) return;
    if (isUpvoted) return; // Don't allow un-upvote

    setIsUpvoted(true);
    setUpvotes(prev => prev + 1);
    onUpvote(feedback.id);
  }, [feedback.id, feedback.isRepost, isOwnFeedback, isUpvoted, onUpvote]);

  const handleRepostClick = useCallback(() => {
    if (!onRepost) return;
    onRepost(feedback.id);
  }, [feedback.id, onRepost]);

  // Determine if this post has an image to adjust min-height accordingly
  const hasImage = !!feedback.imageUrl || !!feedback.image;
  const minHeightClass = hasImage ? "min-h-[240px]" : "min-h-[120px]";

  return (
    <div className={`w-full mb-4 ${minHeightClass}`}>
      <FeedbackCard
        feedback={{
          ...feedback,
          isUpvoted,
          upvotes
        }}
        isManager={isManager}
        isAuthor={isAuthor}
        isUpvoted={isUpvoted}
        upvotes={upvotes}
        onUpvote={handleUpvote}
        onReport={onReport}
        onDelete={onDelete}
        onRepost={handleRepostClick}
        commentsEnabled={false}
      />
    </div>
  );
});
