// Shared contact logic used by the Vercel serverless function (api/contact.js)
// and the Vite dev middleware (vite.config.ts) so behavior matches in both.

import { Resend } from 'resend';

export function validateContactPayload(body = {}) {
  const trim = (value) => (typeof value === 'string' ? value.trim() : '');

  const data = {
    name: trim(body.name),
    email: trim(body.email),
    subject: trim(body.subject),
    message: trim(body.message),
  };

  const errors = [];
  if (!data.name) errors.push('Name is required.');
  if (!data.email) errors.push('Email is required.');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please provide a valid email address.');
  }
  if (!data.message) errors.push('Message is required.');
  else if (data.message.length < 10) errors.push('Message must be at least 10 characters.');

  return { data, errors };
}

function envValue(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export async function sendContactEmail({ name, email, subject, message }, env = process.env) {
  const apiKey = envValue(env.RESEND_API_KEY);
  const from = envValue(env.CONTACT_FROM_EMAIL);
  const to = envValue(env.CONTACT_TO_EMAIL);

  if (!apiKey || !from || !to) {
    throw new Error('Contact email is not configured (RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL).');
  }

  const resend = new Resend(apiKey);
  const fullSubject = `[Portfolio] ${subject || 'New inquiry'} from ${name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject || 'N/A'}`,
    '',
    message,
  ].join('\n');
  const html = `
    <h2>New portfolio inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject || 'N/A')}</p>
    <hr />
    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
  `;

  const { data, error } = await resend.emails.send({
    from,
    to,
    reply_to: email,
    subject: fullSubject,
    text,
    html,
  });

  if (error) {
    throw new Error(`Resend API error: ${error.message}`);
  }

  await sendConfirmationEmail(resend, { from, name, email }, env).catch((err) => {
    console.error('Failed to send confirmation email:', err);
  });

  return data;
}

async function sendConfirmationEmail(resend, { from, name, email }, env = process.env) {
  const templateId = envValue(env.CONTACT_CONFIRM_TEMPLATE_ID);
  if (!templateId) return;

  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: 'We received your message',
    template: {
      id: templateId,
      variables: { NAME: name },
    },
  });

  if (error) {
    throw new Error(`Resend API error (confirmation): ${error.message}`);
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
