
import { QueryClient } from "@tanstack/react-query";

/**
 * Basic React Query client configuration
 * Uses minimal settings for reduced bundle size
 */
export const createBasicQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Advanced React Query client configuration with error handling
 * and retry logic for more complex applications
 */
export const createAdvancedQueryClient = () => new QueryClient({
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

// Export the createQueryClient function for backward compatibility
// This now uses the simpler configuration by default
export const createQueryClient = createBasicQueryClient;
