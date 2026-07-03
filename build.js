// PureNetX — static blog post generator
// Runs on every Vercel deploy: reads content/posts.json, writes posts/<slug>.html
// and regenerates sitemap.xml. Do not edit generated files by hand.
const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const SITE = 'https://www.purenetx.com';
const posts = JSON.parse(fs.readFileSync('content/posts.json', 'utf8')).posts || [];

const esc = (s) => String(s || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const readTime = (body) => Math.max(1, Math.round(String(body || '').split(/\s+/).length / 200)) + ' min read';

const LOGO_SVG = (clip) => `<svg class="logo-svg" viewBox="0 0 100 116" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><clipPath id="${clip}"><path d="M50 6 L90 19 V52 C90 84 73 101 50 110 C27 101 10 84 10 52 V19 Z"/></clipPath></defs><g clip-path="url(#${clip})" stroke="currentColor" stroke-width="4"><line x1="32" y1="6" x2="32" y2="110"/><line x1="50" y1="6" x2="50" y2="110"/><line x1="68" y1="6" x2="68" y2="110"/><line x1="10" y1="36" x2="90" y2="36"/><line x1="10" y1="60" x2="90" y2="60"/><line x1="10" y1="84" x2="90" y2="84"/></g><path d="M50 6 L90 19 V52 C90 84 73 101 50 110 C27 101 10 84 10 52 V19 Z" fill="none" stroke="currentColor" stroke-width="8" stroke-linejoin="round"/><rect x="20" y="42" width="60" height="20" rx="6" fill="currentColor"/></svg>`;

const WORDMARK = `<span class="logo-word">Purenet<span class="logo-x">X</span></span>`;

function pageHtml(p) {
  const url = `${SITE}/posts/${p.slug}`;
  const bodyHtml = marked.parse(p.body || '');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(p.title)} — PureNetX</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${SITE}/og-image.png">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="/styles.css">
<style>
.cat-chip{display:inline-block;font-family:var(--mono);font-size:10.5px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:var(--red);border:1px solid rgba(220,38,38,0.35);border-radius:20px;padding:4px 12px;margin-bottom:14px}
.post-meta{font-family:var(--mono);font-size:13px;color:var(--ink-subtle);margin-bottom:32px}
.post-meta span{color:var(--red)}
.post-body{max-width:760px}
.post-body h2{font-size:clamp(20px,2.8vw,28px);margin:40px 0 16px}
.post-body h3{margin:32px 0 12px}
.post-body p{margin-bottom:18px;font-size:16px}
.post-body ul,.post-body ol{margin:0 0 18px 22px;color:var(--ink-soft)}
.post-body li{margin-bottom:8px;line-height:1.7}
.post-body a{color:var(--red)}
.post-body blockquote{border-left:3px solid var(--red);padding-left:18px;margin:24px 0;color:var(--ink-soft);font-style:italic}
.post-body code{font-family:var(--mono);font-size:.9em;background:var(--panel);padding:2px 6px;border-radius:4px}
.post-body pre{background:var(--ink);color:#D4D4D4;padding:20px;border-radius:var(--r);overflow-x:auto;margin-bottom:18px}
.post-body pre code{background:none;color:inherit;padding:0}
.post-body img{max-width:100%;border-radius:var(--r-lg)}
.post-body table{border-collapse:collapse;margin:24px 0;width:100%;max-width:520px;font-size:14.5px}
.post-body th{text-align:left;padding:10px 16px;background:var(--ink);color:#fff;font-weight:600}
.post-body th:first-child{border-radius:8px 0 0 0}
.post-body th:last-child{border-radius:0 8px 0 0}
.post-body td{padding:10px 16px;border-bottom:1px solid var(--line);color:var(--ink-soft)}
.post-body tr td:first-child{font-weight:600;color:var(--ink)}
</style>
<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: p.title,
  description: p.description,
  datePublished: p.date,
  url,
  image: `${SITE}/og-image.png`,
  author: { '@type': 'Person', name: 'Kaushik A.' },
  publisher: { '@type': 'Organization', name: 'PureNetX', url: SITE }
}, null, 2)}
</script>
</head>
<body>

<nav id="nav">
  <div class="nav-inner">
    <a href="/index.html" class="nav-logo">${LOGO_SVG('shieldClip')}${WORDMARK}</a>
    <ul class="nav-links">
      <li><a href="/why-context.html">Why Context</a></li>
      <li><a href="/technology.html">Technology</a></li>
      <li><a href="/who-we-build-for.html">Who We Build For</a></li>
      <li><a href="/research.html">Research</a></li>
      <li><a href="/current-status.html">Current Status</a></li>
      <li><a href="/future-roadmap.html">Roadmap</a></li>
      <li><a href="/company.html">Company</a></li>
      <li><a href="/blog.html" class="active">Blog</a></li>
    </ul>
    <div class="nav-cta">
      <a href="/current-status.html" class="btn btn-ghost">Our Status</a>
      <a href="/contact.html" class="btn btn-red">Request Demo</a>
    </div>
    <button class="nav-menu-btn" id="menuBtn" aria-label="Menu">☰</button>
  </div>
</nav>
<div class="mobile-nav" id="mobileNav">
  <a href="/why-context.html">Why Context</a>
  <a href="/technology.html">Technology</a>
  <a href="/who-we-build-for.html">Who We Build For</a>
  <a href="/research.html">Research</a>
  <a href="/current-status.html">Current Status</a>
  <a href="/future-roadmap.html">Roadmap</a>
  <a href="/company.html">Company</a>
  <a href="/blog.html">Blog</a>
  <a href="/contact.html" class="btn btn-red">Request Demo</a>
</div>

<div class="page">

<header class="page-header">
  <div class="container">
    <div class="label">PureNetX Research</div>
    <h1>${esc(p.title)}</h1>
    <p>${esc(p.description)}</p>
  </div>
</header>

<section class="section">
  <div class="container">
    <article>
      ${p.category ? `<div><span class="cat-chip">${esc(p.category)}</span></div>` : ''}
      <div class="post-meta"><span>${fmtDate(p.date)}</span> · <span>${readTime(p.body)}</span> · PureNetX</div>
      <div class="post-body">
${bodyHtml}
      </div>
      <p class="mt-48"><a href="/blog.html" class="link-arrow">← All posts</a></p>
    </article>
  </div>
</section>

</div>

<footer>
  <div class="footer-inner">
    <div>
      <a href="/index.html" class="footer-brand">${LOGO_SVG('shieldClip2')}${WORDMARK}</a>
      <p class="footer-tagline">Privacy-first, on-device Context Intelligence Layer for AI Vision Systems.</p>
      <div class="footer-social">
        <a href="https://linkedin.com/company/purenetx" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:purenetx.ai@gmail.com">Email</a>
      </div>
      <div class="footer-legal">© 2026 PureNetX. All rights reserved. · <a href="/privacy-policy.html">Privacy Policy</a> · <a href="/terms.html">Terms of Service</a></div>
    </div>
    <div class="footer-links">
      <a href="/why-context.html">Why Context</a>
      <a href="/technology.html">Technology</a>
      <a href="/current-status.html">Current Status</a>
      <a href="/future-roadmap.html">Roadmap</a>
      <a href="/research.html">Research</a>
      <a href="/company.html">Company</a>
      <a href="/blog.html">Blog</a>
      <a href="/contact.html">Contact</a>
    </div>
  </div>
</footer>

<script src="/main.js"></script>
</body>
</html>
`;
}

// 1. Generate post pages
fs.mkdirSync('posts', { recursive: true });
// remove stale generated pages (posts deleted in CMS disappear from site)
for (const f of fs.readdirSync('posts')) {
  if (f.endsWith('.html')) fs.unlinkSync(path.join('posts', f));
}
for (const p of posts) {
  if (!p.slug) continue;
  fs.writeFileSync(path.join('posts', `${p.slug}.html`), pageHtml(p));
  console.log(`built posts/${p.slug}.html`);
}

// 2. Regenerate sitemap.xml
const corePages = [
  ['', '1.0'],
  ['why-context.html', '0.9'],
  ['technology.html', '0.9'],
  ['who-we-build-for.html', '0.8'],
  ['research.html', '0.8'],
  ['current-status.html', '0.8'],
  ['future-roadmap.html', '0.8'],
  ['company.html', '0.7'],
  ['blog.html', '0.7'],
  ['contact.html', '0.9'],
  ['privacy-policy.html', '0.3'],
  ['terms.html', '0.3'],
];
const urls = corePages.map(([p, pr]) => `  <url><loc>${SITE}/${p}</loc><priority>${pr}</priority></url>`);
for (const p of posts) {
  if (!p.slug) continue;
  urls.push(`  <url><loc>${SITE}/posts/${p.slug}</loc><lastmod>${p.date}</lastmod><priority>0.7</priority></url>`);
}
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
console.log(`sitemap.xml regenerated (${urls.length} urls)`);
