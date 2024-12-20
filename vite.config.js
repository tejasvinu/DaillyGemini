import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
