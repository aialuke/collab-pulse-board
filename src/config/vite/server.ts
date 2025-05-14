
// Server configuration
export const configureServer = () => {
  return {
    host: "::", // Listen on all IPv6 interfaces
    port: 8080,
    // Add performance optimizations
    hmr: {
      overlay: false, // Disable HMR overlay for better performance
    },
    // Remove the string type for middlewareMode since it expects a boolean or object
    cors: true,
  };
};
