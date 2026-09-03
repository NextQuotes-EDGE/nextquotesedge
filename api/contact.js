// Vercel serverless function: contact form submission -> Resend email

import { validateContactPayload, sendContactEmail } from '../shared/contact.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data, errors } = validateContactPayload(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') });
  }

  try {
    await sendContactEmail(data);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact email error:', error.message);
    res.status(500).json({ error: 'Failed to send your message. Please try again later.', detail: error.message });
  }
}
