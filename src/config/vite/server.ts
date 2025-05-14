
// Server configuration
export const configureServer = () => {
  return {
    host: "::", // Listen on all IPv6 interfaces
    hmr: {
      overlay: false, // Disable HMR overlay for better performance
    },
    cors: true,
  };
};
