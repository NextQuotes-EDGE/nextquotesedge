// Vercel serverless function for Decap CMS GitHub OAuth.
// Implements the Netlify-style OAuth handshake used by Decap CMS's GitHub backend.
// Shared logic lives in shared/auth.js.

import {
  buildAuthorizeUrl,
  exchangeCodeForToken,
  renderAuthPage,
  renderErrorPage,
} from '../shared/auth.js';

function getSiteUrl() {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  // Fall back to the expected production URL.
  return 'https://nextquotesedge.vercel.app';
}

export default async function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: 'GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables are not configured.',
    });
  }

  const provider = (typeof req.query.provider === 'string' && req.query.provider) || 'github';
  const siteUrl = getSiteUrl();
  const redirectUri = `${siteUrl}/api/auth`;
  const { code } = req.query;

  // GitHub redirected back here with a temporary authorization code.
  if (code) {
    try {
      const data = await exchangeCodeForToken({
        clientId,
        clientSecret,
        code,
        redirectUri,
      });

      return res
        .status(200)
        .setHeader('Content-Type', 'text/html')
        .send(renderAuthPage(provider, data, siteUrl));
    } catch (error) {
      return res
        .status(200)
        .setHeader('Content-Type', 'text/html')
        .send(renderErrorPage(provider, error.message || 'OAuth token exchange failed', siteUrl));
    }
  }

  // Initial request from Decap — redirect to GitHub's authorization page.
  const scope = (typeof req.query.scope === 'string' && req.query.scope) || 'repo';
  const authUrl = buildAuthorizeUrl({ clientId, scope, redirectUri });
  return res.redirect(302, authUrl);
}
