
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error information for debugging
    console.error('Caught error in ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI or default error message
      return this.props.fallback || (
        <div className="p-4 border border-red-300 rounded-md bg-red-50 text-red-800">
          <h3 className="font-medium">Something went wrong</h3>
          <p className="text-sm">{this.state.error?.message || 'An unknown error occurred'}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
