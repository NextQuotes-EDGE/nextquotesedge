// Vercel serverless function for Decap CMS GitHub OAuth
// Implements the Netlify-style OAuth handshake used by Decap CMS's GitHub backend.
//
// Flow:
//   1. Decap opens a popup to /api/auth?provider=github&scope=repo
//   2. This endpoint redirects the popup to GitHub's authorization page
//   3. GitHub redirects back to this endpoint with ?code=xxx
//   4. We exchange the code for an access token, then render a page that
//      completes the postMessage handshake with the opener window.

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

function getSiteUrl() {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  // Fall back to the expected production URL.
  return 'https://nextquotesedge.vercel.app';
}

function getAuthOrigin() {
  return getSiteUrl();
}

function renderAuthPage(provider, message) {
  const origin = getAuthOrigin();
  const encoded = JSON.stringify(message).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Authorizing ${provider}</title>
  </head>
  <body>
    <script>
      (function () {
        var provider = '${provider}';
        var message = ${encoded};

        function receiveMessage(e) {
          if (e.data === 'authorizing:' + provider && e.origin === '${origin}') {
            window.removeEventListener('message', receiveMessage, false);
            window.opener.postMessage(
              'authorization:' + provider + ':success:' + JSON.stringify(message),
              e.origin,
            );
            window.close();
          }
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:' + provider, '${origin}');
      })();
    </script>
  </body>
</html>`;
}

function renderErrorPage(provider, err) {
  const origin = getAuthOrigin();
  const encoded = JSON.stringify({ message: err }).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Authorization Failed</title>
  </head>
  <body>
    <script>
      (function () {
        var provider = '${provider}';
        var err = ${encoded};

        window.opener.postMessage(
          'authorization:' + provider + ':error:' + JSON.stringify(err),
          '${origin}',
        );
        window.close();
      })();
    </script>
  </body>
</html>`;
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
  const { code } = req.query;

  // Step 4: GitHub redirected back here with a temporary authorization code.
  if (code) {
    const callbackUrl = `${getSiteUrl()}/api/auth`;
    try {
      const tokenResp = await fetch(GITHUB_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: callbackUrl,
        }),
      });

      const data = await tokenResp.json();
      if (data.error) {
        return res
          .status(200)
          .setHeader('Content-Type', 'text/html')
          .send(renderErrorPage(provider, data.error_description || data.error));
      }

      return res.status(200).setHeader('Content-Type', 'text/html').send(renderAuthPage(provider, data));
    } catch (error) {
      return res
        .status(200)
        .setHeader('Content-Type', 'text/html')
        .send(renderErrorPage(provider, error.message || 'OAuth token exchange failed'));
    }
  }

  // Step 2: Initial request from Decap — redirect to GitHub's authorization page.
  const scope = (typeof req.query.scope === 'string' && req.query.scope) || 'repo';
  const redirectUri = `${getSiteUrl()}/api/auth`;
  const authUrl =
    `${GITHUB_AUTHORIZE_URL}?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}`;

  return res.redirect(302, authUrl);
}
