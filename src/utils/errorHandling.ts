
import { toast } from '@/hooks/use-toast';

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

// Create a non-hook based notification function for class components
export const showErrorNotification = (title: string, description: string, variant: "default" | "destructive" = "destructive") => {
  // Directly log to console - this is always safe
  console.error(`${title}: ${description}`);
  
  // Use a safe version of toast that doesn't depend on hooks
  // The toast function is designed to work outside of React components now
  try {
    toast({
      title,
      description,
      variant
    });
  } catch (err) {
    console.error('Failed to show error notification:', err);
    
    // Fallback: Create a custom event that the Toaster component can listen for
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('app-error', { 
        detail: { title, description, variant } 
      });
      window.dispatchEvent(event);
    }
  }
};

/**
 * Standard error handler function to handle errors consistently across the application
 */
export function handleError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): Error {
  const {
    silent = false,
    severity = ErrorSeverity.ERROR,
    context = 'Application',
    userMessage
  } = options;
  
  // Convert to Error object if it's not already
  const errorObject = error instanceof Error ? error : new Error(String(error));
  
  // Format the error message with context
  const formattedMessage = `[${context}] ${errorObject.message}`;
  
  // Add severity to the error object
  const enhancedError = Object.assign(Object.create(Object.getPrototypeOf(errorObject)), errorObject, { severity });
  
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
  
  // Use safe notification function
  if (!silent) {
    showErrorNotification(
      severity === ErrorSeverity.CRITICAL ? "Critical Error" : "Error",
      userMessage || errorObject.message || "An unexpected error occurred",
    );
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
