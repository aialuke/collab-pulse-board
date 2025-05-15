
import { useState, useCallback, useRef, useEffect } from 'react';

interface UsePaginationOptions<T = any> {
  pageSize?: number;
  initialData?: T[];  // Add initialData property to the interface
}

export function usePagination<T>({ pageSize = 10, initialData = [] }: UsePaginationOptions<T> = {}) {
  const [page, setPage] = useState<number>(1);
  const [items, setItems] = useState<T[]>(initialData); // Initialize with initialData if provided
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add a state for total items count
  const [total, setTotal] = useState<number>(0);

  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Reset function to clear items and reset page
  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(false);
    setError(null);
    setTotal(0);
  }, []);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
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
