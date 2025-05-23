
import React from 'react';

export function FeedbackLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-8 md:py-12 bg-white rounded-lg border border-neutral-200 mt-4">
      <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-teal-500 mb-3 sm:mb-4"></div>
      <p className="text-sm sm:text-base md:text-lg text-muted-foreground">Loading feedback...</p>
    </div>
  );
}
