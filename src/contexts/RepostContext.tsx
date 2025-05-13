
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { FeedbackType } from '@/types/feedback';
import { repostFeedback } from '@/services/feedback/repostService';
import { useAuth } from './AuthContext';

interface RepostContextType {
  repostDialogOpen: boolean;
  feedbackToRepost: FeedbackType | null;
  openRepostDialog: (feedback: FeedbackType) => void;
  closeRepostDialog: () => void;
  handleRepost: (id: string, comment: string) => Promise<FeedbackType>;
  isReposting: boolean;
}

const RepostContext = createContext<RepostContextType | undefined>(undefined);

export function useRepost(): RepostContextType {
  const context = useContext(RepostContext);
  if (!context) {
    throw new Error('useRepost must be used within a RepostProvider');
  }
  return context;
}

interface RepostProviderProps {
  children: ReactNode;
  onRepostSuccess?: (feedback: FeedbackType) => void;
}

export function RepostProvider({ children, onRepostSuccess }: RepostProviderProps) {
  const [repostDialogOpen, setRepostDialogOpen] = useState(false);
  const [feedbackToRepost, setFeedbackToRepost] = useState<FeedbackType | null>(null);
  const [isReposting, setIsReposting] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const isManager = user?.role === 'manager' || user?.role === 'admin';

  const openRepostDialog = (feedback: FeedbackType) => {
    if (!isManager) {
      toast({
        title: "Permission denied",
        description: "Only managers can repost feedback.",
        variant: "destructive",
      });
      return;
    }
    
    setFeedbackToRepost(feedback);
    setRepostDialogOpen(true);
  };

  const closeRepostDialog = () => {
    setRepostDialogOpen(false);
    setFeedbackToRepost(null);
  };

  const handleRepost = async (id: string, comment: string): Promise<FeedbackType> => {
    if (!isAuthenticated || !isManager) {
      toast({
        title: "Permission denied",
        description: "Only managers can repost feedback.",
        variant: "destructive",
      });
      throw new Error("Permission denied");
    }

    setIsReposting(true);
    try {
      const repostedFeedback = await repostFeedback(id, comment);
      
      toast({
        title: "Repost successful",
        description: "The feedback has been reposted with your comment.",
      });
      
      // Call the success callback if provided
      if (onRepostSuccess) {
        onRepostSuccess(repostedFeedback);
      }
      
      return repostedFeedback;
    } catch (error) {
      console.error(`Error reposting feedback ${id}:`, error);
      toast({
        title: "Error",
        description: "Failed to repost feedback. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsReposting(false);
      closeRepostDialog();
    }
  };

  const value = {
    repostDialogOpen,
    feedbackToRepost,
    openRepostDialog,
    closeRepostDialog,
    handleRepost,
    isReposting
  };

  return <RepostContext.Provider value={value}>{children}</RepostContext.Provider>;
}
