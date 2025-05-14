
// Server configuration
export const configureServer = () => {
  return {
    host: "::", // Listen on all IPv6 interfaces
    port: 8080,
    // Add performance optimizations
    hmr: {
      overlay: false, // Disable HMR overlay for better performance
    },
    // Add compression middleware
    middlewareMode: "ssr",
    cors: true,
  };
};
