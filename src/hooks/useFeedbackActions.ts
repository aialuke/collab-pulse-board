
import { FeedbackType } from '@/types/feedback';
import { toggleUpvote, reportFeedback, deleteFeedback } from '@/services/feedbackService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface FeedbackActions {
  handleUpvote: (id: string) => Promise<void>;
  handleReport: (id: string) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

export function useFeedbackActions(
  setFeedback: React.Dispatch<React.SetStateAction<FeedbackType[]>>
): FeedbackActions {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleUpvote = async (id: string): Promise<void> => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to upvote feedback.",
        variant: "destructive",
      });
      return;
    }

    try {
      await toggleUpvote(id);
      
      // Update local state to reflect the upvote change
      setFeedback(prev => 
        prev.map(item => 
          item.id === id 
            ? { 
                ...item, 
                isUpvoted: true, // Always set to true, can't un-upvote
                upvotes: !item.isUpvoted ? item.upvotes + 1 : item.upvotes 
              } 
            : item
        )
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update upvote. Please try again.";
      console.error(`Error upvoting feedback ${id}:`, error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleReport = async (id: string): Promise<void> => {
    try {
      await reportFeedback(id);
      toast({
        title: "Report submitted",
        description: "Thank you for your report. Our team will review it.",
      });
    } catch (error) {
      console.error(`Error reporting feedback ${id}:`, error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteFeedback(id);
      
      // Update local state to remove the deleted feedback item
      setFeedback(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Feedback deleted",
        description: "Your feedback has been permanently deleted.",
      });
    } catch (error) {
      console.error(`Error deleting feedback ${id}:`, error);
      toast({
        title: "Error",
        description: "Failed to delete feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleUpvote,
    handleReport,
    handleDelete
  };
}
