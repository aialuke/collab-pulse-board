
import { CACHE_NAMES } from '../cache-names';

// Enhanced cache strategy for API responses with stale-while-revalidate pattern
export const getAdvancedAPICacheStrategy = () => {
  return [
    // API feed responses - stale-while-revalidate for better UX
    {
      urlPattern: /^https:\/\/.*\/api\/feed(\/.*)?$/i,
      handler: 'StaleWhileRevalidate' as const,
      options: {
        cacheName: CACHE_NAMES.api,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 30, // 30 minutes
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
        // Add broadcast channel to notify the app when cache is updated
        plugins: [
          {
            cacheDidUpdate: async () => {
              const channel = new BroadcastChannel('api-updates');
              channel.postMessage({ type: 'CACHE_UPDATED', url: 'feed' });
              channel.close();
            }
          }
        ]
      },
    },
    // Static API data - cache first with longer expiration
    {
      urlPattern: /^https:\/\/.*\/api\/(categories|profiles|settings)(\/.*)?$/i,
      handler: 'StaleWhileRevalidate' as const,
      options: {
        cacheName: CACHE_NAMES.api,
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // User-specific data - network first with cache fallback
    {
      urlPattern: /^https:\/\/.*\/api\/(user|notifications)(\/.*)?$/i,
      handler: 'NetworkFirst' as const, 
      options: {
        cacheName: CACHE_NAMES.api,
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
        networkTimeoutSeconds: 3, // Short timeout to quickly fall back to cache
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ];
};
