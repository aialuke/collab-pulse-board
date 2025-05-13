
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { useFeatureFlags } from '@/contexts/FeatureFlagContext';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface FeedbackActionsProps {
  upvotes: number;
  comments: number;
  isUpvoted: boolean;
  onUpvote: () => void;
  onComment: () => void;
  isCommentsOpen?: boolean;
  isOwnFeedback?: boolean;
  isManagerPost?: boolean;
  hideRepost?: boolean;  // Used to determine if this is a repost
}

export function FeedbackActions({ 
  upvotes, 
  comments, 
  isUpvoted, 
  onUpvote, 
  onComment,
  isCommentsOpen = false,
  isOwnFeedback = false,
  isManagerPost = false,
  hideRepost = false
}: FeedbackActionsProps) {
  const { features } = useFeatureFlags();
  const isMobile = useIsMobile();
  
  const getUpvoteButtonClasses = () => {
    if (isUpvoted) {
      return isManagerPost ? 'text-royal-blue-600' : 'text-teal-600';
    }
    return isManagerPost 
      ? 'text-neutral-700 hover:bg-royal-blue-500/10'
      : 'text-neutral-700 hover:bg-teal-500/10';
  };
  
  const getCommentButtonClasses = () => {
    if (isCommentsOpen) {
      return isManagerPost ? 'text-royal-blue-700' : 'text-blue-700';
    }
    return 'text-neutral-700';
  };
  
  const getCommentHoverClass = () => {
    return isManagerPost ? 'hover:bg-royal-blue-500/10' : 'hover:bg-blue-700/10';
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
      
      {features.enableComments && (
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center ${getCommentHoverClass()} ${getCommentButtonClasses()}`}
          onClick={onComment}
        >
          <MessageSquare className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm">{comments}</span>
        </Button>
      )}
    </div>
  );
}
