import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true, // Add this line
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'ui': ['framer-motion', 'lucide-react'],
          'charts': ['recharts']
        }
      }
    }
  },
    server: {
    port: 3000,
    host: true,
    strictPort: true
  }
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'recharts',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'framer-motion',
      'lucide-react'
    ]
  }
})
