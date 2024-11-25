import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['recharts'],
      output: {
        globals: {
          recharts: 'Recharts'
        }
      }
    }
  },
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
