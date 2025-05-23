
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FeedbackType } from '@/types/feedback';
import { repostFeedback } from '@/services/feedback/repostService';
import { useAuth } from './AuthContext';

interface RepostContextType {
  repostDialogOpen: boolean;
  feedbackToRepost: FeedbackType | null;
  openRepostDialog: (feedback: FeedbackType) => void;
  closeRepostDialog: () => void;
  handleRepost: (id: string, comment: string) => Promise<FeedbackType>;
}

interface RepostProviderProps {
  children: ReactNode;
  onRepostSuccess?: (feedback: FeedbackType) => void;
}

const RepostContext = createContext<RepostContextType | undefined>(undefined);

export function useRepost(): RepostContextType {
  const context = useContext(RepostContext);
  if (!context) {
    throw new Error('useRepost must be used within a RepostProvider');
  }
  return context;
}

export function RepostProvider({ children, onRepostSuccess }: RepostProviderProps): JSX.Element {
  const [repostDialogOpen, setRepostDialogOpen] = useState(false);
  const [feedbackToRepost, setFeedbackToRepost] = useState<FeedbackType | null>(null);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const isManager = user?.role === 'manager' || user?.role === 'admin';

  const openRepostDialog = (feedback: FeedbackType): void => {
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

  const closeRepostDialog = (): void => {
    setRepostDialogOpen(false);
    setFeedbackToRepost(null);
  };

  const handleRepost = async (id: string, comment: string): Promise<FeedbackType> => {
    if (!isAuthenticated || !isManager) {
      const error = new Error("Permission denied");
      toast({
        title: "Permission denied",
        description: "Only managers can repost feedback.",
        variant: "destructive",
      });
      throw error;
    }

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
      
      closeRepostDialog();
      return repostedFeedback;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to repost feedback. Please try again.";
      console.error(`Error reposting feedback ${id}:`, error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value: RepostContextType = {
    repostDialogOpen,
    feedbackToRepost,
    openRepostDialog,
    closeRepostDialog,
    handleRepost
  };

  return <RepostContext.Provider value={value}>{children}</RepostContext.Provider>;
}
