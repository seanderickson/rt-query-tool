import { defineConfig } from 'vite'
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  /** Define some settings used for building a dist */
  base: '/static/rt-query',
  build: {
    outDir: 'dist/static/rt-query',
    // rollupOptions: {
    //   output: {
    //     format: 'es',
    //   },
    // }
  }
})
