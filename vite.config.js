import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'EulabsWidget',
      fileName: (format) =>
        format === 'es' ? 'eulabs-widget.js' : 'eulabs-widget.umd.cjs',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'eulabs-widget.[ext]',
      },
    },
  },
})
