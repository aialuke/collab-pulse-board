
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FeedbackCardContainer } from '@/components/feedback/card/FeedbackCardContainer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { FeedbackType } from '@/types/feedback';
import { fetchFeedbackById, toggleUpvote, reportFeedback } from '@/services/feedbackService';
import { deleteFeedback } from '@/services/feedback/deleteFeedbackService';
import { useAuth } from '@/contexts/AuthContext';
import { RepostDialog } from '@/components/feedback/repost/RepostDialog';
import { RepostProvider, useRepost } from '@/contexts/RepostContext';

function FeedbackDetailContent() {
  const { id } = useParams<{ id: string }>();
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    repostDialogOpen,
    feedbackToRepost,
    openRepostDialog,
    closeRepostDialog,
    handleRepost
  } = useRepost();
  
  const isManager = user?.role === 'manager' || user?.role === 'admin';

  useEffect(() => {
    const loadFeedback = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await fetchFeedbackById(id);
        setFeedback(data);
      } catch (error) {
        console.error('Error loading feedback:', error);
        setError('Failed to load feedback. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load feedback. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedback();
  }, [id, toast]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleUpvote = async (id: string) => {
    if (!feedback) return;
    
    try {
      await toggleUpvote(id);
      setFeedback(prev => {
        if (!prev) return prev;
        // Only increment upvote if not already upvoted
        return {
          ...prev,
          isUpvoted: true, // Always set to true, can't un-upvote
          upvotes: !prev.isUpvoted ? prev.upvotes + 1 : prev.upvotes,
        };
      });
    } catch (error: any) {
      console.error('Error upvoting feedback:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update upvote. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleReport = async (id: string) => {
    try {
      await reportFeedback(id);
      toast({
        title: 'Report submitted',
        description: 'Thank you for your report. Our team will review it.',
      });
    } catch (error) {
      console.error('Error reporting feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFeedback(id);
      
      toast({
        title: "Feedback deleted",
        description: "Your feedback has been permanently deleted.",
      });
      
      // Navigate back to the home page after deletion
      navigate('/');
    } catch (error) {
      console.error(`Error deleting feedback ${id}:`, error);
      toast({
        title: "Error",
        description: "Failed to delete feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-8">
        <p className="text-center text-lg text-muted-foreground">Loading feedback...</p>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="container max-w-3xl mx-auto py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={handleGoBack} className="hover:bg-yellow-500/10">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="bg-[#16181c] rounded-lg border border-red-600/30 p-8 text-center">
          <p className="text-lg text-red-400 mb-4">{error || 'Feedback not found'}</p>
          <Button onClick={handleGoBack} className="bg-gradient-yellow hover:shadow-glow text-black">
            <RefreshCw className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={handleGoBack} className="hover:bg-yellow-500/10">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <FeedbackCardContainer
        feedback={feedback}
        onUpvote={handleUpvote}
        onReport={handleReport}
        onDelete={handleDelete}
        onRepost={isManager ? (id) => openRepostDialog(feedback) : undefined}
      />
    </div>
  );
}

export default function FeedbackDetailPage() {
  const navigate = useNavigate();

  const handleRepostSuccess = () => {
    // Navigate back to the home page to see the repost
    navigate('/');
  };

  return (
    <RepostProvider onRepostSuccess={handleRepostSuccess}>
      <FeedbackDetailContent />
    </RepostProvider>
  );
}
