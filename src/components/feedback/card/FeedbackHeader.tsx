
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow, formatDuration, intervalToDuration } from 'date-fns';
import { Clock, MoreVertical } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { FeedbackType } from '@/types/feedback';
import { Badge } from '@/components/ui/badge';
import { getFirstName } from '@/services/feedback/mappers';

// Custom function to format time without "about" prefix
export const formatTimeAgo = (date: Date): string => {
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

interface FeedbackHeaderProps {
  feedback: FeedbackType;
  dropdownTriggerRef?: React.RefObject<HTMLButtonElement>;
}

export function FeedbackHeader({ feedback, dropdownTriggerRef }: FeedbackHeaderProps) {
  const firstName = getFirstName(feedback.author.name);
  const isManager = feedback.author.role === 'manager' || feedback.author.role === 'admin';
  
  return (
    <div className="flex items-start justify-between space-y-0 pb-2 w-full">
      <div className="flex items-center space-x-2">
        <Avatar className={`h-8 w-8 ${isManager ? 'ring-1 ring-royal-blue-500/30' : 'ring-1 ring-yellow-500/30'}`}>
          <AvatarImage src={feedback.author.avatarUrl} alt={firstName} />
          <AvatarFallback className={isManager ? "bg-royal-blue-100 text-royal-blue-600" : "bg-yellow-100 text-yellow-600"}>
            {firstName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start min-w-[80px]">
          <p className="text-sm font-medium leading-none text-left">{firstName}</p>
          <div className="flex items-center text-xs text-muted-foreground text-left space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(feedback.createdAt)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {isManager ? 
          <LeaderBadge /> : 
          <CategoryBadge category={feedback.category} />
        }
        <DropdownMenuTrigger asChild>
          <Button 
            ref={dropdownTriggerRef}
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-royal-blue-500/10 text-neutral-700"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </div>
    </div>
  );
}

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return <Badge variant="category">{category}</Badge>;
}

export function LeaderBadge() {
  return <Badge className="bg-royal-blue-500/20 text-royal-blue-600 border-royal-blue-500/30">Leader</Badge>;
}
