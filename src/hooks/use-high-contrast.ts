
import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user has high contrast mode enabled
 * This works for Windows High Contrast Mode and some macOS settings
 * @returns boolean indicating if high contrast mode is enabled
 */
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    // Check if forced-colors media query is supported and active
    const mediaQuery = window.matchMedia('(forced-colors: active)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    // Set initial value
    setIsHighContrast(mediaQuery.matches);

    // Add listener for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return isHighContrast;
}
