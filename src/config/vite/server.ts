
import { OutgoingHttpHeaders } from 'http';

// Server configuration that returns static headers rather than functions
export const configureServer = () => {
  return {
    host: "::", // Listen on all IPv6 interfaces
    hmr: {
      overlay: false, // Disable HMR overlay for better performance
    },
    cors: true,
    // Use Vite's custom headers format for pattern matching instead of functions
    headers: {
      // Set appropriate cache control headers
      '*.js': {
        'Cache-Control': 'public, max-age=31536000, immutable' // 1 year for hashed assets
      },
      '*.css': {
        'Cache-Control': 'public, max-age=31536000, immutable' // 1 year for hashed assets
      },
      '*.png': {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' // 7 days with 1 day stale
      },
      '*.jpg': {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' // 7 days with 1 day stale
      },
      '*.jpeg': {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' // 7 days with 1 day stale
      },
      '*.gif': {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' // 7 days with 1 day stale
      },
      '*.webp': {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' // 7 days with 1 day stale
      },
      '*.svg': {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400' // 7 days with 1 day stale
      },
      'manifest.webmanifest': {
        'Cache-Control': 'public, max-age=86400' // 1 day for PWA manifest
      },
      'sw.js': {
        'Cache-Control': 'public, max-age=0, must-revalidate' // No caching for service workers
      },
      // Default header applied to all other files
      '**': {
        'Cache-Control': 'public, max-age=3600' // 1 hour default
      }
    } as OutgoingHttpHeaders
  };
};
