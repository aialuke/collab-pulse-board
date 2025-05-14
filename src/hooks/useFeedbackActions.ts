
import { FeedbackType } from '@/types/feedback';
import { toggleUpvote, reportFeedback } from '@/services/feedbackService';
import { deleteFeedback } from '@/services/feedback/deleteFeedbackService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useFeedbackActions(
  setFeedback: React.Dispatch<React.SetStateAction<FeedbackType[]>>
) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleUpvote = async (id: string) => {
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
    } catch (error: any) {
      console.error(`Error upvoting feedback ${id}:`, error);
      toast({
        title: "Error",
        description: error.message || "Failed to update upvote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReport = async (id: string) => {
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

  const handleDelete = async (id: string) => {
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
