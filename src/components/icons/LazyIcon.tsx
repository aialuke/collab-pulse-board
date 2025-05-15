
import React, { Suspense, lazy, useRef, useState, useEffect, memo } from 'react';
import { LucideProps } from 'lucide-react';
import { Loader2 } from '@/components/icons';

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

// Use a cache to avoid re-importing icons
const iconCache = new Map<string, React.ComponentType<LucideProps>>();

// Icon loading fallback - memoized to avoid re-renders
const IconFallback = memo(() => (
  <div className="w-4 h-4 flex items-center justify-center">
    <Loader2 className="h-3 w-3 animate-spin" />
  </div>
));
IconFallback.displayName = 'IconFallback';

// Create a memoized version of LazyIcon to prevent unnecessary re-renders
export const LazyIcon = memo(({ name, ...props }: IconProps) => {
  // Use refs to track state between renders without causing re-renders
  const ImportedIconRef = useRef<React.ComponentType<LucideProps>>();
  const [loading, setLoading] = useState(iconCache.has(name) ? false : true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Skip loading if we already have this icon in cache
    if (iconCache.has(name)) {
      ImportedIconRef.current = iconCache.get(name);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(false);
    
    // Import the icon dynamically with better error handling
    const importIcon = async () => {
      try {
        const module = await import('lucide-react');
        const IconComponent = module[name as keyof typeof module] as React.ComponentType<LucideProps>;
        
        if (IconComponent) {
          // Store in cache for future use
          iconCache.set(name, IconComponent);
          ImportedIconRef.current = IconComponent;
          setLoading(false);
        } else {
          console.error(`Icon not found: ${name}`);
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Error loading icon: ${name}`, err);
        setError(true);
        setLoading(false);
      }
    };
    
    importIcon();
  }, [name]);

  if (error) return null;
  if (loading || !ImportedIconRef.current) return <IconFallback />;
  
  const IconComponent = ImportedIconRef.current;
  return <IconComponent {...props} />;
});

LazyIcon.displayName = 'LazyIcon';
