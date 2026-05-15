import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'admin-redirect',
        configureServer(server) {
          server.middlewares.use('/admin', (req, res) => {
            const adminHtml = path.resolve(__dirname, 'public', 'admin', 'index.html');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(fs.readFileSync(adminHtml, 'utf-8'));
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
