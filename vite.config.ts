import { defineConfig } from 'vite'

export default defineConfig({
  base: '/threejs-model-viewer/',
  server: {
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  publicDir: 'public'
})
