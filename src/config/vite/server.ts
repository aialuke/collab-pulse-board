
// Server configuration
export const configureServer = () => {
  return {
    host: "::", // Listen on all IPv6 interfaces
    port: 8080, // Ensure port is specified here
    // Add performance optimizations
    hmr: {
      overlay: false, // Disable HMR overlay for better performance
    },
    cors: true,
  };
};
