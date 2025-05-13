
import { defineConfig, ConfigEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { configurePWA } from "./src/config/vite/pwa";
import { configureCompression } from "./src/config/vite/compression";
import { configureBuild } from "./src/config/vite/build";
import { configureServer } from "./src/config/vite/server";
import { configureDevelopment } from "./src/config/vite/development";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const isProd = mode === 'production';
  
  return {
    server: {
      ...configureServer(),
      port: 8080
    },
    plugins: [
      react({
        // Enhanced React-SWC configuration for production optimization
        devTarget: isProd ? 'es2022' : 'es2020',
        // Removing the swcOptions property as it doesn't exist in the Options type
      }),
      mode === 'development' && configureDevelopment(),
      configurePWA(),
      ...(isProd ? configureCompression() : []),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@utils": path.resolve(__dirname, "./src/utils"),
      },
    },
    build: {
      ...configureBuild(),
      // Add CSS optimization settings
      cssCodeSplit: true,
      cssMinify: isProd ? 'esbuild' : false,
      rollupOptions: {
        output: {
          // Customize file names for better caching
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            // Use separate naming scheme for CSS files
            const cssExtensions = ['.css'];
            const isCSS = assetInfo.name && cssExtensions.some(ext => assetInfo.name?.endsWith(ext));
            
            if (isCSS) {
              // Create critical CSS chunk
              if (assetInfo.name?.includes('critical')) {
                return 'assets/critical-[hash].css';
              }
              return 'assets/styles-[name]-[hash].css';
            }
            
            return 'assets/[name]-[hash].[ext]';
          },
          // Optimize chunking strategy for better performance
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-components': [
              'src/components/ui/button.tsx',
              'src/components/ui/input.tsx'
            ],
            'feedback': ['src/components/feedback/home/FeedbackContainer.tsx']
          }
        },
        // Add external packages that should not be bundled
        external: []
      },
    },
  };
});
