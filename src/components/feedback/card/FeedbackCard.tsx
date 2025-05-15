
import React, { useRef } from 'react';
import { Card, CardFooter, CardContent } from '@/components/ui/card';
import { FeedbackType } from '@/types/feedback';
import { FeedbackActions } from './FeedbackActions';
import { RepostDisplay } from './RepostDisplay';
import { StandardFeedback } from './StandardFeedback';
import { useAnimationOnScroll } from '@/hooks/useAnimationOnScroll';

// Define the category ID for shout outs
const SHOUT_OUT_CATEGORY_ID = 5;

interface FeedbackCardProps {
  feedback: FeedbackType;
  isManager: boolean;
  isAuthor: boolean;
  isUpvoted: boolean;
  upvotes: number;
  commentsEnabled: boolean;
  onUpvote: () => void;
  onReport: (id: string) => void;
  onDelete?: (id: string) => void;
  onRepost?: () => void;
}

export function FeedbackCard({
  feedback,
  isManager,
  isAuthor,
  isUpvoted,
  upvotes,
  commentsEnabled,
  onUpvote,
  onReport,
  onDelete,
  onRepost
}: FeedbackCardProps) {
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const isManagerPost = feedback.author.role === 'manager' || feedback.author.role === 'admin';
  const isOwnFeedback = isAuthor;
  
  // Check if this is a shout out based on category ID or explicit flag
  const isShoutOut = feedback.isShoutOut || feedback.categoryId === SHOUT_OUT_CATEGORY_ID;
  
  // Use the animation on scroll hook for shout out cards
  const { ref: animationRef, isVisible } = useAnimationOnScroll({
    threshold: 0.2,
    once: true,
    disabled: !isShoutOut
  });
  
  // Special class for cards
  const cardBorderClass = isManagerPost ? 'royal-blue-gradient-border' : 'gradient-border';
  const shoutOutClass = isShoutOut ? 'shout-out-card' : '';
  const animateClass = isShoutOut && isVisible ? 'animate' : '';
  const cardClass = `w-full transition-all hover:shadow-md animate-fade-in bg-white border-neutral-200 ${cardBorderClass} ${shoutOutClass} ${animateClass} text-neutral-900`;

  return (
    <Card className={cardClass} ref={animationRef}>
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
          isUpvoted={isUpvoted} 
          onUpvote={onUpvote} 
          isOwnFeedback={isOwnFeedback}
          isManagerPost={isManagerPost}
          hideRepost={feedback.isRepost}
        />
      </CardFooter>
    </Card>
  );
}
