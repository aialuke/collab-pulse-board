
import { useState } from 'react';

// Simplified version of the hook with no filtering functionality
export function useFeedbackFilters() {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    sortBy: 'newest',
  });

  // No-op function as we've removed filtering
  const updateFilters = () => {
    console.log('Filtering has been removed from the application');
  };

  // Return a simplified interface that matches what's expected by components
  return {
    filters,
    updateFilters,
    selectedCategory: 'all',
    selectedStatus: 'all'
  };
}
