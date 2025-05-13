
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RepostCard } from '../card/RepostCard';
import { FeedbackType } from '@/types/feedback';
import { useToast } from '@/components/ui/use-toast';
import { Share2 } from 'lucide-react';

interface RepostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: FeedbackType;
  onRepost: (id: string, comment: string) => Promise<any>;
}

export function RepostDialog({ isOpen, onClose, feedback, onRepost }: RepostDialogProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRepost = async () => {
    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please add a comment to your repost.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onRepost(feedback.id, comment);
    } catch (error) {
      console.error('Error reposting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to repost feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setComment(''); // Reset the comment field
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2 text-royal-blue-600" />
            Repost as Leader
          </DialogTitle>
          <DialogDescription>
            Add your insights when sharing this feedback with your team.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your comment or insights to this repost..."
            className="min-h-24"
          />
          
          <div className="pt-2">
            <p className="text-sm text-neutral-600 mb-2">Original feedback:</p>
            <RepostCard feedback={feedback} />
          </div>
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button 
            variant="default" 
            onClick={handleRepost} 
            disabled={isSubmitting} 
            className="bg-royal-blue-600 hover:bg-royal-blue-700 text-white"
          >
            {isSubmitting ? 'Reposting...' : 'Repost'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
