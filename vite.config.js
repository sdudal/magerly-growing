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
        'ru/terms': resolve(__dirname, 'src/ru/terms.html'),
        'blog/index': resolve(__dirname, 'src/blog/index.html'),
        'blog/baby-walking-milestones': resolve(__dirname, 'src/blog/baby-walking-milestones.html'),
        'blog/baby-growth-chart-percentiles': resolve(__dirname, 'src/blog/baby-growth-chart-percentiles.html'),
        'blog/first-year-milestones-month-by-month': resolve(__dirname, 'src/blog/first-year-milestones-month-by-month.html'),
        'blog/how-to-track-baby-growth': resolve(__dirname, 'src/blog/how-to-track-baby-growth.html'),
        'blog/baby-sleep-schedule-by-age': resolve(__dirname, 'src/blog/baby-sleep-schedule-by-age.html'),
        'blog/baby-talking-language-development': resolve(__dirname, 'src/blog/baby-talking-language-development.html'),
        'blog/baby-nutrition-breastfeeding-guide': resolve(__dirname, 'src/blog/baby-nutrition-breastfeeding-guide.html'),
        'blog/baby-teething-timeline': resolve(__dirname, 'src/blog/baby-teething-timeline.html'),
        'blog/tummy-time-guide': resolve(__dirname, 'src/blog/tummy-time-guide.html'),
        'blog/baby-bath-safety': resolve(__dirname, 'src/blog/baby-bath-safety.html'),
        'blog/postpartum-recovery-guide': resolve(__dirname, 'src/blog/postpartum-recovery-guide.html'),
        'blog/best-developmental-toys-by-age': resolve(__dirname, 'src/blog/best-developmental-toys-by-age.html'),
        'blog/baby-vaccination-schedule': resolve(__dirname, 'src/blog/baby-vaccination-schedule.html'),
        'blog/potty-training-readiness-signs': resolve(__dirname, 'src/blog/potty-training-readiness-signs.html'),
        'ru/blog/index': resolve(__dirname, 'src/ru/blog/index.html'),
        'ru/blog/baby-walking-milestones': resolve(__dirname, 'src/ru/blog/baby-walking-milestones.html'),
        'ru/blog/baby-growth-chart-percentiles': resolve(__dirname, 'src/ru/blog/baby-growth-chart-percentiles.html'),
        'ru/blog/first-year-milestones-month-by-month': resolve(__dirname, 'src/ru/blog/first-year-milestones-month-by-month.html'),
        'ru/blog/how-to-track-baby-growth': resolve(__dirname, 'src/ru/blog/how-to-track-baby-growth.html'),
        'ru/blog/baby-sleep-schedule-by-age': resolve(__dirname, 'src/ru/blog/baby-sleep-schedule-by-age.html'),
        'ru/blog/baby-talking-language-development': resolve(__dirname, 'src/ru/blog/baby-talking-language-development.html'),
        'ru/blog/baby-nutrition-breastfeeding-guide': resolve(__dirname, 'src/ru/blog/baby-nutrition-breastfeeding-guide.html'),
        'ru/blog/baby-teething-timeline': resolve(__dirname, 'src/ru/blog/baby-teething-timeline.html'),
        'ru/blog/tummy-time-guide': resolve(__dirname, 'src/ru/blog/tummy-time-guide.html'),
        'ru/blog/baby-bath-safety': resolve(__dirname, 'src/ru/blog/baby-bath-safety.html'),
        'ru/blog/postpartum-recovery-guide': resolve(__dirname, 'src/ru/blog/postpartum-recovery-guide.html'),
        'ru/blog/best-developmental-toys-by-age': resolve(__dirname, 'src/ru/blog/best-developmental-toys-by-age.html'),
        'ru/blog/baby-vaccination-schedule': resolve(__dirname, 'src/ru/blog/baby-vaccination-schedule.html'),
        'ru/blog/potty-training-readiness-signs': resolve(__dirname, 'src/ru/blog/potty-training-readiness-signs.html'),
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
