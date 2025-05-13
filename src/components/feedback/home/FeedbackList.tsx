
import React from 'react';
import { FeedbackCardContainer } from '@/components/feedback/card/FeedbackCardContainer';
import { FeedbackType } from '@/types/feedback';

interface FeedbackListProps {
  feedback: FeedbackType[];
  onUpvote: (id: string) => void;
  onComment: (id: string) => void;
  onReport: (id: string) => void;
  onDelete?: (id: string) => void;
  onRepost?: (id: string) => void;
}

export function FeedbackList({ 
  feedback,
  onUpvote,
  onComment,
  onReport,
  onDelete,
  onRepost
}: FeedbackListProps) {
  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <FeedbackCardContainer
          key={item.id}
          feedback={item}
          onUpvote={onUpvote}
          onComment={onComment}
          onReport={onReport}
          onDelete={onDelete}
          onRepost={onRepost}
          navigateOnComment={false}
        />
      ))}
    </div>
  );
}
