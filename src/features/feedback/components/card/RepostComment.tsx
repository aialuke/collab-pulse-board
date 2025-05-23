
import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FeedbackType } from '@/types/feedback';
import { formatTimeAgo } from './FeedbackHeader';
import { MoreVertical, RefreshCw } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent
} from '@/components/ui/dropdown-menu';
import { FeedbackDropdownMenu } from './FeedbackDropdownMenu';
import { useAuth } from '@/contexts/AuthContext';

interface RepostCommentProps {
  comment: string;
  author: FeedbackType['author'];
  createdAt: Date;
  feedbackId: string;
  onDelete?: (id: string) => void;
}

export function RepostComment({
  comment,
  author,
  createdAt,
  feedbackId,
  onDelete
}: RepostCommentProps) {
  const isManager = author.role === 'manager' || author.role === 'admin';
  const firstName = author.name.split(' ')[0];
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const { user } = useAuth();
  
  // Check if current user is a manager and the author of this repost
  const currentUserIsManager = user?.role === 'manager' || user?.role === 'admin';
  const isAuthor = user?.id === author.id;
  const showDropdown = currentUserIsManager && isAuthor;
  
  return (
    <div className="flex flex-col px-4 pt-4 pb-2 bg-white w-full rounded-t-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className={`h-8 w-8 ${isManager ? 'ring-1 ring-royal-blue-500/30' : ''}`}>
            <AvatarImage src={author.avatarUrl} alt={firstName} />
            <AvatarFallback className="bg-royal-blue-100 text-royal-blue-600 text-xs">
              {firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <p className="text-sm font-medium leading-none text-left">{firstName}</p>
            <div className="flex items-center text-xs text-muted-foreground text-left space-x-1 mt-1">
              <RefreshCw className="h-3 w-3" />
              <span>{formatTimeAgo(createdAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Only show dropdown for managers who authored the repost */}
        {showDropdown && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                ref={dropdownTriggerRef}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted"
                aria-label="Open menu"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-white border-neutral-200 text-neutral-900">
              <FeedbackDropdownMenu
                feedbackId={feedbackId}
                isManager={true}
                isAuthor={true}
                onDelete={onDelete}
                onReport={() => {}} // Empty function as managers shouldn't report their own posts
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      {/* Add proper left padding to align with the username and icon */}
      <div className="pl-8 sm:pl-10">
        <p className="reply-text mt-1.5 mb-2 text-left text-sm">{comment}</p>
      </div>
    </div>
  );
}
