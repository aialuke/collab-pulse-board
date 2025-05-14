
import { CACHE_NAMES } from '../cache-names';

// Cache strategy for Google Fonts
export const getFontsCacheStrategy = () => {
  return [
    // Cache for Google Fonts CSS
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'StaleWhileRevalidate' as const,
      options: {
        cacheName: CACHE_NAMES.fonts,
        expiration: {
          maxEntries: 5,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache for Google Fonts static resources
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/s\/manrope\/.*\.woff2$/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.fonts,
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ];
};
