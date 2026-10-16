import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  base: '/form-builder/',
  plugins: [
    vue(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    // 开发环境代理转发，消除本地开发时的跨域问题并自动传递 Cookie
    proxy: {
      '/pc': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@arco-design')) {
              return 'arco-vendor';
            }
            if (id.includes('vue') || id.includes('vue-router')) {
              return 'vue-vendor';
            }
            if (id.includes('@lucide')) {
              return 'lucide-vendor';
            }
            if (id.includes('mockjs')) {
              return 'mock-vendor';
            }
            if (id.includes('sortablejs')) {
              return 'sortable-vendor';
            }
            if (id.includes('driver.js')) {
              return 'driver-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})

