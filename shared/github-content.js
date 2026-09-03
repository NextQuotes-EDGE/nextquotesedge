// Shared GitHub content reader used by the /api/projects and /api/config
// Vercel serverless functions. Reads the CMS-managed content from the public
// GitHub repo at the master branch and parses it the same way the frontend
// does (src/lib/projects.ts and src/lib/config.ts), so the live API responses
// match the static fallback shapes exactly.

import matter from 'gray-matter';

const REPO = 'NextQuotes-EDGE/nextquotesedge';
const BRANCH = 'master';
const API_ROOT = `https://api.github.com/repos/${REPO}/contents`;

function headers() {
  const token = process.env.GITHUB_REPO_TOKEN;
  return {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'nextquotesedge',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchJson(url, fallback) {
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    if (fallback !== undefined) return fallback;
    throw new Error(`GitHub request failed (${res.status}) for ${url}`);
  }
  return res.json();
}

async function fetchFile(path) {
  const data = await fetchJson(`${API_ROOT}/${path}?ref=${BRANCH}`);
  if (!data || data.type !== 'file' || !data.content) return null;
  return Buffer.from(data.content, 'base64').toString('utf8');
}

// Return the projects list, same shape as src/lib/projects.ts getStaticProjects().
export async function getProjects() {
  let listing;
  try {
    listing = await fetchJson(`${API_ROOT}/src/content/projects?ref=${BRANCH}`, []);
  } catch {
    listing = [];
  }

  const results = await Promise.all(
    (listing || [])
      .filter((item) => item.type === 'file' && item.name.endsWith('.mdx'))
      .map(async (item) => {
        try {
          const raw = await fetchFile(`src/content/projects/${item.name}`);
          if (!raw) return null;
          const { data, content } = matter(raw);
          const slug = item.name.replace(/\.mdx$/, '');
          return {
            ...data,
            content,
            slug,
            status: data.status || 'Finished',
          };
        } catch {
          return null;
        }
      }),
  );

  const projects = results.filter(Boolean);

  return projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });
}

// Return the parsed site config JSON.
export async function getSiteConfig(fallback) {
  try {
    const raw = await fetchFile('src/content/site-config.json');
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
