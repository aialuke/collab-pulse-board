
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface FeedbackErrorProps {
  error: string;
  onRetry: () => void;
}

export function FeedbackError({ error, onRetry }: FeedbackErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-red-400/30">
      <AlertCircle className="text-red-500 mb-2 h-8 w-8" />
      <p className="text-lg text-red-600 mb-4">{error}</p>
      <Button 
        onClick={onRetry} 
        variant="outline" 
        className="flex items-center border-blue-700 text-blue-700 hover:bg-blue-700/10"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
