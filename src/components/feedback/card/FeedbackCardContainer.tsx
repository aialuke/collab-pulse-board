
import React, { useState } from 'react';
import { FeedbackCard } from './FeedbackCard';
import { FeedbackType } from '@/types/feedback';
import { useAuth } from '@/contexts/AuthContext';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';

interface FeedbackCardContainerProps {
  feedback: FeedbackType;
  onUpvote: (id: string) => void;
  onComment: (id: string) => void;
  onReport: (id: string) => void;
  onDelete?: (id: string) => void;
  onRepost?: (id: string) => void;
  navigateOnComment?: boolean;
}

export function FeedbackCardContainer({
  feedback,
  onUpvote,
  onComment,
  onReport,
  onDelete,
  onRepost,
  navigateOnComment = false
}: FeedbackCardContainerProps) {
  const { user } = useAuth();
  const { features } = useFeatureFlags();
  const [isUpvoted, setIsUpvoted] = useState(feedback.isUpvoted || false);
  const [upvotes, setUpvotes] = useState(feedback.upvotes);

  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const isAuthor = user?.id === feedback.author.id;
  const isOwnFeedback = isAuthor;

  const handleUpvote = () => {
    // Don't process upvotes for reposts
    if (feedback.isRepost) return;
    
    if (isOwnFeedback) return;
    if (isUpvoted) return; // Don't allow un-upvote

    setIsUpvoted(true);
    setUpvotes(prev => prev + 1);
    onUpvote(feedback.id);
  };

  const handleCommentClick = () => {
    if (navigateOnComment) {
      onComment(feedback.id);
    }
  };

  const handleRepostClick = () => {
    if (!onRepost) return;
    onRepost(feedback.id);
  };

  return (
    <div className="w-full mb-4">
      <FeedbackCard
        feedback={feedback}
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
}
