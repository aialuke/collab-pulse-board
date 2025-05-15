
import { CACHE_NAMES } from '../cache-names';

// Cache strategies for static assets (JS, CSS, images)
export const getAssetCacheStrategies = () => {
  return [
    // Specific cache for React core bundle - CacheFirst with long TTL
    {
      urlPattern: /\/assets\/react-core-[A-Za-z0-9]+\.js$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.main,
        expiration: {
          maxEntries: 5,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days for immutable assets
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Specific cache for main JS bundle files - CacheFirst for better performance with long TTL
    {
      urlPattern: /\/assets\/index-[A-Za-z0-9]+\.js$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.main,
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days for immutable assets
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Specific cache for main CSS bundle files - CacheFirst for better performance
    {
      urlPattern: /\/assets\/styles-[A-Za-z0-9]+\.css$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.main,
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days for immutable assets
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Specific cache for critical CSS - CacheFirst with immutable strategy
    {
      urlPattern: /\/assets\/critical-[A-Za-z0-9]+\.css$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.main,
        expiration: {
          maxEntries: 5,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days for immutable assets
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache static assets with hash in filename (JS, CSS) - long term with immutable flag
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
    // Cache images - long term
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.images,
        expiration: {
          maxEntries: 100, // Increased from 60
          maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days for images
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache icon SVGs separately - they're frequently used and small
    {
      urlPattern: /lucide-icons\.svg$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.static, // Changed from icons to static
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days for icons
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ];
};
