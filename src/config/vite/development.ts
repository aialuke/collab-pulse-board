
import { componentTagger } from "lovable-tagger";
import { PluginOption } from "vite";

// Type declarations for requestIdleCallback that are compatible with DOM types
interface RequestIdleCallbackOptions {
  timeout: number;
}

interface RequestIdleCallbackDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

type RequestIdleCallbackHandle = number;

// Interface to type-check window access
interface WindowWithIdleCallback {
  requestIdleCallback: (
    callback: (deadline: RequestIdleCallbackDeadline) => void,
    options?: RequestIdleCallbackOptions
  ) => RequestIdleCallbackHandle;
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
        'window' in globalThis && 
        globalThis.window && 
        'requestIdleCallback' in (globalThis.window as Window & typeof globalThis)) {
      (globalThis.window as unknown as WindowWithIdleCallback).requestIdleCallback(loadDevTools, { timeout: 1000 });
    } else {
      setTimeout(loadDevTools, 1000);
    }
  }
  
  // Return the componentTagger plugin for development only
  return componentTagger();
};

