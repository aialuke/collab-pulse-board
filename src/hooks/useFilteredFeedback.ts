
import { useEffect } from 'react';
import { FeedbackType } from '@/types/feedback';

export function useFilteredFeedback(
  feedback: FeedbackType[],
  filters: {
    search: string;
    category: string;
    status: string;
    sortBy: string;
  },
  setFilteredFeedback: React.Dispatch<React.SetStateAction<FeedbackType[]>>
) {
  useEffect(() => {
    // Apply sorting only, without filtering
    let result = [...feedback];
    
    // Sort by date (newest first)
    result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    setFilteredFeedback(result);
  }, [feedback, setFilteredFeedback]);
}
