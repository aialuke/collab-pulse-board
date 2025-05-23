
import React, { lazy, ComponentType } from 'react';

/**
 * Creates a lazily loaded component with a specified chunk name
 * @param importFunc - Dynamic import function
 * @param chunkName - Webpack chunk name for better debugging
 * @param fallback - Optional custom fallback component
 */
export function lazyWithChunkName<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  chunkName: string
): React.LazyExoticComponent<T> {
  // Add a displayName to help with debugging
  const LazyComponent = lazy(importFunc);
  
  // TypeScript doesn't allow direct assignment to LazyExoticComponent properties
  // So we use this trick to set the displayName
  Object.defineProperty(LazyComponent, 'displayName', {
    value: `Lazy(${chunkName})`,
    writable: false
  });
  
  return LazyComponent;
}

/**
 * Creates a named export lazy component
 * @param importFunc - Dynamic import function
 * @param chunkName - Webpack chunk name
 * @param exportName - Name of the export to extract
 */
export function lazyWithNamedExport<T extends ComponentType<any>>(
  importFunc: () => Promise<{ [key: string]: T }>,
  chunkName: string,
  exportName: string
): React.LazyExoticComponent<T> {
  // Cast the module export to the correct type explicitly
  const LazyComponent = lazy(() => 
    importFunc().then(module => {
      // Type assertion to ensure we're getting the right component type
      const exportedComponent = module[exportName] as T;
      return { default: exportedComponent };
    })
  );
  
  Object.defineProperty(LazyComponent, 'displayName', {
    value: `Lazy(${chunkName}/${exportName})`,
    writable: false
  });
  
  return LazyComponent;
}

/**
 * Preload a lazily loaded component
 * @param importFunc - The same import function used to create the lazy component
 */
export function preloadComponent(importFunc: () => Promise<any>): void {
  // Execute the import function to start loading the chunk
  importFunc().catch(err => {
    console.error('Failed to preload component:', err);
  });
}

/**
 * Split the bundle for a specific UI component
 * More specific than route-level splitting
 */
export function createUIComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  componentName: string
): React.LazyExoticComponent<T> {
  return lazyWithChunkName(
    importFunc, 
    `ui-${componentName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  );
}
