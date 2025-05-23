
import React from 'react';
import { 
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Flag, Trash2, Share2 } from '@/components/icons';

interface FeedbackDropdownMenuProps {
  feedbackId: string;
  isManager: boolean;
  isAuthor?: boolean;
  onReport: (id: string) => void;
  onDelete?: (id: string) => void;
  onRepost?: () => void;
}

export function FeedbackDropdownMenu({ 
  feedbackId, 
  isManager, 
  isAuthor = false,
  onReport,
  onDelete,
  onRepost
}: FeedbackDropdownMenuProps) {
  return (
    <>
      {isManager && onRepost && (
        <>
          <DropdownMenuItem
            onClick={onRepost}
            className="hover:bg-royal-blue-500/10 text-royal-blue-600"
          >
            <Share2 className="mr-2 h-4 w-4" />
            <span>Repost as Leader</span>
          </DropdownMenuItem>
          <Separator className="bg-neutral-200" />
        </>
      )}
      
      {(isAuthor || isManager) && onDelete && (
        <>
          <DropdownMenuItem 
            onClick={() => onDelete(feedbackId)}
            className="hover:bg-red-700/10 text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
          <Separator className="bg-neutral-200" />
        </>
      )}
      
      <DropdownMenuItem 
        onClick={() => onReport(feedbackId)}
        className="hover:bg-blue-700/10"
      >
        <Flag className="mr-2 h-4 w-4" />
        <span>Report</span>
      </DropdownMenuItem>
    </>
  );
}
