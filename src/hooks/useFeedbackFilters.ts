
import { useState } from 'react';

// This is now a minimal placeholder as we've removed filtering functionality
export function useFeedbackFilters() {
  const [filters] = useState({
    search: '',
    category: 'all-categories',
    status: 'all-statuses',
    sortBy: 'newest',
  });

  const updateFilters = () => {
    // No-op function as we've removed filtering
    console.log('Filtering has been removed from the application');
  };

  return {
    filters,
    updateFilters
  };
}
