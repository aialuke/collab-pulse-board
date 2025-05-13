
import viteCompression from 'vite-plugin-compression';

// Configuration for compression plugins with optimized settings
export const configureCompression = () => {
  return [
    // Brotli compression with optimized settings
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      filter: /\.(js|css|html|svg|json)$/i,
      compressionOptions: { level: 11 }, // Maximum compression level
      threshold: 1024, // Only compress files larger than 1KB
      deleteOriginFile: false,
    }),
    // Gzip compression for browsers without Brotli support
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      filter: /\.(js|css|html|svg|json)$/i,
      compressionOptions: { level: 9 }, // Maximum compression level
      threshold: 1024, // Only compress files larger than 1KB
      deleteOriginFile: false,
    }),
  ];
};
