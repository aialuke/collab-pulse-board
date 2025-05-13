
// Server configuration
export const configureServer = () => {
  return {
    host: "0.0.0.0", // Listen on all IPv4/IPv6 interfaces for better compatibility
    port: 8080,
    strictPort: false, // Allow fallback to another port if 8080 is in use
  };
};
