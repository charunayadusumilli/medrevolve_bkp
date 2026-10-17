// Builds JS-free versions of the graphics library for tools that read raw HTML (e.g. Muse):
//   public/social/index.html  and  public/social/feed.json
// Run from the app root after editing src/components/home/launch/socialGraphics.js:
//   node scripts/social/static.mjs
import fs from 'fs';
import { SOCIAL_GRAPHICS, SITE } from '../../src/components/home/launch/socialGraphics.js';

const BOOKING = 'https://calendly.com/rned-medrevolve/medrevolve-intro-call';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const target = (g) => (g.id === '01-launch-in-7-days' ? BOOKING : `${SITE}${g.link}`);

const feed = {
  site: SITE,
  updated: new Date().toISOString(),
  booking_url: BOOKING,
  graphics: SOCIAL_GRAPHICS.map((g) => ({
    id: g.id, post_type: g.type, title: g.title, caption: g.caption, alt: g.alt,
    link: target(g), link_label: g.linkLabel,
    image_png: `${SITE}/social/${g.id}.png`, image_svg: `${SITE}/social/${g.id}.svg`, size: '1080x1080',
  })),
};
fs.writeFileSync('public/social/feed.json', JSON.stringify(feed, null, 2));

const cards = feed.graphics.map((g) => `
  <article id="${g.id}">
    <img src="/social/${g.id}.png" alt="${esc(g.alt)}" width="1080" height="1080" loading="lazy">
    <div>
      <p class="t">${esc(g.post_type)}</p>
      <h2>${esc(g.title)}</h2>
      <p>${esc(g.caption)}</p>
      <p class="l">Link: <a href="${esc(g.link)}">${esc(g.link)}</a></p>
      <p class="l">Image: <a href="${g.image_png}">${g.image_png}</a> (1080 × 1080 PNG) · <a href="${g.image_svg}">SVG</a></p>
    </div>
  </article>`).join('\n');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>MedRevolve Graphics Library</title>
<meta name="description" content="Share-ready MedRevolve graphics with captions and links: the 7-day launch, patient journey, payments, compliance and the $4,000 Telehealth Plan.">
<meta property="og:image" content="${SITE}/social/01-launch-in-7-days.png">
<link rel="canonical" href="${SITE}/social/index.html">
<style>
body{margin:0;background:#0D1411;color:#ECF2ED;font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;padding:40px max(16px,env(safe-area-inset-left,0px))}
main{max-width:1100px;margin:0 auto;display:flex;flex-direction:column;gap:28px}
h1{font:400 2.4rem/1.1 Georgia,serif;margin:0}h2{font:400 1.4rem/1.2 Georgia,serif;margin:4px 0 8px}
a{color:#8ED6A9}.t{font:500 .75rem ui-monospace,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase;color:#E0A668;margin:0}
article{display:grid;grid-template-columns:minmax(0,320px) 1fr;gap:24px;border-top:1px solid #2A3C33;padding-top:24px}
article img{width:100%;height:auto;border-radius:12px;border:1px solid #2A3C33}.l{font-size:.85rem;color:#9BB0A4;word-break:break-all}
@media (max-width:700px){article{grid-template-columns:1fr}}
</style></head><body><main>
<p class="t">MedRevolve · graphics library</p>
<h1>Share-ready graphics, with captions and links</h1>
<p>Each image is 1080 × 1080 for Facebook and Instagram feeds. Machine-readable list: <a href="${SITE}/social/feed.json">${SITE}/social/feed.json</a>. Book a demo: <a href="${BOOKING}">${BOOKING}</a>.</p>
${cards}
</main></body></html>`;
fs.writeFileSync('public/social/index.html', html);
console.log(`wrote ${feed.graphics.length} graphics to public/social/index.html and feed.json`);
