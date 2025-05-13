
// Cache settings for Workbox
export const getCacheSettings = () => {
  return {
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,
    // Fix the glob patterns with absolute paths
    globDirectory: 'dist',
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif}'],
    // Remove duplicate entries in globIgnores
    globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
  };
};
