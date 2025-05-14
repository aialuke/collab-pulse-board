
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, WifiOff } from 'lucide-react';
import { isOnline } from '@/services/offlineService';

export const FeedbackSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
          <div className="flex items-center mb-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="ml-3 space-y-1.5">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-24 h-3" />
            </div>
          </div>
          <Skeleton className="w-3/4 h-5 mb-2" />
          <Skeleton className="w-full h-20 mb-4" />
          <div className="flex justify-between">
            <Skeleton className="w-20 h-8" />
            <div className="flex space-x-2">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-8 h-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface FeedbackErrorProps {
  message: string;
  onRetry: () => void;
}

export const FeedbackError = ({ message, onRetry }: FeedbackErrorProps) => {
  const online = isOnline();
  
  return (
    <Alert variant="destructive" className="my-4">
      {online ? (
        <AlertCircle className="h-4 w-4 mt-1" />
      ) : (
        <WifiOff className="h-4 w-4 mt-1" />
      )}
      <div className="ml-2">
        <AlertTitle>{online ? 'Error loading feed' : 'You\'re offline'}</AlertTitle>
        <AlertDescription>
          <p className="mb-3">{message}</p>
          <Button 
            variant="outline"
            size="sm" 
            onClick={onRetry} 
            className="flex items-center border-red-600 text-red-700 hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Try Again
          </Button>
        </AlertDescription>
      </div>
    </Alert>
  );
};

export const LoadMoreSentinel = React.forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="py-4 flex justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-500"></div>
    </div>
  );
});
LoadMoreSentinel.displayName = 'LoadMoreSentinel';
