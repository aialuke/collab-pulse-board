
import { toast } from '@/hooks/use-toast';

/**
 * Standard error handling for API calls
 * Provides consistent error logging and user feedback
 */
export async function handleApiError<T>(
  promise: Promise<T>, 
  errorMessage: string = "An error occurred. Please try again."
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error(`API Error: ${errorMessage}`, error);
    
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    throw error;
  }
}

/**
 * Wrapper for API calls that need toast notifications on success
 */
export async function withSuccessToast<T>(
  promise: Promise<T>,
  successMessage: string,
  errorMessage: string = "An error occurred. Please try again."
): Promise<T> {
  try {
    const result = await promise;
    
    toast({
      title: "Success",
      description: successMessage,
    });
    
    return result;
  } catch (error) {
    return handleApiError(Promise.reject(error), errorMessage);
  }
}

/**
 * Type for standard API response
 */
export interface ApiResponse<T> {
  data: T;
  error: null | string;
}
