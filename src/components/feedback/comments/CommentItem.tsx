
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommentType } from '@/types/comments';
import { formatDuration, intervalToDuration } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Clock, Trash2 } from 'lucide-react';
import { getFirstName } from '@/services/feedback/utils';

// Custom function to format time without "about" prefix
const formatTimeAgo = (date: Date): string => {
  const duration = intervalToDuration({ start: date, end: new Date() });
  
  // Handle the specific time units we want to display
  if (duration.years && duration.years > 0) {
    return `${duration.years} ${duration.years === 1 ? 'year' : 'years'} ago`;
  } else if (duration.months && duration.months > 0) {
    return `${duration.months} ${duration.months === 1 ? 'month' : 'months'} ago`;
  } else if (duration.weeks && duration.weeks > 0) {
    return `${duration.weeks} ${duration.weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (duration.days && duration.days > 0) {
    return `${duration.days} ${duration.days === 1 ? 'day' : 'days'} ago`;
  } else if (duration.hours && duration.hours > 0) {
    return `${duration.hours} ${duration.hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (duration.minutes && duration.minutes > 0) {
    return `${duration.minutes} ${duration.minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return 'just now';
  }
};

interface CommentItemProps {
  comment: CommentType;
  onDelete?: (commentId: string) => void;
}

export function CommentItem({ comment, onDelete }: CommentItemProps) {
  const { user } = useAuth();
  const isAuthor = user?.id === comment.author.id;
  const firstName = getFirstName(comment.author.name);

  return (
    <div className="flex gap-3 py-3">
      <Avatar className="h-8 w-8 ring-1 ring-yellow-500/30 shrink-0">
        <AvatarImage src={comment.author.avatarUrl} alt={firstName} />
        <AvatarFallback className="bg-yellow-100 text-yellow-600">
          {firstName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="min-w-[80px]">
            <p className="text-sm font-medium leading-none text-left">{firstName}</p>
            <div className="flex items-center text-xs text-muted-foreground text-left space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(comment.createdAt)}</span>
            </div>
            
            <div className="mt-2 text-sm text-muted-foreground">
              {comment.content}
            </div>
          </div>
          
          {isAuthor && onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(comment.id)}
              className="h-8 w-8 p-0 ml-2 hover:bg-yellow-500/10 text-neutral-900"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
