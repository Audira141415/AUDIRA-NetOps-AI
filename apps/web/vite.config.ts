import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@audira/monitoring': path.resolve(__dirname, '../../packages/monitoring/src'),
      '@audira/types': path.resolve(__dirname, '../../packages/types/src'),
      '@audira/security': path.resolve(__dirname, '../../packages/security/src/browser.ts'),
      '@audira/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  server: {
    port: Number(process.env.WEB_PORT) || 5180,
    strictPort: false,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
      },
    },
  },

});
