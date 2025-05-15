
import { componentTagger } from "lovable-tagger";
import { PluginOption } from "vite";

// Development-specific configuration
export const configureDevelopment = (): PluginOption => {
  // Add React DevTools setup for development mode
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    // Delay loading React DevTools to improve initial loading performance
    const loadDevTools = () => {
      // This will only be included in development builds
      console.log('Development mode enabled');
    };
    
    // Load after the initial render
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadDevTools, { timeout: 1000 });
    } else {
      setTimeout(loadDevTools, 1000);
    }
  }
  
  // Return the componentTagger plugin for development only
  return componentTagger();
};
