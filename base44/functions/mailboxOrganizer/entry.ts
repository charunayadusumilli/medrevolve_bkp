/**
 * mailboxOrganizer — keeps rned@medrevolve.com clean and readable.
 *
 * Folders (plain Gmail labels, no emojis):
 *   Partners/Pharmacy, Partners/Telehealth, Partners/Providers, Partners/Attorneys,
 *   Partners/Vendors, People, Leads/B2B   -> stay in the inbox
 *   Accounts & Billing, System Alerts, Junk -> labeled and archived (never deleted)
 *
 * Modes (JSON body):
 *   { mode: "audit",  max?: 600 }   dry run: classify a sample, change nothing, return a report
 *   { mode: "apply" }               organize the next batch of existing mail, resumes where it stopped
 *   { mode: "reset" }               restart the apply pass from the newest mail
 *   { mode: "finalize" }            remove the old emoji "MedRevolve/..." labels (mail is untouched)
 *   mailbox trigger payload          { data: { new_message_ids: [...] } } organizes new mail as it arrives
 *
 * Also saves a clean copy of every non-junk message's header into MailItem for the Inbox Board page.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const GMAIL = 'https://gmail.googleapis.com/gmail/v1/users/me';
const MAILBOX = 'rned@medrevolve.com';
const FOLDERS = [
  'Partners/Pharmacy', 'Partners/Telehealth', 'Partners/Providers', 'Partners/Attorneys',
  'Partners/Vendors', 'People', 'Leads/B2B', 'Accounts & Billing', 'System Alerts', 'Junk',
];
const ARCHIVED = new Set(['Accounts & Billing', 'System Alerts', 'Junk']);
const KEEP_IN_INBOX = new Set(['Partners/Pharmacy', 'Partners/Telehealth', 'Partners/Providers',
  'Partners/Attorneys', 'Partners/Vendors', 'People', 'Leads/B2B']);

// Known relationships, checked before anything else
const CORE = [
  [/purerx/i, 'Partners/Pharmacy', 'PureRx'],
  [/beluga/i, 'Partners/Telehealth', 'Beluga Health'],
  [/openloop/i, 'Partners/Telehealth', 'OpenLoop'],
  [/mdintegrations/i, 'Partners/Telehealth', 'MD Integrations'],
  [/qualiphy/i, 'Partners/Telehealth', 'Qualiphy'],
  [/@emed\.com|emed\.com>/i, 'Partners/Telehealth', 'eMed'],
  [/tellescope/i, 'Partners/Vendors', 'Tellescope'],
  [/legitscript/i, 'Partners/Vendors', 'LegitScript'],
  [/byrdadatto/i, 'Partners/Attorneys', 'Byrd Adatto'],
];
const PEOPLE = /cardgroupintl|ciambotti|karthik|pehuen/i;
const ACCOUNT_SENDERS = /stripe|google|godaddy|ionos|namecheap|base44|hubspot|twilio|zoho|intuit|quickbooks|paypal|apple|microsoft|calendly|sendgrid|shopify|squarespace|wix|linkedin|amazon|aws|github|slack|zoom|docusign|adobe|cloudflare|vercel|openai|anthropic/i;
const ACCOUNT_SUBJECTS = /receipt|invoice|payment|paid|verif|security|password|sign.?in|log.?in|account|billing|domain|renew|code|subscription|trial|charge|refund|payout|statement|order|confirm/i;
const KEYWORDS = [
  [/pharmac|compounding|\b503[ab]\b|fulfil?lment/i, 'Partners/Pharmacy'],
  [/attorney|law firm|legal counsel|\besq\b/i, 'Partners/Attorneys'],
  [/white.?label|merchant account|launch (my|your|our|a) (brand|platform|clinic)|telehealth (brand|business)|\bb2b\b|partnership|partner with/i, 'Leads/B2B'],
  [/telehealth|telemedicine/i, 'Partners/Telehealth'],
  [/physician|medical director|nurse practitioner|provider network|credential/i, 'Partners/Providers'],
];

const decodeEntities = (s = '') => String(s)
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
  .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&');

const cleanText = (s = '') => decodeEntities(s)
  .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, '')
  .replace(/\s+/g, ' ').trim();

const parseFrom = (from = '') => {
  const m = from.match(/^\s*"?([^"<]*)"?\s*<([^>]+)>/);
  if (m) return { name: cleanText(m[1]) || m[2], email: m[2].toLowerCase() };
  return { name: from.trim(), email: from.trim().toLowerCase() };
};

const rootDomain = (url = '') => {
  try {
    const h = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.toLowerCase();
    return h.replace(/^www\./, '');
  } catch { return ''; }
};

function classify(m, partnerDomains) {
  const { from, to, subject, labelIds, bulk } = m;
  const sender = parseFrom(from);
  const senderDomain = sender.email.split('@')[1] || '';
  const text = `${subject} ${m.snippet}`;

  if (/mailer-daemon|postmaster@/i.test(from)) return { folder: 'System Alerts' };
  // App-generated alerts: mail from MedRevolve's own addresses to itself
  if (/@medrevolve\.com/i.test(sender.email) && (/@medrevolve\.com/i.test(to) || !to)) return { folder: 'System Alerts' };
  if (PEOPLE.test(from)) return { folder: 'People' };
  for (const [rx, folder, name] of CORE) if (rx.test(from)) return { folder, partner: name };
  const match = partnerDomains.get(senderDomain) ||
    partnerDomains.get(senderDomain.split('.').slice(-2).join('.'));
  if (match) return { folder: match.folder, partner: match.name };

  const noreply = /no-?reply|do-?not-?reply|notifications?@|alerts?@|mailer@|news(letter)?@|info@|hello@|marketing@/i.test(sender.email);
  if (/base44/i.test(from)) return { folder: ACCOUNT_SUBJECTS.test(subject) ? 'Accounts & Billing' : 'System Alerts' };
  if (ACCOUNT_SENDERS.test(senderDomain) && (bulk || noreply || ACCOUNT_SUBJECTS.test(subject))) return { folder: 'Accounts & Billing' };
  const promo = (labelIds || []).some(l => ['CATEGORY_PROMOTIONS', 'CATEGORY_SOCIAL', 'CATEGORY_FORUMS'].includes(l));
  if (bulk || promo) return { folder: 'Junk' };
  if (noreply) return { folder: ACCOUNT_SUBJECTS.test(subject) ? 'Accounts & Billing' : 'Junk' };
  for (const [rx, folder] of KEYWORDS) if (rx.test(text)) return { folder };
  return { folder: 'Inbox' };
}

Deno.serve(async (req) => {
  const started = Date.now();
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const isTrigger = Array.isArray(body?.data?.new_message_ids);
    const mode = isTrigger ? 'incoming' : (body.mode || 'audit');

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const auth = { Authorization: `Bearer ${accessToken}` };
    const json = { ...auth, 'Content-Type': 'application/json' };
    const gget = async (path) => {
      const r = await fetch(`${GMAIL}${path}`, { headers: auth });
      if (!r.ok) throw new Error(`Gmail ${r.status} on ${path}: ${await r.text()}`);
      return r.json();
    };

    // Labels
    const labelsData = await gget('/labels');
    const labelMap = {};
    (labelsData.labels || []).forEach(l => { labelMap[l.name] = l.id; });

    if (mode === 'finalize') {
      const old = (labelsData.labels || []).filter(l => l.type === 'user' && l.name.startsWith('MedRevolve/'))
        .sort((a, b) => b.name.length - a.name.length);
      const parent = (labelsData.labels || []).find(l => l.name === 'MedRevolve');
      const removed = [];
      for (const l of [...old, ...(parent ? [parent] : [])]) {
        const r = await fetch(`${GMAIL}/labels/${l.id}`, { method: 'DELETE', headers: auth });
        if (r.ok || r.status === 204) removed.push(l.name);
      }
      return Response.json({ success: true, mode, removed_labels: removed.length, names: removed });
    }

    if (mode !== 'audit') {
      for (const name of FOLDERS) {
        if (labelMap[name]) continue;
        // create parent first for nested names
        if (name.includes('/')) {
          const p = name.split('/')[0];
          if (!labelMap[p]) {
            const pr = await fetch(`${GMAIL}/labels`, { method: 'POST', headers: json,
              body: JSON.stringify({ name: p, labelListVisibility: 'labelShow', messageListVisibility: 'show' }) });
            const pd = await pr.json(); if (pd.id) labelMap[p] = pd.id;
          }
        }
        const r = await fetch(`${GMAIL}/labels`, { method: 'POST', headers: json,
          body: JSON.stringify({ name, labelListVisibility: 'labelShow', messageListVisibility: 'show' }) });
        const d = await r.json(); if (d.id) labelMap[name] = d.id;
      }
    }

    // Partner domains from the outreach table
    const partnerDomains = new Map();
    try {
      const partners = await base44.asServiceRole.entities.PartnershipOutreach.filter({}, null, 1000);
      for (const p of partners) {
        const d = rootDomain(p.website || '');
        if (d && !/reddit\.com$/.test(d)) partnerDomains.set(d, { folder: `Partners/${p.folder === 'Providers' ? 'Providers' : p.folder === 'Telehealth' ? 'Telehealth' : p.folder === 'Pharmacy' ? 'Pharmacy' : p.folder === 'Attorneys' ? 'Attorneys' : 'Vendors'}`, name: p.partner_name });
      }
    } catch (e) { console.warn('Partner list unavailable:', e.message); }

    // Message ids to process
    let ids = [];
    let state = null;
    let nextToken = null;
    const max = Math.min(Number(body.max) || (mode === 'audit' ? 600 : 400), 1500);
    if (isTrigger) {
      ids = body.data.new_message_ids;
    } else {
      if (mode === 'apply' || mode === 'reset') {
        const st = await base44.asServiceRole.entities.MailboxState.filter({ key: 'cleanup' });
        state = st[0] || await base44.asServiceRole.entities.MailboxState.create({ key: 'cleanup', processed: 0, done: false });
        if (mode === 'reset') {
          await base44.asServiceRole.entities.MailboxState.update(state.id, { page_token: '', processed: 0, done: false });
          return Response.json({ success: true, mode, message: 'Cleanup pass will restart from the newest mail.' });
        }
        if (state.done) return Response.json({ success: true, mode, done: true, processed: state.processed, message: 'All existing mail is organized. New mail is handled as it arrives.' });
      }
      let token = state?.page_token || '';
      while (ids.length < max) {
        const q = encodeURIComponent('-in:chats -in:drafts -in:trash -in:spam');
        const page = await gget(`/messages?maxResults=${Math.min(500, max - ids.length)}&q=${q}${token ? `&pageToken=${token}` : ''}`);
        ids.push(...(page.messages || []).map(x => x.id));
        token = page.nextPageToken || '';
        if (!token) break;
      }
      nextToken = token;
    }

    // Fetch metadata in parallel chunks
    const hdrs = ['From', 'To', 'Subject', 'Date', 'List-Unsubscribe', 'Precedence'].map(h => `metadataHeaders=${h}`).join('&');
    const msgs = [];
    for (let i = 0; i < ids.length; i += 25) {
      const chunk = await Promise.all(ids.slice(i, i + 25).map(id =>
        fetch(`${GMAIL}/messages/${id}?format=metadata&${hdrs}`, { headers: auth }).then(r => r.ok ? r.json() : null).catch(() => null)));
      for (const m of chunk) {
        if (!m) continue;
        const h = (n) => (m.payload?.headers || []).find(x => x.name.toLowerCase() === n.toLowerCase())?.value || '';
        msgs.push({
          id: m.id, threadId: m.threadId, labelIds: m.labelIds || [], from: h('From'), to: h('To'),
          subject: h('Subject'), date: Number(m.internalDate) || Date.now(), snippet: decodeEntities(m.snippet || ''),
          bulk: !!h('List-Unsubscribe') || /bulk|list|junk/i.test(h('Precedence')),
        });
      }
      if (Date.now() - started > 150000) break;
    }

    // Classify
    const plan = {};
    const report = {};
    for (const m of msgs) {
      // Outgoing mail only (no inbox copy): leave alone
      if (m.labelIds.includes('SENT') && !m.labelIds.includes('INBOX')) continue;
      const c = classify(m, partnerDomains);
      m.folder = c.folder; m.partner = c.partner || '';
      const r = report[c.folder] ||= { count: 0, senders: {}, samples: [] };
      r.count++;
      const s = parseFrom(m.from).email; r.senders[s] = (r.senders[s] || 0) + 1;
      if (r.samples.length < 6) r.samples.push(cleanText(m.subject).slice(0, 90));
      if (c.folder === 'Inbox') continue;
      const add = [labelMap[c.folder]].filter(Boolean);
      const remove = [];
      if (ARCHIVED.has(c.folder) && m.labelIds.includes('INBOX')) remove.push('INBOX');
      // Bring recent partner mail back to the inbox if a filter had archived it
      if (KEEP_IN_INBOX.has(c.folder) && !m.labelIds.includes('INBOX') && Date.now() - m.date < 120 * 864e5) add.push('INBOX');
      const key = `${add.join(',')}|${remove.join(',')}`;
      (plan[key] ||= { add, remove, ids: [] }).ids.push(m.id);
    }
    for (const r of Object.values(report)) {
      r.top_senders = Object.entries(r.senders).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([e, n]) => `${e} (${n})`);
      delete r.senders;
    }

    if (mode === 'audit') {
      const out = { success: true, mode, scanned: msgs.length, mailbox: MAILBOX, at: new Date().toISOString(), report };
      const st = await base44.asServiceRole.entities.MailboxState.filter({ key: 'audit' });
      if (st[0]) await base44.asServiceRole.entities.MailboxState.update(st[0].id, { last_report: JSON.stringify(out) });
      else await base44.asServiceRole.entities.MailboxState.create({ key: 'audit', last_report: JSON.stringify(out) });
      console.log('AUDIT', JSON.stringify(out));
      return Response.json(out);
    }

    // Apply label changes
    let changed = 0;
    for (const p of Object.values(plan)) {
      if (!p.add.length && !p.remove.length) continue;
      for (let i = 0; i < p.ids.length; i += 1000) {
        const r = await fetch(`${GMAIL}/messages/batchModify`, { method: 'POST', headers: json,
          body: JSON.stringify({ ids: p.ids.slice(i, i + 1000), addLabelIds: p.add, removeLabelIds: p.remove }) });
        if (r.ok || r.status === 204) changed += p.ids.slice(i, i + 1000).length;
        else console.error('batchModify failed:', await r.text());
      }
    }

    // Save clean headers for the Inbox Board (everything except junk)
    let saved = 0;
    const keep = msgs.filter(m => m.folder && m.folder !== 'Junk');
    if (keep.length) {
      const existing = new Set();
      for (let i = 0; i < keep.length; i += 100) {
        const found = await base44.asServiceRole.entities.MailItem.filter({ gmail_id: { $in: keep.slice(i, i + 100).map(m => m.id) } }, null, 200);
        found.forEach(f => existing.add(f.gmail_id));
      }
      const rows = keep.filter(m => !existing.has(m.id)).map(m => {
        const f = parseFrom(m.from);
        return {
          gmail_id: m.id, thread_id: m.threadId, folder: m.folder,
          from_name: f.name || f.email, from_email: f.email,
          subject: cleanText(m.subject) || '(no subject)', snippet: cleanText(m.snippet).slice(0, 300),
          received_at: new Date(m.date).toISOString(), is_unread: m.labelIds.includes('UNREAD'),
          gmail_url: `https://mail.google.com/mail/u/?authuser=${MAILBOX}#all/${m.threadId}`,
          partner_name: m.partner,
        };
      });
      for (let i = 0; i < rows.length; i += 50) {
        await base44.asServiceRole.entities.MailItem.bulkCreate(rows.slice(i, i + 50));
        saved += rows.slice(i, i + 50).length;
      }
    }

    if (state) {
      await base44.asServiceRole.entities.MailboxState.update(state.id, {
        page_token: nextToken || '', processed: (state.processed || 0) + msgs.length, done: !nextToken,
        last_report: JSON.stringify(Object.fromEntries(Object.entries(report).map(([k, v]) => [k, v.count]))),
      });
    }

    const out = { success: true, mode, at: new Date().toISOString(), scanned: msgs.length, labeled: changed, saved_to_board: saved,
      more_to_do: !!nextToken, folders: Object.fromEntries(Object.entries(report).map(([k, v]) => [k, v.count])) };
    const st = await base44.asServiceRole.entities.MailboxState.filter({ key: `last_${mode}` });
    if (st[0]) await base44.asServiceRole.entities.MailboxState.update(st[0].id, { last_report: JSON.stringify(out) });
    else await base44.asServiceRole.entities.MailboxState.create({ key: `last_${mode}`, last_report: JSON.stringify(out) });
    console.log('RESULT', JSON.stringify(out));
    return Response.json(out);
  } catch (error) {
    console.error('mailboxOrganizer error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
