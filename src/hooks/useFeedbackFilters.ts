
import { useState } from 'react';

export function useFeedbackFilters() {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all-categories',
    status: 'all-statuses',
    sortBy: 'newest',
  });

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    filters,
    updateFilters
  };
}
