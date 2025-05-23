
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { RepostComment } from './RepostComment';
import { RepostCard } from './RepostCard';
import { FeedbackType } from '@/types/feedback';

interface RepostDisplayProps {
  feedback: FeedbackType;
  onDelete?: (id: string) => void;
}

export function RepostDisplay({ feedback, onDelete }: RepostDisplayProps) {
  if (!feedback.isRepost || !feedback.repostComment) {
    return null;
  }
  
  return (
    <>
      {/* Show the repost comment with emphasis */}
      <RepostComment 
        comment={feedback.repostComment} 
        author={feedback.author} 
        createdAt={feedback.createdAt}
        feedbackId={feedback.id}
        onDelete={onDelete}
      />
      
      {/* Show a compact preview of the original post */}
      {feedback.originalPost && (
        <div className="relative px-4 pb-4 pt-2">
          {/* Indentation to align with the conversation flow */}
          <div className="pl-8">
            <RepostCard feedback={feedback.originalPost} />
          </div>
        </div>
      )}
    </>
  );
}
