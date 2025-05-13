
import React from 'react';
import { CardHeader, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { FeedbackHeader } from './FeedbackHeader';
import { FeedbackContent } from './FeedbackContent';
import { FeedbackDropdownMenu } from './FeedbackDropdownMenu';
import { FeedbackType } from '@/types/feedback';

interface StandardFeedbackProps {
  feedback: FeedbackType;
  isManager: boolean;
  isAuthor: boolean;
  dropdownTriggerRef: React.RefObject<HTMLButtonElement>;
  onReport: (id: string) => void;
  onDelete?: (id: string) => void;
  onRepost?: () => void;
}

export function StandardFeedback({
  feedback,
  isManager,
  isAuthor,
  dropdownTriggerRef,
  onReport,
  onDelete,
  onRepost
}: StandardFeedbackProps) {
  // Don't render anything for reposts - this is now handled by RepostDisplay
  if (feedback.isRepost) {
    return null;
  }
  
  return (
    <>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <DropdownMenu>
          <FeedbackHeader feedback={feedback} dropdownTriggerRef={dropdownTriggerRef} />
          <DropdownMenuContent align="end" className="z-50 bg-white border-neutral-200 text-neutral-900">
            <FeedbackDropdownMenu 
              feedbackId={feedback.id} 
              isManager={isManager} 
              isAuthor={isAuthor}
              onReport={onReport}
              onDelete={onDelete}
              onRepost={onRepost}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="py-0">
        <FeedbackContent feedback={feedback} />
      </CardContent>
    </>
  );
}
