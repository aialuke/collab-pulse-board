
import { useEffect, useMemo } from 'react';
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
  // Memoize the filtered and sorted result
  const sortedFeedback = useMemo(() => {
    // Apply sorting only, without filtering
    let result = [...feedback];
    
    // Sort by date (newest first)
    result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return result;
  }, [feedback]);

  // Update filtered feedback when the sorted result changes
  useEffect(() => {
    setFilteredFeedback(sortedFeedback);
  }, [sortedFeedback, setFilteredFeedback]);
}
