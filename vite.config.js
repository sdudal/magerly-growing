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
        404: resolve(__dirname, 'src/404.html'),
        'ru/index': resolve(__dirname, 'src/ru/index.html'),
        'ru/privacy': resolve(__dirname, 'src/ru/privacy.html'),
        'ru/terms': resolve(__dirname, 'src/ru/terms.html')
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.log statements
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    cssMinify: true, // Explicitly enable CSS minification
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
