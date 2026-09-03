/* NextQuotesEdge — Decap CMS custom project preview.
   Renders a dark-branded project card (matching the live site) inside the
   editor preview pane. Returns an HTML string so it works without a build
   step. The markup uses the classes defined in preview.css
   (.preview-body, .preview-badge, .preview-summary, .preview-highlight).

   The markdown body is converted with `marked`, loaded in index.html.
*/

window.CMS.registerPreviewTemplate('projects', ({ entry }) => {
  const data = entry.get('data').toJS();
  const status = data.status;
  const categories = data.categories || [];
  const techStack = data.techStack || [];
  const highlights = data.highlights || [];
  const body = data.body || '';

  const esc = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const metaRows = [];
  if (status) {
    metaRows.push(
      `<span class="preview-badge status-${esc(String(status).toLowerCase())}">${esc(status)}</span>`,
    );
  }
  categories.forEach((c) => {
    metaRows.push(`<span class="preview-badge category">${esc(c)}</span>`);
  });
  techStack.forEach((t) => {
    metaRows.push(`<span class="preview-badge tech">${esc(t)}</span>`);
  });

  let highlightsHtml = '';
  if (highlights.length > 0) {
    const items = highlights.map((h) => `<li>${esc(h)}</li>`).join('');
    highlightsHtml = `<div><h4>Highlights</h4><ul>${items}</ul></div>`;
  }

  const renderer = window.marked ? window.marked.parse(body) : esc(body);
  const image = data.featuredImage
    ? `<img src="${esc(data.featuredImage)}" alt="${esc(data.title)}" />`
    : '';

  return `
    <div class="preview-body">
      <h2>${esc(data.title)}</h2>
      <div class="preview-meta">${metaRows.join('')}</div>
      ${image}
      ${data.summary ? `<p class="preview-summary">${esc(data.summary)}</p>` : ''}
      ${highlightsHtml}
      <hr />
      <div class="preview-markdown">${renderer}</div>
    </div>
  `;
});
