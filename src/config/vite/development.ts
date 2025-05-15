
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
interface WindowWithIdleCallback extends Window {
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
        typeof globalThis.window === 'object' && 
        globalThis.window !== null && 
        'requestIdleCallback' in globalThis.window) {
      // Safely cast the window object to our interface with requestIdleCallback
      const win = globalThis.window as unknown as WindowWithIdleCallback;
      win.requestIdleCallback(loadDevTools, { timeout: 1000 });
    } else {
      setTimeout(loadDevTools, 1000);
    }
  }
  
  // Return the componentTagger plugin for development only
  return componentTagger();
};
