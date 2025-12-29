import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/json': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/import': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/version': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'build'
  }
})
