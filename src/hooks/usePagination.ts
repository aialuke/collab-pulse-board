
import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
  threshold?: number;
  rootMargin?: string;
}

export function usePagination<T>({
  initialPage = 1,
  pageSize = 10,
  threshold = 0.1,
  rootMargin = '0px 0px 200px 0px' // Load earlier before reaching bottom
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState<number>(initialPage);
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Reference to the observer
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Reference to the sentinel element
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    // Skip if already loading or no more items
    if (isLoading || !hasMore) return;
    
    // Disconnect previous observer
    if (observer.current) {
      observer.current.disconnect();
    }
    
    // Create new observer
    observer.current = new IntersectionObserver(
      (entries) => {
        // If sentinel is visible and we're not already loading
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold, rootMargin }
    );
    
    // Observe new sentinel
    if (node) {
      observer.current.observe(node);
    }
  }, [isLoading, hasMore, threshold, rootMargin]);
  
  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);
  
  // Reset function to start over from page 1
  const reset = useCallback(() => {
    setPage(initialPage);
    setItems([]);
    setHasMore(true);
    setError(null);
  }, [initialPage]);
  
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
    pageSize,
    reset
  };
}
