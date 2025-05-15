import { QueryClient } from "@tanstack/react-query";

/**
 * Optimized React Query client configuration
 * Uses staggered cache settings and efficient strategies to reduce database load
 */
export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute (data considered fresh)
      gcTime: 5 * 60 * 1000, // 5 minutes (unused data kept in memory)
      retry: (failureCount, error) => {
        // Only retry once for most errors
        if (failureCount > 1) return false;
        
        // Don't retry for certain types of errors
        if (error instanceof Error) {
          // Don't retry for 404s, 401s or validation errors
          if (
            error.message.includes('404') || 
            error.message.includes('401') ||
            error.message.includes('validation') ||
            error.message.includes('not found')
          ) {
            return false;
          }
        }
        return true;
      },
      retryDelay: attemptIndex => Math.min(1000 * (2 ** attemptIndex), 30000), // Exponential backoff capped at 30s
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      
      /**
       * Select function to transform data before caching
       * This allows us to normalize data structure across different endpoints
       */
      select: (data) => {
        // If data already has the right shape, return it
        if (data && typeof data === 'object' && 'items' in data) {
          return data;
        }
        // If data is an array, normalize it to {items: [...]}
        if (Array.isArray(data)) {
          return { items: data, hasMore: false, total: data.length };
        }
        // Otherwise return as is
        return data;
      }
    },
    mutations: {
      retry: 1, // Only retry mutations once
      retryDelay: 1000, // 1 second delay between retries
      // Use optimistic updates where possible
      // This makes the UI feel more responsive
      onMutate: (variables) => {
        // Return context that will be passed to onError/onSettled
        return { timestamp: Date.now() };
      },
    },
  },
});
