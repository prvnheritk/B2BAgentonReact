import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const port = Number(env.VITE_DEV_PORT ?? 5173);
  const apiBase = env.VITE_API_BASE_URL ?? 'http://localhost:8787';

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
    server: {
      port,
      proxy: {
        '/api': { target: apiBase, changeOrigin: true },
      },
    },
    build: {
      target: 'es2022',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            motion: ['framer-motion'],
            markdown: ['react-markdown', 'remark-gfm', 'rehype-highlight'],
            charts: ['recharts'],
          },
        },
      },
    },
  };
});
