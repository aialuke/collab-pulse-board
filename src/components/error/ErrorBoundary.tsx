
import React from 'react';
import { ToastAction } from '@/components/ui/toast';
import { ErrorDisplay } from './ErrorDisplay';

// Create a toast queue for errors that will be shown when the component mounts
let errorQueue: { title: string; description: string }[] = [];

// Function to add toast to queue instead of directly showing it
export function queueErrorToast(message: string) {
  errorQueue.push({
    title: "An error occurred",
    description: message || "The application encountered an unexpected error"
  });
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { 
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Queue the toast notification instead of directly showing it
    queueErrorToast(error.message);
    
    // Call the onError prop if it exists
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false,
      error: null
    });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        // Just return the fallback directly
        return this.props.fallback;
      }
      
      return (
        <ErrorDisplay 
          error={this.state.error} 
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}
