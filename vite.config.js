import { defineConfig } from 'vite';
import { readdirSync } from 'fs';
import { relative, resolve } from 'path';

const srcDir = resolve(__dirname, 'src');

function getHtmlInputs(dir = srcDir, inputs = {}) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const filePath = resolve(dir, entry.name);

    if (entry.isDirectory()) {
      getHtmlInputs(filePath, inputs);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      const inputName = relative(srcDir, filePath).replace(/\\/g, '/').replace(/\.html$/, '');
      inputs[inputName] = filePath;
    }
  }

  return inputs;
}

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlInputs(),
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
