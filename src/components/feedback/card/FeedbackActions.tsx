
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from '@/components/icons';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

export interface FeedbackActionProps {
  /** Number of upvotes for the feedback */
  upvotes: number;
  /** Whether the current user has upvoted this feedback */
  isUpvoted: boolean;
  /** Handler function for upvote action */
  onUpvote: () => void;
  /** Whether the feedback belongs to the current user */
  isOwnFeedback?: boolean;
  /** Whether the feedback was posted by a manager */
  isManagerPost?: boolean;
  /** Whether to hide repost actions */
  hideRepost?: boolean;
}

export function FeedbackActions({ 
  upvotes, 
  isUpvoted, 
  onUpvote,
  isOwnFeedback = false,
  isManagerPost = false,
  hideRepost = false
}: FeedbackActionProps) {
  const isMobile = useIsMobile();
  
  const getUpvoteButtonClasses = () => {
    if (isUpvoted) {
      return isManagerPost ? 'text-royal-blue-600' : 'text-teal-600';
    }
    return isManagerPost 
      ? 'text-neutral-700 hover:bg-royal-blue-500/10'
      : 'text-neutral-700 hover:bg-teal-500/10';
  };

  const renderUpvoteButton = () => {
    const buttonContent = (
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center ${getUpvoteButtonClasses()} ${
          isUpvoted && !isOwnFeedback 
            ? 'animate-upvote-pop' 
            : ''
        }`}
        onClick={onUpvote}
        disabled={isOwnFeedback || isUpvoted}
      >
        <ArrowUp className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
        <span className="text-xs sm:text-sm">{upvotes}</span>
      </Button>
    );
    
    if (isMobile) {
      return buttonContent;
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              {buttonContent}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {isOwnFeedback 
              ? "You cannot upvote your own feedback" 
              : isUpvoted 
                ? "You've already upvoted this feedback" 
                : "Upvote this feedback"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  
  return (
    <div className="flex justify-start gap-1 sm:gap-2 pt-1 sm:pt-2 w-full">
      {/* Only show upvote button if this is not a repost */}
      {!hideRepost && renderUpvoteButton()}
    </div>
  );
}
