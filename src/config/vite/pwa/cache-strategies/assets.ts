
import { CACHE_NAMES } from '../cache-names';

// Cache strategies for static assets (JS, CSS, images)
export const getAssetCacheStrategies = () => {
  return [
    // Specific cache for main JS bundle files - StaleWhileRevalidate for balance
    {
      urlPattern: /\/assets\/index-[A-Za-z0-9]+\.js$/i,
      handler: 'StaleWhileRevalidate' as const,
      options: {
        cacheName: CACHE_NAMES.main,
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 14, // 14 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Specific cache for main CSS bundle files - StaleWhileRevalidate for balance
    {
      urlPattern: /\/assets\/styles-[A-Za-z0-9]+\.css$/i,
      handler: 'StaleWhileRevalidate' as const,
      options: {
        cacheName: CACHE_NAMES.main,
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 14, // 14 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Specific cache for critical CSS
    {
      urlPattern: /\/assets\/critical-[A-Za-z0-9]+\.css$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.main,
        expiration: {
          maxEntries: 5,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache static assets with hash in filename (JS, CSS) - long term
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.static,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days for immutable assets
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache images - medium term
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.images,
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ];
};
