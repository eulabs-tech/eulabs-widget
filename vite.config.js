import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {
    proxy: {
      // Evita CORS no `npm run dev`: use `/api-eucatur/...` como URL_API no dev-entry
      '/api-eucatur': {
        target: 'https://api-v4.eucatur.com.br',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api-eucatur/, ''),
      },
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'EulabsWidget',
      // Extensão .js para o UMD: muitos servidores enviam .cjs como não-JS e o browser ignora o script.
      fileName: (format) =>
        format === 'es' ? 'eulabs-widget.js' : 'eulabs-widget.umd.js',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'eulabs-widget.[ext]',
      },
    },
  },
})
