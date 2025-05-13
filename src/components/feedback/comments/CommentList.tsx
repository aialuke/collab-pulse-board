
import React from 'react';
import { CommentType } from '@/types/comments';
import { CommentItem } from './CommentItem';
import { Separator } from '@/components/ui/separator';

interface CommentListProps {
  comments: CommentType[];
  onDelete?: (commentId: string) => void;
}

export function CommentList({ comments, onDelete }: CommentListProps) {
  if (!comments.length) {
    return null;
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
      {comments.map((comment, index) => (
        <React.Fragment key={comment.id}>
          <CommentItem comment={comment} onDelete={onDelete} />
          {index < comments.length - 1 && <Separator className="bg-yellow-600/30" />}
        </React.Fragment>
      ))}
    </div>
  );
}
