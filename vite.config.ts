import { defineConfig, ConfigEnv, PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { configurePWA } from "./src/config/vite/pwa";
import { configureCompression } from "./src/config/vite/compression";
import { configureBuild } from "./src/config/vite/build";
import { configureDevelopment } from "./src/config/vite/development";
import { configureServer } from "./src/config/vite/server";
import { splitVendorChunkPlugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const serverConfig = configureServer();
  const isProd = mode === 'production';
  const buildConfig = configureBuild();
  
  return {
    server: {
      port: 8080,
      ...serverConfig
    },
    plugins: [
      react({
        // Use faster builds in development with swc
        devTarget: isProd ? 'es2022' : 'es2020',
        // Use JSX transform in production to reduce bundle size
        jsxImportSource: isProd ? undefined : 'react',
        // Properly configure development vs. production
        plugins: !isProd ? [] : undefined,
        // Ensure production optimizations are enabled
        tsDecorators: false,
        // Enable React refresh only in dev mode
      }),
      mode === 'development' ? configureDevelopment() : null,
      configurePWA(),
      ...(isProd ? configureCompression() : []),
      splitVendorChunkPlugin(),
      isProd ? visualizer({
        filename: './dist/stats.html',
        open: false,
        gzipSize: true,
        template: 'treemap', // Use treemap for better visualization
        sourcemap: false, // Disable source maps in the analyzer to speed it up
      }) : null,
    ].filter(Boolean) as PluginOption[],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    esbuild: {
      // Improve tree-shaking with pure annotations
      pure: isProd ? ['console.log', 'console.debug', 'console.info'] : [],
      // Keep JSX in production for better tree-shaking
      jsx: 'automatic' as 'automatic' | 'transform' | 'preserve',
      // Target modern browsers for smaller output
      target: isProd ? 'es2020' : 'es2018',
    },
    build: buildConfig
  };
});
