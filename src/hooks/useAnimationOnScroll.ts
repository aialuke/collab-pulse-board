
import { useRef, useEffect, useState } from 'react';

interface UseAnimationOnScrollOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  disabled?: boolean;
}

/**
 * Custom hook to apply a class when an element is in viewport
 * @param options Configuration options
 * @returns Object containing ref to be attached to the element and boolean indicating visibility
 */
export function useAnimationOnScroll({
  threshold = 0.1,
  rootMargin = '0px',
  once = true,
  disabled = false
}: UseAnimationOnScrollOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false
  );

  useEffect(() => {
    // Skip if animations are disabled or if the user prefers reduced motion
    if (disabled || prefersReducedMotion.current) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // If once is true, disconnect the observer after triggering once
          if (once && observerRef.current) {
            observerRef.current.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    // Start observing
    observerRef.current.observe(element);

    // Cleanup on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, once, disabled]);

  return { ref: elementRef, isVisible };
}
