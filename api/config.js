// Vercel serverless function: serve live CMS site-config content from the repo.

import fs from 'fs';
import { getSiteConfig } from '../shared/github-content.js';

function readDefaultConfig() {
  try {
    const file = new URL('../src/content/site-config.json', import.meta.url);
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    // Minimal fallback if the file can't be read in the runtime.
    return {
      brandName: 'NextQuotesEdge',
      role: 'System Architect & Engineer',
      hero: {},
      about: { philosophy: [], portraitUrl: '', presence: '' },
      services: [],
      whatsappNumber: '',
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const config = await getSiteConfig(readDefaultConfig());
    return res.status(200).setHeader('Cache-Control', 'no-store').json(config);
  } catch (error) {
    console.error('Config API error:', error.message);
    return res.status(200).json(readDefaultConfig());
  }
}
