// MedRevolve social graphics generator. Re-run after editing the cards below:
//   mkdir -p /tmp/render && cd /tmp/render && npm i sharp opentype.js@1.3.4 @fontsource/fraunces @fontsource/jetbrains-mono @fontsource/geist-sans
//   cp <app>/scripts/social/gen.mjs . && node gen.mjs <app>/public/social
// Text is converted to vector outlines, so the images render identically everywhere.
// opentype.js must stay on 1.3.4: version 2.0.0 corrupts some glyph outlines.
import opentype from 'opentype.js';
import sharp from 'sharp';
import fs from 'fs';
const FD = 'node_modules/@fontsource';
const load = (p) => { const b = fs.readFileSync(`${FD}/${p}`); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
const F  = load('fraunces/files/fraunces-latin-400-normal.woff');
const FI = load('fraunces/files/fraunces-latin-400-italic.woff');
const G  = load('geist-sans/files/geist-sans-latin-400-normal.woff');
const G6 = load('geist-sans/files/geist-sans-latin-600-normal.woff');
const M  = load('jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff');
const C = { bg:'#0D1411', bg2:'#111A16', surface:'#16211C', line:'#2A3C33', fg:'#ECF2ED', muted:'#9BB0A4', sage:'#8ED6A9', ink:'#0D1411', brass:'#E0A668', alert:'#F08A7A', moss:'#4A6741' };
const W = 1080, H = 1080;
const adv = (f, ch, size) => f.charToGlyph(ch).advanceWidth * size / f.unitsPerEm;
const width = (f, s, size, ls = 0) => ls ? [...s].reduce((a, ch) => a + adv(f, ch, size), 0) + ls * ([...s].length - 1) : f.getAdvanceWidth(s, size);
function t(s, x, y, { f = G, size = 32, fill = C.fg, anchor = 'start', ls = 0 } = {}) {
  const w = width(f, s, size, ls);
  let cx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  if (!ls) return `<path d="${f.getPath(s, cx, y, size).toPathData(2)}" fill="${fill}"/>`;
  let out = '';
  for (const ch of s) { out += f.charToGlyph(ch).getPath(cx, y, size).toPathData(2); cx += adv(f, ch, size) + ls; }
  return `<path d="${out}" fill="${fill}"/>`;
}
function wrap(s, f, size, maxW) {
  const words = s.split(' '); const lines = []; let cur = '';
  for (const w of words) { const n = cur ? cur + ' ' + w : w; if (width(f, n, size) > maxW && cur) { lines.push(cur); cur = w; } else cur = n; }
  if (cur) lines.push(cur); return lines;
}
function para(s, x, y, maxW, o = {}) {
  const f = o.f || G, size = o.size || 30, lh = o.lh || size * 1.35;
  return wrap(s, f, size, maxW).map((l, i) => t(l, x, y + i * lh, { ...o, f, size })).join('');
}
const eyebrow = (s, x = 90, y = 150) => t(s.toUpperCase(), x, y, { f: M, size: 22, fill: C.brass, ls: 3.5 });
function frame(inner, { glow = [900, 120] } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs><radialGradient id="g" cx="${glow[0]}" cy="${glow[1]}" r="620" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.sage}" stop-opacity=".22"/><stop offset="1" stop-color="${C.sage}" stop-opacity="0"/></radialGradient>
<linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.sage}"/><stop offset=".55" stop-color="${C.brass}"/><stop offset="1" stop-color="${C.sage}"/></linearGradient>
<marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${C.sage}"/></marker></defs>
<rect width="${W}" height="${H}" fill="${C.bg}"/><rect width="${W}" height="${H}" fill="url(#g)"/>
${inner}
<line x1="90" y1="968" x2="${W - 90}" y2="968" stroke="${C.line}" stroke-width="2"/>
<rect x="90" y="996" width="40" height="40" rx="12" fill="url(#lg)"/><circle cx="110" cy="1016" r="8" fill="${C.bg}"/>
${t('MedRevolve', 146, 1028, { f: F, size: 34 })}
${t('medrevolve.com', W - 90, 1026, { f: M, size: 24, fill: C.muted, anchor: 'end' })}
</svg>`;
}
const cards = {};

// 1 hero
cards['01-launch-in-7-days'] = frame(`
${eyebrow('White-label telehealth infrastructure')}
${t('Your brand.', 90, 260, { f: F, size: 92 })}
${t('Your telehealth business.', 90, 362, { f: F, size: 70 })}
${t('Live in about 7 days.', 90, 456, { f: FI, size: 80, fill: C.sage })}
<g transform="translate(90,510)">
  <rect width="900" height="330" rx="26" fill="#FBFAF7"/>
  <rect width="900" height="52" rx="26" fill="#ECEAE4"/><rect y="30" width="900" height="22" fill="#ECEAE4"/>
  <circle cx="30" cy="26" r="7" fill="#CFCBC1"/><circle cx="52" cy="26" r="7" fill="#CFCBC1"/><circle cx="74" cy="26" r="7" fill="#CFCBC1"/>
  <rect x="104" y="12" width="420" height="28" rx="8" fill="#fff"/>${t('lumenaesthetics.com', 120, 33, { f: M, size: 17, fill: '#5B635E' })}
  <rect x="30" y="74" width="30" height="30" rx="9" fill="${C.moss}"/>${t('Lumen Aesthetics', 72, 98, { f: G6, size: 24, fill: '#1A1F1C' })}
  <rect x="30" y="122" width="840" height="178" rx="20" fill="#E9EEE8"/>
  ${t('Weight care, guided by', 58, 180, { f: F, size: 40, fill: '#141A17' })}
  ${t('licensed providers.', 58, 228, { f: F, size: 40, fill: '#141A17' })}
  <rect x="58" y="248" width="200" height="40" rx="20" fill="${C.moss}"/>${t('Start your visit', 158, 275, { f: G6, size: 19, fill: '#fff', anchor: 'middle' })}
  ${t('YOUR BRAND, NOT OURS', 842, 278, { f: M, size: 15, fill: '#5E7A58', anchor: 'end', ls: 2 })}
</g>
${(() => { let x = 90; return ['~7 days to live', '50-state provider network', '14 items included'].map((s, i) => { const out = (i ? t('·', x + 14, 912, { f: G6, size: 28, fill: C.muted }) : '') + t(s, x + (i ? 40 : 0), 912, { f: G6, size: 28 }); x += (i ? 40 : 0) + width(G6, s, 28); return out; }).join(''); })()}
`);

// 2 seven-day timeline
const DAYS = [['Brand & discovery', 'Name, logo, colors, domain, programs, states'], ['Storefront build', 'Your site on your domain, intake to checkout'], ['Providers plugged in', 'Visit types, intake, e-prescribing tested'], ['Pharmacy plugged in', '503A fulfilment, shipping and tracking tested'], ['Payments live', 'Merchant account, refunds, refills, payouts'], ['Compliance check', 'HIPAA, LegitScript readiness, claims review'], ['Go live & announce', 'CRM on, posts out, named support contact']];
cards['02-seven-day-launch'] = frame(`
${eyebrow('The walkthrough')}
${t('Launch in about', 90, 236, { f: F, size: 66 })}${t('7 days.', 90 + width(F, 'Launch in about ', 66), 236, { f: FI, size: 66, fill: C.sage })}
<line x1="128" y1="322" x2="128" y2="874" stroke="${C.line}" stroke-width="3"/>
<line x1="128" y1="322" x2="128" y2="874" stroke="${C.sage}" stroke-width="3" stroke-dasharray="6 10"/>
${DAYS.map(([a, b], i) => { const y = 322 + i * 92; const last = i === 6;
  return `<circle cx="128" cy="${y}" r="30" fill="${last ? C.sage : C.surface}" stroke="${C.sage}" stroke-width="2.5"/>
  ${t(String(i + 1), 128, y + 10, { f: M, size: 26, fill: last ? C.ink : C.fg, anchor: 'middle' })}
  ${t(`Day ${i + 1}`, 186, y - 2, { f: M, size: 18, fill: C.brass, ls: 1 })}
  ${t(a, 290, y - 2, { f: G6, size: 30 })}
  ${t(b, 186, y + 32, { f: G, size: 22, fill: C.muted })}`; }).join('')}
`, { glow: [980, 980] });

// 3 patient journey (snake)
const J = ['Visitor', 'Intake', 'Provider review', 'Prescription', 'Pharmacy', 'Follow-up & refill'];
const JS = ['Lands on your page', 'Online questions', 'Licensed in state', 'Only if appropriate', 'Filled and shipped', 'Tracked in your CRM'];
const nodeW = 260, nodeH = 150, gx = 60, x0 = 90;
const pos = J.map((_, i) => { const r = Math.floor(i / 3); const c = r === 0 ? i : 5 - i; return [x0 + c * (nodeW + gx), 380 + r * 260]; });
cards['03-patient-journey'] = frame(`
${eyebrow('Behind the storefront')}
${t('One journey explains', 90, 236, { f: F, size: 64 })}
${t('the whole business.', 90, 310, { f: FI, size: 64, fill: C.sage })}
${pos.slice(0, -1).map(([x, y], i) => { const [nx, ny] = pos[i + 1];
  if (ny === y) { const dir = nx > x ? 1 : -1; const sx = dir > 0 ? x + nodeW + 6 : x - 6; const ex = dir > 0 ? nx - 8 : nx + nodeW + 8;
    return `<line x1="${sx}" y1="${y + nodeH / 2}" x2="${ex}" y2="${y + nodeH / 2}" stroke="${C.sage}" stroke-width="3" marker-end="url(#ar)"/>`; }
  return `<path d="M${x + nodeW / 2},${y + nodeH + 6} L${x + nodeW / 2},${ny - 10}" stroke="${C.sage}" stroke-width="3" fill="none" marker-end="url(#ar)"/>`; }).join('')}
${pos.map(([x, y], i) => `<rect x="${x}" y="${y}" width="${nodeW}" height="${nodeH}" rx="22" fill="${C.surface}" stroke="${i === 3 ? C.brass : C.line}" stroke-width="2"/>
  ${t(`0${i + 1}`, x + 26, y + 46, { f: M, size: 20, fill: C.brass })}
  ${t(J[i], x + 26, y + 92, { f: G6, size: J[i].length > 14 ? 26 : 30 })}
  ${t(JS[i], x + 26, y + 126, { f: G, size: 20, fill: C.muted })}`).join('')}
${t('You sell under your brand. We connect the regulated pieces.', 90, 912, { f: G, size: 26, fill: C.muted })}
`);

// 4 five questions
const Q = [['Can I launch fast?', 'A dated Day 1 to Day 7 plan.'], ['Will it look like mine?', 'Your logo, colors, domain and programs.'], ['Who treats my patients?', 'Licensed providers, named and explained.'], ['How do orders and money work?', 'Fulfilment, payouts, a healthcare-ready account.'], ['Am I compliant?', 'Audits, rule changes and fixes, ongoing.']];
cards['04-five-questions'] = frame(`
${eyebrow('Before you launch')}
${t('Five questions every', 90, 236, { f: F, size: 64 })}
${t('owner asks.', 90, 310, { f: FI, size: 64, fill: C.sage })}
${Q.map(([q, a], i) => { const y = 400 + i * 112; return `<line x1="90" y1="${y - 46}" x2="990" y2="${y - 46}" stroke="${C.line}" stroke-width="1.5"/>
  ${t(`0${i + 1}`, 90, y, { f: M, size: 24, fill: C.brass })}
  ${t(q, 160, y, { f: F, size: 38 })}
  ${t(a, 160, y + 40, { f: G, size: 24, fill: C.muted })}`; }).join('')}
`, { glow: [120, 980] });

// 5 payments
const P = [['Checkout', 'Your brand'], ['Authorize', 'Card approved'], ['Settle', 'Funds clear'], ['Payout', 'To your bank']];
cards['05-payments'] = frame(`
${eyebrow('Payments')}
${t('A merchant account', 90, 236, { f: F, size: 64 })}
${t("that won't freeze", 90, 310, { f: F, size: 64 })}
${t("because you're healthcare.", 90, 384, { f: FI, size: 64, fill: C.sage })}
${P.map(([a, b], i) => { const x = 90 + i * 232; return `<rect x="${x}" y="470" width="196" height="132" rx="20" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
  ${t(a, x + 22, 528, { f: G6, size: 28 })}${t(b, x + 22, 566, { f: G, size: 20, fill: C.muted })}
  ${i < 3 ? `<line x1="${x + 200}" y1="536" x2="${x + 228}" y2="536" stroke="${C.sage}" stroke-width="3" marker-end="url(#ar)"/>` : ''}`; }).join('')}
${[['Subscriptions & refills', 'Billed as refills are approved'], ['Refunds & chargebacks', 'Tracked per order, records ready'], ['Backup processor', 'Lined up if rules change']].map(([a, b], i) => { const x = 90 + i * 306;
  return `<rect x="${x}" y="650" width="270" height="4" fill="${C.brass}"/>${t(a, x, 702, { f: G6, size: 24 })}${para(b, x, 740, 260, { f: G, size: 21, fill: C.muted, lh: 28 })}`; }).join('')}
${t('Every fee listed in your agreement before you sign.', 90, 912, { f: G, size: 26, fill: C.muted })}
`);

// 6 compliance
const CY = [['Regular audit runs', 'Site claims, intake, privacy, prescribing, ads'], ['Change monitoring', 'Federal and state rules, tracked centrally'], ['Announcements', 'What changed, what to do, and by when'], ['Remediation', 'We update pages; you approve brand changes'], ['Record', 'Audit log and history in your dashboard']];
cards['06-compliance-service'] = frame(`
${eyebrow('Compliance')}
${t('Compliance is a service,', 90, 236, { f: F, size: 62 })}
${t('not a launch checkbox.', 90, 308, { f: FI, size: 62, fill: C.sage })}
<line x1="124" y1="404" x2="124" y2="852" stroke="${C.line}" stroke-width="3"/>
${CY.map(([a, b], i) => { const y = 404 + i * 112; return `<circle cx="124" cy="${y}" r="34" fill="${C.surface}" stroke="${C.sage}" stroke-width="2.5"/>
  ${t(`0${i + 1}`, 124, y + 9, { f: M, size: 24, fill: C.sage, anchor: 'middle' })}
  ${t(a, 190, y - 4, { f: G6, size: 32 })}${t(b, 190, y + 34, { f: G, size: 23, fill: C.muted })}`; }).join('')}
`, { glow: [980, 980] });

// 7 telehealth plan
const PL = ['Custom telehealth platform', 'Plugins & integrations', 'Admin & patient dashboard', 'Doctor profiles & booking', 'Secure video & audio visits', 'Patient dashboard & history', 'Secure patient messaging', 'Payment gateway', 'Security, compliance-ready', 'LegitScript readiness guidance', 'Dedicated project manager', 'Testing & QA', 'Post-launch tech help', 'Growth & scale support'];
cards['07-telehealth-plan'] = frame(`
${eyebrow('Telehealth Plan')}
${t('Everything included,', 90, 236, { f: F, size: 66 })}
${t('listed in full.', 90, 312, { f: FI, size: 66, fill: C.sage })}
${PL.map((s, i) => { const col = i < 7 ? 0 : 1; const r = i % 7; const x = 90 + col * 460; const y = 400 + r * 72;
  return `${t(String(i + 1).padStart(2, '0'), x, y, { f: M, size: 22, fill: C.brass })}${t(s, x + 52, y, { f: G, size: 27 })}`; }).join('')}
<rect x="90" y="878" width="440" height="58" rx="29" fill="${C.sage}"/>${t('Get your setup quote', 310, 916, { f: G6, size: 25, fill: C.ink, anchor: 'middle' })}
${t('Free 20-minute call', 560, 916, { f: G, size: 24, fill: C.muted })}
`, { glow: [120, 120] });

// 8 checklist
const CL = ['Business name, logo and colors', 'A domain you own', 'Programs and target states', 'Business details for underwriting', 'Owner ID', 'Business bank account', 'Program pricing', 'Who answers patient messages', 'Your launch announcement list'];
cards['08-launch-checklist'] = frame(`
${eyebrow('Free checklist')}
${t('Have these ready', 90, 236, { f: F, size: 66 })}
${t('before Day 1.', 90, 312, { f: FI, size: 66, fill: C.sage })}
${CL.map((s, i) => { const y = 392 + i * 52; return `<rect x="90" y="${y - 28}" width="32" height="32" rx="8" fill="${C.sage}" fill-opacity=".18" stroke="${C.sage}" stroke-width="2"/>
  <path d="M98,${y - 12} l7,7 l12,-14" stroke="${C.sage}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  ${t(s, 146, y, { f: G, size: 29 })}`; }).join('')}
<rect x="90" y="878" width="400" height="58" rx="29" fill="${C.sage}"/>${t('Get the full checklist', 290, 916, { f: G6, size: 25, fill: C.ink, anchor: 'middle' })}
`, { glow: [980, 980] });

fs.mkdirSync(process.argv[2], { recursive: true });
for (const [name, svg] of Object.entries(cards)) {
  fs.writeFileSync(`${process.argv[2]}/${name}.svg`, svg);
  await sharp(Buffer.from(svg), { density: 72 }).png({ compressionLevel: 9 }).toFile(`${process.argv[2]}/${name}.png`);
}
console.log(Object.keys(cards).join('\n'));
