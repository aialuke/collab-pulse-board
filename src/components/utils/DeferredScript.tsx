
import React, { useEffect, useState } from 'react';

interface DeferredScriptProps {
  src: string;
  defer?: boolean;
  async?: boolean;
  onLoad?: () => void;
  id?: string;
  strategy?: 'idle' | 'visible' | 'media' | 'beforeInteractive';
  media?: string;
}

/**
 * A component that intelligently loads scripts based on different strategies
 * - idle: loads during requestIdleCallback
 * - visible: loads when element enters viewport
 * - media: loads based on media query
 * - beforeInteractive: loads immediately but non-blocking
 */
export function DeferredScript({
  src,
  defer = true,
  async = true,
  onLoad,
  id,
  strategy = 'idle',
  media
}: DeferredScriptProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    
    // Function to actually append the script
    const appendScript = () => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = defer;
      script.async = async;
      if (id) script.id = id;
      
      script.onload = () => {
        setLoaded(true);
        if (onLoad) onLoad();
      };
      
      document.body.appendChild(script);
    };
    
    switch (strategy) {
      case 'beforeInteractive':
        // Load immediately, non-blocking
        appendScript();
        break;
        
      case 'idle':
        // Use requestIdleCallback to load during idle time
        if ('requestIdleCallback' in window) {
          // @ts-ignore - TypeScript doesn't recognize requestIdleCallback
          window.requestIdleCallback(() => appendScript(), { timeout: 2000 });
        } else {
          setTimeout(appendScript, 1);
        }
        break;
        
      case 'visible':
        // Use IntersectionObserver to load when in viewport
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            appendScript();
            observer.disconnect();
          }
        });
        
        // Create a dummy element for the observer to watch
        const dummyElement = document.createElement('div');
        dummyElement.style.height = '1px';
        dummyElement.style.width = '1px';
        dummyElement.style.position = 'absolute';
        dummyElement.style.bottom = '0';
        dummyElement.style.left = '0';
        document.body.appendChild(dummyElement);
        observer.observe(dummyElement);
        
        return () => {
          observer.disconnect();
          dummyElement.remove();
        };
        
      case 'media':
        // Only load if media query matches
        if (media && window.matchMedia) {
          const mediaQuery = window.matchMedia(media);
          
          const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches) {
              appendScript();
              if ('removeEventListener' in mediaQuery) {
                mediaQuery.removeEventListener('change', handleChange as any);
              }
            }
          };
          
          // Check initially
          handleChange(mediaQuery);
          
          // Listen for changes
          if ('addEventListener' in mediaQuery) {
            mediaQuery.addEventListener('change', handleChange as any);
            return () => mediaQuery.removeEventListener('change', handleChange as any);
          }
        } else {
          // If no media specified or matchMedia not supported, load normally
          appendScript();
        }
        break;
    }
  }, [src, defer, async, onLoad, id, strategy, media, loaded]);
  
  return null;
}
