
import React from 'react';
import { 
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Flag, Trash2, Share2 } from '@/components/icons';

export interface FeedbackDropdownMenuProps {
  /** Unique identifier for the feedback */
  feedbackId: string;
  /** Whether the current user is a manager */
  isManager: boolean;
  /** Whether the current user is the author of the feedback */
  isAuthor?: boolean;
  /** Handler function for reporting feedback */
  onReport: (id: string) => void;
  /** Handler function for deleting feedback */
  onDelete?: (id: string) => void;
  /** Handler function for reposting feedback */
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
  const handleDelete = () => {
    if (onDelete) {
      onDelete(feedbackId);
    }
  };

  const handleReport = () => {
    onReport(feedbackId);
  };

  const handleRepost = () => {
    if (onRepost) {
      onRepost();
    }
  };

  return (
    <>
      {isManager && onRepost && (
        <>
          <DropdownMenuItem
            onClick={handleRepost}
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
            onClick={handleDelete}
            className="hover:bg-red-700/10 text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
          <Separator className="bg-neutral-200" />
        </>
      )}
      
      <DropdownMenuItem 
        onClick={handleReport}
        className="hover:bg-blue-700/10"
      >
        <Flag className="mr-2 h-4 w-4" />
        <span>Report</span>
      </DropdownMenuItem>
    </>
  );
}
