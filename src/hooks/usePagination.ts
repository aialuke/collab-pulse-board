
import { useState, useCallback, useRef, useEffect } from 'react';

interface UsePaginationOptions<T = any> {
  pageSize?: number;
  initialData?: T[];
}

export function usePagination<T>({ pageSize = 10, initialData = [] }: UsePaginationOptions<T> = {}) {
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  
  // Create a stable ref object for the sentinel
  const internalObserver = useRef<IntersectionObserver | null>(null);
  const sentinelRefObject = useRef<HTMLElement | null>(null);
  
  // Create a stable callback ref function that will be used as sentinelRef
  const sentinelRef = useCallback((node: HTMLElement | null) => {
    if (isLoading) return;
    
    // Clean up previous observer
    if (internalObserver.current) {
      internalObserver.current.disconnect();
      internalObserver.current = null;
    }
    
    // Store the node in our ref
    sentinelRefObject.current = node;

    // Only create a new observer if we have a node and there's more content to load
    if (node && hasMore) {
      // Create new observer
      internalObserver.current = new IntersectionObserver(entries => {
        // Check if the sentinel element is intersecting
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          // Load more data by incrementing the page
          setPage(prevPage => prevPage + 1);
        }
      });
      
      // Observe the current node
      internalObserver.current.observe(node);
    }
  }, [isLoading, hasMore]);

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (internalObserver.current) {
        internalObserver.current.disconnect();
      }
    };
  }, []);

  // Reset function to clear items and reset page
  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setTotal(0);
  }, []);

  return {
    page,
    items,
    setItems,
    isLoading,
    setIsLoading,
    hasMore,
    setHasMore,
    error,
    setError,
    sentinelRef,
    reset,
    total,
    setTotal
  };
}
