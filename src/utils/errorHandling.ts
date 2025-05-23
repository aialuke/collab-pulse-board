
import { toast } from '@/components/ui/use-toast';

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

interface ErrorHandlerOptions {
  silent?: boolean;
  severity?: ErrorSeverity;
  context?: string;
  userMessage?: string;
}

interface EnhancedError extends Error {
  severity: ErrorSeverity;
}

/**
 * Standard error handler function to handle errors consistently across the application
 */
export function handleError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): EnhancedError {
  const {
    silent = false,
    severity = ErrorSeverity.ERROR,
    context = 'Application',
    userMessage
  } = options;
  
  // Convert to Error object if it's not already
  const errorObject: Error = error instanceof Error ? error : new Error(String(error));
  
  // Format the error message with context
  const formattedMessage = `[${context}] ${errorObject.message}`;
  
  // Add severity to the error object
  const enhancedError = Object.assign(errorObject, { severity }) as EnhancedError;
  
  // Log error with appropriate severity
  switch (severity) {
    case ErrorSeverity.INFO:
      console.info(formattedMessage, error);
      break;
    case ErrorSeverity.WARNING:
      console.warn(formattedMessage, error);
      break;
    case ErrorSeverity.CRITICAL:
      console.error('CRITICAL ERROR:', formattedMessage, error);
      break;
    case ErrorSeverity.ERROR:
    default:
      console.error(formattedMessage, error);
  }
  
  // Show toast notification if not silent - use imported toast function
  if (!silent) {
    toast({
      title: severity === ErrorSeverity.CRITICAL ? "Critical Error" : "Error",
      description: userMessage || errorObject.message || "An unexpected error occurred",
      variant: "destructive",
    });
  }
  
  return enhancedError;
}

/**
 * Wrap an async function with standardized error handling
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw handleError(error, options);
  }
}
