// Vercel serverless function: serve live CMS project content from the repo.

import { getProjects } from '../shared/github-content.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const projects = await getProjects();
    return res.status(200).setHeader('Cache-Control', 'no-store').json(projects);
  } catch (error) {
    console.error('Projects API error:', error.message);
    return res.status(500).json({ error: 'Failed to load projects.' });
  }
}
