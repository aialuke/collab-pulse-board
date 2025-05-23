
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: Error | null;
  onReset?: () => void;
  title?: string;
  showReset?: boolean;
}

export function ErrorDisplay({ 
  error, 
  onReset, 
  title = "Something went wrong", 
  showReset = true 
}: ErrorDisplayProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4 mt-1" />
      <div className="ml-2">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          <p className="mb-3">{error?.message || "An unexpected error occurred."}</p>
          {showReset && onReset && (
            <Button 
              variant="outline"
              size="sm" 
              onClick={onReset} 
              className="flex items-center border-red-600 text-red-700 hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Try Again
            </Button>
          )}
        </AlertDescription>
      </div>
    </Alert>
  );
}
