
import { useState } from 'react';

// Enhanced version of the hook that provides direct access to selected values
export function useFeedbackFilters() {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    sortBy: 'newest',
  });

  const updateFilters = () => {
    // No-op function as we've removed filtering
    console.log('Filtering has been removed from the application');
  };

  // Add these properties to match what's expected in FeedbackContainer
  return {
    filters,
    updateFilters,
    // Add direct access to individual filter values
    selectedCategory: filters.category,
    selectedStatus: filters.status
  };
}
