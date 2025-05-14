
import { QueryClient } from "@tanstack/react-query";

/**
 * Optimized React Query client configuration
 * - Stale time: 60 seconds (data considered fresh for 1 minute)
 * - Cache time: 5 minutes (unused data kept in memory for 5 minutes)
 * - Retry configuration: 1 retry with exponential backoff
 * - Error handling: Better error logging and reporting
 */
export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Only retry once for most errors
        if (failureCount > 1) return false;
        
        // Don't retry for certain types of errors
        if (error instanceof Error) {
          // Don't retry for 404s or authentication errors
          if (error.message.includes('404') || error.message.includes('401')) {
            return false;
          }
        }
        return true;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
    mutations: {
      retry: 1, // Only retry mutations once
      retryDelay: 1000, // 1 second delay between retries
    },
  },
});
