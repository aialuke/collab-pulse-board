
import React from 'react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CommentList } from './CommentList';
import { CommentForm } from './CommentForm';
import { CommentType } from '@/types/comments';
import { MessageSquare } from 'lucide-react';

interface FeedbackCommentsProps {
  feedbackId: string;
  comments: CommentType[];
  isLoading: boolean;
  showComments: boolean;
  showCommentForm: boolean;
  onSubmitComment: (content: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
  onShowReplyForm: () => void;
}

export function FeedbackComments({
  feedbackId,
  comments,
  isLoading,
  showComments,
  showCommentForm,
  onSubmitComment,
  onDeleteComment,
  onShowReplyForm
}: FeedbackCommentsProps) {
  return (
    <Collapsible open={showComments} className="px-2 sm:px-4 md:px-6 pb-2 sm:pb-3 md:pb-4">
      <CollapsibleContent>
        {comments.length > 0 ? (
          <div className="mt-1 sm:mt-2">
            <Separator className="bg-neutral-200 mb-2 sm:mb-3" />
            <CommentList comments={comments} onDelete={onDeleteComment} />
          </div>
        ) : isLoading ? (
          <div className="py-2 sm:py-3 text-center text-muted-foreground text-sm">
            Loading comments...
          </div>
        ) : (
          <div className="py-1 sm:py-2 text-center text-muted-foreground text-xs sm:text-sm">
            No comments yet. Be the first to leave a comment!
          </div>
        )}
        
        {showCommentForm ? (
          <div className="mt-1 sm:mt-2">
            <CommentForm 
              feedbackId={feedbackId} 
              onSubmit={onSubmitComment} 
              compact={true}
            />
          </div>
        ) : comments.length > 0 && (
          <div className="mt-2 sm:mt-3 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowReplyForm}
              className="text-muted-foreground hover:bg-royal-blue-500/10 hover:text-neutral-900 flex items-center text-xs sm:text-sm"
            >
              <MessageSquare className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              Reply
            </Button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
