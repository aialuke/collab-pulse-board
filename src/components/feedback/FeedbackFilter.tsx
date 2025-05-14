
import React from 'react';

export type FilterOptions = {
  search: string;
  category: string;
  status: string;
  sortBy: 'newest' | 'oldest' | 'upvotes' | 'comments';
};

interface FeedbackFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
}

// Empty component as we're not using filters anymore
export function FeedbackFilter({ filters, onFilterChange }: FeedbackFilterProps) {
  return null;
}
