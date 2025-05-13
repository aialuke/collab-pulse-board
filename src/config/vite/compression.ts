
import viteCompression from 'vite-plugin-compression';

// Configuration for compression plugins
export const configureCompression = () => {
  return [
    // Brotli compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      filter: /\.(js|css|html|svg|json)$/i,
      compressionOptions: { level: 11 },
      deleteOriginFile: false,
    }),
    // Gzip compression for browsers without Brotli support
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      filter: /\.(js|css|html|svg|json)$/i,
      compressionOptions: { level: 9 },
      deleteOriginFile: false,
    }),
  ];
};
