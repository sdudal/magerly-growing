import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        privacy: resolve(__dirname, 'src/privacy.html'),
        terms: resolve(__dirname, 'src/terms.html'),
      },
    },
    minify: 'terser',
    sourcemap: false,
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
  publicDir: '../public',
});
