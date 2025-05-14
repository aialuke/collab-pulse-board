
import { useRef, useEffect, useState } from 'react';

interface UseAnimationOnScrollOptions {
  threshold?: number;
  rootMargin?: string;
  disabled?: boolean;
  once?: boolean; // Added this property that was missing
}

/**
 * Simplified animation hook optimized for "once" animation pattern
 */
export function useAnimationOnScroll({
  threshold = 0.1,
  rootMargin = '0px',
  disabled = false,
  once = true // Default to true
}: UseAnimationOnScrollOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false
  );

  useEffect(() => {
    // Skip if animations are disabled or if the user prefers reduced motion
    if (disabled || prefersReducedMotion.current || isVisible) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    // Create observer
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect after triggering if once is true
          if (once) {
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin }
    );

    // Start observing
    observer.observe(element);

    // Cleanup
    return () => observer.disconnect();
  }, [threshold, rootMargin, disabled, isVisible, once]);

  return { ref: elementRef, isVisible };
}
