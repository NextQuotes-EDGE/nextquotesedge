# NextQuotesEdge

Engineering portfolio showcasing high-performance systems development for businesses and traders.

Built with React 19, Vite 6, Tailwind CSS 4, and Decap CMS.

## Local Development

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

## CMS (Content Management)

Edit projects and site configuration at `/admin` via Decap CMS with GitHub OAuth.

**Requires:** GitHub OAuth App + Vercel deployment (see below).

## Deploy to Vercel

1. Push to GitHub
2. Import repo at https://vercel.com/new
3. Build: `vite build` | Output: `dist`
4. Create GitHub OAuth App at https://github.com/settings/developers
5. Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` as Vercel environment variables
6. Update `public/admin/config.yml` with your repo and Vercel URL

## Structure

```
src/
  components/     UI components (Navbar, Hero, About, etc.)
  content/        Project MDX files and site config
  lib/            Data fetching utilities
  pages/          Route pages
public/admin/     Decap CMS admin interface
api/              Vercel serverless function for GitHub OAuth
```
