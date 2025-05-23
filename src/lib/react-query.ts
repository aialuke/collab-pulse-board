
import { QueryClient } from "@tanstack/react-query";

/**
 * Advanced React Query client configuration
 * Uses staggered cache settings and efficient strategies to reduce database load
 */
export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time defines how long data is considered fresh
      // Higher stale time means less refetches and better performance
      staleTime: 60 * 1000, // 1 minute (data considered fresh)
      
      // GC time is how long inactive data stays in memory
      // Higher gc time improves UX for back navigation
      gcTime: 10 * 60 * 1000, // 10 minutes (unused data kept in memory)
      
      // Intelligent retry logic
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
            error.message.includes('not found') ||
            error.message.includes('permission denied')
          ) {
            return false;
          }
        }
        
        // For network errors or server errors, retry
        return true;
      },
      
      // Exponential backoff capped at 30s
      retryDelay: attemptIndex => Math.min(1000 * (2 ** attemptIndex), 30000),
      
      // Don't refetch when window regains focus
      // This prevents unnecessary refetches when user switches tabs
      refetchOnWindowFocus: false,
      
      // Don't refetch on reconnect as data is usually still fresh
      refetchOnReconnect: false,
      
      /**
       * Data normalization for consistent structure
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
      // Only retry mutations once to prevent duplicate actions
      retry: 1,
      retryDelay: 1000, // 1 second delay between retries
      
      // Use optimistic updates where possible for better UX
      onMutate: (variables) => {
        // Return context that will be passed to onError/onSettled
        return { timestamp: Date.now() };
      },
      
      // Better error logging for mutations
      onError: (error, variables, context) => {
        console.error(`Mutation error:`, {
          error,
          variables,
          context
        });
      }
    },
  },
});
