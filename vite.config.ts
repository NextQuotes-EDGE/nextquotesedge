import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {validateContactPayload, sendContactEmail} from './shared/contact.js';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-contact-dev',
        configureServer(server) {
          server.middlewares.use('/api/contact', (req, res, next) => {
            if (req.method !== 'POST') {
              return next();
            }
            let raw = '';
            req.on('data', (chunk) => {
              raw += chunk;
            });
            req.on('end', async () => {
              try {
                let body = {};
                if (raw) {
                  body = JSON.parse(raw);
                }
                const {data, errors} = validateContactPayload(body);
                if (errors.length > 0) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({error: errors.join(' ')}));
                }
                await sendContactEmail(data, env);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ok: true}));
              } catch (err) {
                console.error('Contact email error:', err.message);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({error: 'Failed to send your message. Please try again later.'}));
              }
            });
          });
        },
      },
      {
        name: 'admin-redirect',
        configureServer(server) {
          server.middlewares.use('/admin', (req, res, next) => {
            if (req.url === '/' || req.url === '') {
              const adminHtml = path.resolve(__dirname, 'public', 'admin', 'index.html');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/html');
              res.end(fs.readFileSync(adminHtml, 'utf-8'));
            } else {
              next();
            }
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
