import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3') || id.includes('victory')) {
              return 'charts-vendor';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Additional common dependencies
            return 'vendor';
          }
        }
      }
    },
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: true,
    // Add chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app', 
      'firebase/auth', 
      'firebase/firestore',
      'framer-motion',
      'lucide-react',
      'recharts',
      'd3-shape',
      'd3-scale',
      'd3-array',
      'd3-interpolate'
    ],
    exclude: [],
    esbuildOptions: {
      target: 'es2020',
      supported: {
        bigint: true
      }
    }
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    cors: true,
    hmr: {
      overlay: false
    }
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
    cors: true
  },
  // Add better error handling
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
