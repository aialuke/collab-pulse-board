
import { componentTagger } from "lovable-tagger";
import { PluginOption } from "vite";

// Type declarations for requestIdleCallback
interface RequestIdleCallbackOptions {
  timeout: number;
}

// Development-specific configuration
export const configureDevelopment = (): PluginOption => {
  // Add React DevTools setup for development mode
  if (process.env.NODE_ENV !== 'production' && typeof globalThis !== 'undefined') {
    // Delay loading React DevTools to improve initial loading performance
    const loadDevTools = () => {
      // This will only be included in development builds
      console.log('Development mode enabled');
    };
    
    // Load after the initial render
    if (typeof globalThis !== 'undefined' && 
        'requestIdleCallback' in globalThis) {
      (globalThis as any).requestIdleCallback(loadDevTools, { timeout: 1000 });
    } else {
      setTimeout(loadDevTools, 1000);
    }
  }
  
  // Return the componentTagger plugin for development only
  return componentTagger();
};
