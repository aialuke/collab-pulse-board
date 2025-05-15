
import React, { Suspense, lazy } from 'react';
import { LucideProps } from 'lucide-react';
import { Loader2 } from '@/components/icons';

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

// Icon loading fallback
const IconFallback = () => (
  <div className="w-4 h-4 flex items-center justify-center">
    <Loader2 className="h-3 w-3 animate-spin" />
  </div>
);

export function LazyIcon({ name, ...props }: IconProps) {
  // Dynamically import the icon
  const ImportedIconRef = React.useRef<React.ComponentType<LucideProps>>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setError(false);
    
    // Import the icon dynamically
    import('lucide-react')
      .then((module) => {
        const IconComponent = module[name as keyof typeof module] as React.ComponentType<LucideProps>;
        ImportedIconRef.current = IconComponent;
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error loading icon: ${name}`, err);
        setError(true);
        setLoading(false);
      });
  }, [name]);

  if (error) return null;
  if (loading || !ImportedIconRef.current) return <IconFallback />;
  
  const IconComponent = ImportedIconRef.current;
  return <IconComponent {...props} />;
}
