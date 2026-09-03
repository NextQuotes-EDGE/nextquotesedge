// Shared GitHub OAuth logic for Decap CMS.
// Used by the Vercel serverless function (api/auth.js) and the Vite dev
// middleware (vite.config.ts) so behavior matches in both environments.

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

export function getAuthOrigin(siteUrl) {
  return siteUrl;
}

export function buildAuthorizeUrl({ clientId, scope, redirectUri }) {
  return (
    `${GITHUB_AUTHORIZE_URL}?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}`
  );
}

export async function exchangeCodeForToken({ clientId, clientSecret, code, redirectUri }) {
  const response = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error_description || data.error);
  }
  return data;
}

// Verifies a freshly-exchanged access token against GitHub's /user endpoint.
// Mirrors Decap's request style (token keyword) so we confirm the token Decap
// will actually use is valid, and capture the granted scopes.
export async function verifyToken({ accessToken }) {
  const res = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });
  const body = await res.json().catch(() => ({}));
  return {
    status: res.status,
    ok: res.ok,
    login: body.login || null,
    message: body.message || null,
    scopes: res.headers.get('x-oauth-scopes') || null,
  };
}

export function renderAuthPage(provider, data, siteUrl) {
  const origin = getAuthOrigin(siteUrl);
  // Decap's GitHub backend reads the access token from `state.token`, so the
  // message must expose the access token under a `token` key (not just
  // `access_token` which is what GitHub's exchange response uses).
  const authData = {...data, token: data.access_token};
  const encoded = JSON.stringify(authData).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Authorizing ${provider}</title>
  </head>
  <body>
    <p id="diag" style="font-family: sans-serif; padding: 8px;">Authorizing ${provider}…</p>
    <script>
      (function () {
        var provider = '${provider}';
        var message = ${encoded};
        var grantedScope = message.scope || '(no scope)';
        try {
          document.getElementById('diag').textContent = 'Granted scope: ' + grantedScope;
        } catch (e) {}
        console.log('OAuth granted scope:', grantedScope);

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

export function renderErrorPage(provider, err, siteUrl) {
  const origin = getAuthOrigin(siteUrl);
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
