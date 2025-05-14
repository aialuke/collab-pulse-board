
import { CACHE_NAMES } from '../cache-names';

// Cache strategy for Google Fonts
export const getFontsCacheStrategy = () => {
  return [
    // Cache Google Fonts CSS
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'StaleWhileRevalidate' as const,
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
    // Cache Google Fonts static resources (the actual font files)
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst' as const,
      options: {
        cacheName: CACHE_NAMES.fonts,
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days (fonts rarely change)
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ];
};
