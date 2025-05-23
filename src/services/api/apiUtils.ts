
import { toastService } from '@/services/toastService';
import { handleError, ErrorSeverity, withErrorHandling } from '@/utils/errorHandling';

/**
 * Standard error handling for API calls
 * Provides consistent error logging and user feedback
 */
export async function handleApiError<T>(
  promise: Promise<T> | (() => Promise<T>), 
  errorMessage: string = "An error occurred. Please try again."
): Promise<T> {
  try {
    // If promise is a function, call it to get the actual Promise
    const actualPromise = typeof promise === 'function' ? promise() : promise;
    return await actualPromise;
  } catch (error) {
    // Use the standardized error handling utility
    throw handleError(error, {
      context: 'API',
      userMessage: errorMessage,
      severity: ErrorSeverity.ERROR
    });
  }
}

/**
 * Wrapper for API calls that need toast notifications on success
 */
export async function withSuccessToast<T>(
  promise: Promise<T> | (() => Promise<T>),
  successMessage: string,
  errorMessage: string = "An error occurred. Please try again."
): Promise<T> {
  try {
    // If promise is a function, call it to get the actual Promise
    const actualPromise = typeof promise === 'function' ? promise() : promise;
    const result = await actualPromise;
    
    // Use the safe toast service
    toastService.success(successMessage);
    
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
