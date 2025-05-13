
import React, { useRef } from 'react';
import { Card, CardFooter, CardContent } from '@/components/ui/card';
import { FeedbackType } from '@/types/feedback';
import { CommentType } from '@/types/comments';
import { FeedbackActions } from './FeedbackActions';
import { RepostDisplay } from './RepostDisplay';
import { StandardFeedback } from './StandardFeedback';
import { FeedbackComments } from '../comments/FeedbackComments';

interface FeedbackCardProps {
  feedback: FeedbackType;
  isManager: boolean;
  isAuthor: boolean;
  isUpvoted: boolean;
  upvotes: number;
  showComments: boolean;
  comments: CommentType[];
  isLoading: boolean;
  showCommentForm: boolean;
  commentsEnabled: boolean;
  onUpvote: () => void;
  onCommentClick: () => void;
  onReport: (id: string) => void;
  onDelete?: (id: string) => void;
  onRepost?: () => void;
  onSubmitComment: (content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onShowReplyForm: () => void;
}

export function FeedbackCard({
  feedback,
  isManager,
  isAuthor,
  isUpvoted,
  upvotes,
  showComments,
  comments,
  isLoading,
  showCommentForm,
  commentsEnabled,
  onUpvote,
  onCommentClick,
  onReport,
  onDelete,
  onRepost,
  onSubmitComment,
  onDeleteComment,
  onShowReplyForm
}: FeedbackCardProps) {
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const isManagerPost = feedback.author.role === 'manager' || feedback.author.role === 'admin';
  const isOwnFeedback = isAuthor;
  
  // Special class for cards
  const cardBorderClass = isManagerPost ? 'royal-blue-gradient-border' : 'gradient-border';
  const cardClass = `w-full transition-all hover:shadow-md animate-fade-in bg-white border-neutral-200 ${cardBorderClass} text-neutral-900`;

  return (
    <Card className={cardClass}>
      {/* If this is a repost, show the RepostDisplay component */}
      {feedback.isRepost ? (
        <RepostDisplay 
          feedback={feedback} 
          onDelete={onDelete}
        />
      ) : (
        /* For regular posts, show the StandardFeedback component */
        <StandardFeedback
          feedback={feedback}
          isManager={isManager}
          isAuthor={isAuthor}
          dropdownTriggerRef={dropdownTriggerRef}
          onReport={onReport}
          onDelete={onDelete}
          onRepost={onRepost}
        />
      )}
      
      {/* Show footer with actions */}
      <CardFooter className="px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-3">
        <FeedbackActions 
          upvotes={upvotes} 
          comments={feedback.comments} 
          isUpvoted={isUpvoted} 
          onUpvote={onUpvote} 
          onComment={onCommentClick}
          isCommentsOpen={showComments}
          isOwnFeedback={isOwnFeedback}
          isManagerPost={isManagerPost}
          hideRepost={feedback.isRepost}
        />
      </CardFooter>
      
      {/* Comments section component */}
      {commentsEnabled && showComments && (
        <CardContent className="pt-0 px-2 sm:px-3 md:px-4">
          <FeedbackComments
            feedbackId={feedback.id}
            comments={comments}
            isLoading={isLoading}
            showComments={showComments}
            showCommentForm={showCommentForm}
            onSubmitComment={onSubmitComment}
            onDeleteComment={onDeleteComment}
            onShowReplyForm={onShowReplyForm}
          />
        </CardContent>
      )}
    </Card>
  );
}
