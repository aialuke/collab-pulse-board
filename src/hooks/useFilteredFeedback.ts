
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
    // Apply filters and sorting
    let result = [...feedback];
    
    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'upvotes':
          return b.upvotes - a.upvotes;
        default:
          return 0;
      }
    });
    
    setFilteredFeedback(result);
  }, [feedback, filters, setFilteredFeedback]);
}
