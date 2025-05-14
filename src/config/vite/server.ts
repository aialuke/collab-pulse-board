
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
    // Set appropriate cache control headers properly typed for Vite
    headers: {
      // Static assets with hash-based filenames (immutable)
      '*.js': [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ],
      '*.css': [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ],
      // Image assets
      '*.png': [
        {
          key: 'Cache-Control',
          value: 'public, max-age=604800, stale-while-revalidate=86400'
        }
      ],
      '*.jpg': [
        {
          key: 'Cache-Control',
          value: 'public, max-age=604800, stale-while-revalidate=86400'
        }
      ],
      '*.jpeg': [
        {
          key: 'Cache-Control',
          value: 'public, max-age=604800, stale-while-revalidate=86400'
        }
      ],
      '*.gif': [
        {
          key: 'Cache-Control',
          value: 'public, max-age=604800, stale-while-revalidate=86400'
        }
      ],
      '*.webp': [
        {
          key: 'Cache-Control',
          value: 'public, max-age=604800, stale-while-revalidate=86400'
        }
      ],
      '*.svg': [
        {
          key: 'Cache-Control',
          value: 'public, max-age=604800, stale-while-revalidate=86400'
        }
      ],
      // PWA manifest
      'manifest.webmanifest': [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400'
        }
      ],
      // Service worker - no caching
      'sw.js': [
        {
          key: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate'
        }
      ],
      // Default for all other files
      '**': [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600'
        }
      ]
    }
  };
};
