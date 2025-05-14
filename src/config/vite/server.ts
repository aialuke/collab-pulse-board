
// Server configuration
export const configureServer = () => {
  return {
    host: "::", // Listen on all IPv6 interfaces
    hmr: {
      overlay: false, // Disable HMR overlay for better performance
    },
    cors: true,
    headers: {
      // Set appropriate cache control headers
      "Cache-Control": (path) => {
        // For hashed assets (JS, CSS)
        if (path.match(/\.(js|css)$/i) && path.includes('-')) {
          return 'public, max-age=31536000, immutable'; // 1 year for hashed assets
        }
        // For images
        else if (path.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
          return 'public, max-age=604800, stale-while-revalidate=86400'; // 7 days with 1 day stale
        }
        // For the PWA manifest
        else if (path.match(/manifest\.webmanifest$/i)) {
          return 'public, max-age=86400'; // 1 day for PWA manifest
        }
        // For service worker scripts
        else if (path.match(/sw.*\.js$/i)) {
          return 'public, max-age=0, must-revalidate'; // No caching for service workers
        }
        // Default
        return 'public, max-age=3600'; // 1 hour default
      }
    }
  };
};
