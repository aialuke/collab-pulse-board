
// Import the correct type for Vite server options
import type { ServerOptions } from 'vite';

// Server configuration
export const configureServer = (): ServerOptions => {
  return {
    host: "::", // Listen on all IPv6 interfaces
    hmr: {
      overlay: false, // Disable HMR overlay for better performance
    },
    cors: true,
    // Set appropriate cache control headers
    // Format: pattern -> header -> value
    headers: {
      // Static assets with hash-based filenames (immutable)
      '*.js': {
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
      '*.css': {
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
      // Image assets
      '*.png': {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400'
      },
      '*.jpg': {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400'
      },
      '*.jpeg': {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400'
      },
      '*.gif': {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400'
      },
      '*.webp': {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400'
      },
      '*.svg': {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400'
      },
      // PWA manifest
      'manifest.webmanifest': {
        'Cache-Control': 'public, max-age=86400'
      },
      // Service worker - no caching
      'sw.js': {
        'Cache-Control': 'public, max-age=0, must-revalidate'
      },
      // Default for all other files
      '**': {
        'Cache-Control': 'public, max-age=3600'
      }
    }
  };
};
