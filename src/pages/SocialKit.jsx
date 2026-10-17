import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { LAUNCH_CSS } from '@/components/home/launch/launchStyles';
import { SOCIAL_GRAPHICS, SITE } from '@/components/home/launch/socialGraphics';
import { BOOKING_URL } from '@/lib/contactConfig';

// Public graphics library: every share-ready image with its caption and target link.
// Social tools (Muse) pick images from here: /social/<id>.png (1080x1080) and /social/<id>.svg.
const KIT_CSS = `
.mrx .kit{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr));gap:22px}
.mrx .kcard{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;display:flex;flex-direction:column}
.mrx .kcard img{display:block;width:100%;height:auto;aspect-ratio:1/1;max-width:100%}
.mrx .kbody{padding:18px;display:flex;flex-direction:column;gap:10px;flex:1}
.mrx .ktype{font-family:var(--f-mono);font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--brass)}
.mrx .kbody h3{font-size:1.2rem}
.mrx .kcap{font-size:.9rem;color:var(--muted)}
.mrx .kact{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}
.mrx .kact a,.mrx .kact button{font:inherit;font-size:.82rem;border:1px solid var(--line);border-radius:999px;padding:6px 12px;background:transparent;color:var(--fg);text-decoration:none;cursor:pointer}
.mrx .kact a:hover,.mrx .kact button:hover{background:var(--bg-2)}
.mrx .kact .go{border-color:var(--sage);color:var(--sage)}
`;

function linkFor(g) { return g.type === 'Launch / offer' && g.id === '01-launch-in-7-days' ? BOOKING_URL : `${SITE}${g.link}`; }

function Card({ g }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(`${g.caption}\n\n${linkFor(g)}`); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { setCopied(false); }
  };
  return (
    <article className="kcard" id={g.id}>
      <img src={`/social/${g.id}.png`} alt={g.alt} width="1080" height="1080" loading="lazy" />
      <div className="kbody">
        <span className="ktype">{g.type}</span>
        <h3>{g.title}</h3>
        <p className="kcap">{g.caption}</p>
        <div className="kact">
          <button type="button" onClick={copy}>{copied ? 'Caption copied' : 'Copy caption + link'}</button>
          <a href={`/social/${g.id}.png`} download>PNG</a>
          <a href={`/social/${g.id}.svg`} download>SVG</a>
          <a className="go" href={linkFor(g)} target={linkFor(g).startsWith('http') && !linkFor(g).startsWith(SITE) ? '_blank' : undefined} rel="noopener noreferrer">{g.linkLabel}</a>
        </div>
      </div>
    </article>
  );
}

export default function SocialKit() {
  return (
    <div className="mrx">
      <style>{LAUNCH_CSS + KIT_CSS}</style>
      <SEOHead title="MedRevolve Graphics Library" description="Share-ready MedRevolve graphics with captions: the 7-day launch, patient journey, payments, compliance and the $4,000 Telehealth Plan." ogImage={`${SITE}/social/01-launch-in-7-days.png`} />
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Graphics library</span>
            <h2>Share-ready, <em className="i">straight from the site.</em></h2>
            <p className="lead">Every graphic is 1080 × 1080 for Facebook and Instagram feeds, with a caption and the page each post should link to.</p>
          </div>
          <div className="kit">{SOCIAL_GRAPHICS.map((g) => <Card key={g.id} g={g} />)}</div>
        </div>
      </section>
    </div>
  );
}
