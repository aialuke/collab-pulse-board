
import React from 'react';
import { RefreshCw } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useRefresh } from '@/contexts/RefreshContext';

export function RefreshButton() {
  const { isRefreshing, refreshFeedback } = useRefresh();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => refreshFeedback()}
      disabled={isRefreshing}
      className="relative group hover:bg-teal-500 min-h-12 min-w-12 h-12 w-12"
      aria-label="Refresh feed"
    >
      <RefreshCw 
        className={`h-5 w-5 text-teal-500 group-hover:text-white ${isRefreshing ? 'animate-spin' : ''}`} 
      />
    </Button>
  );
}
