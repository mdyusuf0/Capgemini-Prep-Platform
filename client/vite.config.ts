import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function copyToRootDist(): Plugin {
  return {
    name: 'copy-to-root-dist',
    closeBundle() {
      try {
        const clientDist = path.resolve(__dirname, 'dist');
        const rootDist = path.resolve(__dirname, '../dist');
        if (fs.existsSync(clientDist)) {
          fs.cpSync(clientDist, rootDist, { recursive: true, force: true });
          console.log('[vite] Mirrored build output to root dist:', rootDist);
        }
      } catch (err) {
        console.error('[vite] Failed copying to root dist:', err);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyToRootDist()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
