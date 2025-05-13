
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusSquare } from 'lucide-react';

export function FeedbackEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 bg-white rounded-lg border border-neutral-200 gradient-border">
      <p className="text-base sm:text-lg text-muted-foreground mb-3 sm:mb-4">No feedback found</p>
      <Button asChild className="bg-gradient-yellow hover:shadow-glow text-neutral-900">
        <Link to="/create">
          <PlusSquare className="mr-2 h-4 w-4" />
          Share Your Feedback
        </Link>
      </Button>
    </div>
  );
}
