
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Home, RefreshCw } from 'lucide-react';

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

function FallbackComponent({ error }: { error: Error | null }) {
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const handleRetry = () => {
    window.location.reload();
  };
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Alert variant="destructive" className="mb-6">
        <div className="w-full">
          <AlertTitle className="text-lg font-semibold mb-2">
            Something went wrong
          </AlertTitle>
          <AlertDescription>
            <p className="text-sm mb-4">{error?.message || "An unexpected error occurred"}</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="flex items-center border-red-600 text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Try Again
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleGoHome}
                className="flex items-center"
              >
                <Home className="mr-2 h-3.5 w-3.5" />
                Go to Homepage
              </Button>
            </div>
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}

export function RouteErrorBoundary({ children }: RouteErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={({ error }) => <FallbackComponent error={error} />}
      onError={(error) => {
        console.error("Route error:", error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
