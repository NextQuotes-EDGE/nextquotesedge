import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import {validateContactPayload, sendContactEmail} from './shared/contact.js';
import {
  buildAuthorizeUrl,
  exchangeCodeForToken,
  renderAuthPage,
  renderErrorPage,
} from './shared/auth.js';

const DEV_SITE_URL = 'http://localhost:5173';

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
      {
        name: 'api-auth-dev',
        configureServer(server) {
          server.middlewares.use('/api/auth', async (req, res) => {
            const clientId = env.GITHUB_CLIENT_ID;
            const clientSecret = env.GITHUB_CLIENT_SECRET;

            if (!clientId || !clientSecret) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(
                JSON.stringify({
                  error:
                    'GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables are not configured.',
                }),
              );
            }

            const url = new URL(req.url, DEV_SITE_URL);
            const provider = url.searchParams.get('provider') || 'github';
            const redirectUri = `${DEV_SITE_URL}/api/auth`;
            const code = url.searchParams.get('code');

            if (code) {
              try {
                const data = await exchangeCodeForToken({
                  clientId,
                  clientSecret,
                  code,
                  redirectUri,
                });
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                return res.end(renderAuthPage(provider, data, DEV_SITE_URL));
              } catch (err) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                return res.end(
                  renderErrorPage(provider, err.message || 'OAuth token exchange failed', DEV_SITE_URL),
                );
              }
            }

            const scope = url.searchParams.get('scope') || 'repo';
            const authUrl = buildAuthorizeUrl({clientId, scope, redirectUri});
            res.statusCode = 302;
            res.setHeader('Location', authUrl);
            res.end();
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
