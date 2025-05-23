
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Import the error queue
let errorQueue: { title: string; description: string }[] = [];

// Reexport the queue function to be available from this component
export function queueErrorToast(message: string) {
  errorQueue.push({
    title: "An error occurred",
    description: message || "The application encountered an unexpected error"
  });
}

/**
 * Component that should be mounted high in the React tree
 * to handle displaying error toasts from anywhere in the app
 */
export function ToastErrorHandler() {
  const { toast } = useToast();
  
  useEffect(() => {
    // Process any queued toasts on mount
    if (errorQueue.length > 0) {
      errorQueue.forEach(error => {
        toast({
          title: error.title,
          description: error.description,
          variant: "destructive",
        });
      });
      
      // Clear the queue after processing
      errorQueue = [];
    }
    
    // Set up a global error handler for uncaught errors
    const handleGlobalError = (event: ErrorEvent) => {
      toast({
        title: "Unexpected error",
        description: event.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      // Prevent default browser error handling
      event.preventDefault();
    };
    
    // Add global error handler
    window.addEventListener('error', handleGlobalError);
    
    // Cleanup
    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, [toast]);
  
  return null; // This component doesn't render anything
}
