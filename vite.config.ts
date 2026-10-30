import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

function generateRiskHtmlPlugin(): Plugin {
  return {
    name: 'generate-risk-html',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist')
      const indexHtmlPath = path.join(distDir, 'index.html')
      if (fs.existsSync(indexHtmlPath)) {
        let html = fs.readFileSync(indexHtmlPath, 'utf8')
        if (!html.includes('<base href=')) {
          html = html.replace('<head>', '<head>\n    <base href="/form-builder/" />')
        }
        html = html.replace('<title>表单设计工作台</title>', '<title>风险评估设计工作台</title>')
        const riskDir = path.join(distDir, 'risk')
        if (!fs.existsSync(riskDir)) {
          fs.mkdirSync(riskDir, { recursive: true })
        }
        fs.writeFileSync(path.join(riskDir, 'index.html'), html, 'utf8')
        console.log('[generateRiskHtmlPlugin] Successfully created dist/risk/index.html')
      }
    }
  }
}

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    tailwindcss(),
    generateRiskHtmlPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
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
          }
        }
      }
    }
  }
})
