/**
 * voiceInbound — turns Google Voice voicemail / missed-call / SMS emails into leads.
 *
 * Google Voice (free, on the rned@medrevolve.com Workspace account) emails every
 * voicemail transcript, missed call and text to the inbox from voice-noreply@google.com.
 * This runs on the Gmail mailbox trigger, finds those emails, and for each one:
 *   1. creates ONE ContactRequest (source: direct) with caller number + transcript
 *   2. sends ONE alert to rned@ with a clean subject and a tap-to-call link
 *   3. files the original under Leads/Phone so it stays out of the way
 * Dedupes on the Gmail message id, so re-runs never double-create.
 *
 * Also accepts a manual { gmail_message_ids: [...] } body for backfill.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const GMAIL = 'https://gmail.googleapis.com/gmail/v1/users/me';
const RAJ = 'rned@medrevolve.com';
const VOICE_SENDER = /voice-noreply@google\.com|txt\.voice\.google\.com/i;

const mimeSubject = (s) => {
  const clean = String(s ?? '').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim();
  return /^[\x20-\x7E]*$/.test(clean) ? clean : `=?UTF-8?B?${btoa(unescape(encodeURIComponent(clean)))}?=`;
};
const esc = (s = '') => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const b64 = (s) => { try { return decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))); } catch { return ''; } };

function extractText(payload) {
  let plain = '', html = '';
  const walk = (p) => {
    if (!p) return;
    if (p.mimeType === 'text/plain' && p.body?.data) plain += b64(p.body.data);
    else if (p.mimeType === 'text/html' && p.body?.data) html += b64(p.body.data);
    (p.parts || []).forEach(walk);
  };
  walk(payload);
  if (plain.trim()) return plain;
  return html.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseVoice(subject, text) {
  // Subjects look like: "New voicemail from (704) 555-0100", "Missed call from ...", "New text message from ..."
  const kind = /voicemail/i.test(subject) ? 'voicemail' : /text message|sms/i.test(subject) ? 'sms' : /missed call/i.test(subject) ? 'missed_call' : 'call';
  const numMatch = (subject + ' ' + text).match(/\(?\b(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})\b/);
  const phone = numMatch ? `(${numMatch[1]}) ${numMatch[2]}-${numMatch[3]}` : '';
  const nameMatch = subject.match(/from\s+(.+?)(?:\s*\(|$)/i);
  let name = nameMatch ? nameMatch[1].trim() : '';
  if (/^\+?\d[\d\s().-]+$/.test(name)) name = '';
  // Transcript: Google Voice puts it after "Transcript:" or as the main body before the footer
  let transcript = '';
  const t = text.match(/transcript[:\s]+([\s\S]+?)(?:\n\s*\n|To listen|Listen to|Play message|You received this|$)/i);
  if (t) transcript = t[1].trim();
  else if (kind === 'sms') { const m = text.match(/^(.+?)(?:\n\s*\n|YOUR ACCOUNT|To respond|$)/is); transcript = m ? m[1].trim() : text.slice(0, 500); }
  transcript = transcript.replace(/\s+/g, ' ').slice(0, 1500);
  return { kind, phone, name, transcript };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const ids = body?.data?.new_message_ids || body.gmail_message_ids || [];
    if (!ids.length) return Response.json({ processed: 0 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const auth = { Authorization: `Bearer ${accessToken}` };
    const json = { ...auth, 'Content-Type': 'application/json' };
    const labels = (await (await fetch(`${GMAIL}/labels`, { headers: auth })).json()).labels || [];
    let phoneLabel = labels.find(l => l.name === 'Leads/Phone')?.id;
    if (!phoneLabel) {
      const r = await (await fetch(`${GMAIL}/labels`, { method: 'POST', headers: json, body: JSON.stringify({ name: 'Leads/Phone', labelListVisibility: 'labelShow', messageListVisibility: 'show' }) })).json();
      phoneLabel = r.id;
    }

    let processed = 0, skipped = 0;
    for (const id of ids) {
      const m = await (await fetch(`${GMAIL}/messages/${id}?format=full`, { headers: auth })).json();
      const h = (n) => (m.payload?.headers || []).find(x => x.name.toLowerCase() === n.toLowerCase())?.value || '';
      if (!VOICE_SENDER.test(h('From'))) { skipped++; continue; }

      const existing = await base44.asServiceRole.entities.ContactRequest.filter({ notes: { $regex: `gmail_id:${id}` } }, null, 1).catch(() => []);
      if (existing.length) { skipped++; continue; }

      const subject = h('Subject');
      const text = extractText(m.payload);
      const v = parseVoice(subject, text);
      const label = { voicemail: 'Voicemail', sms: 'Text message', missed_call: 'Missed call', call: 'Call' }[v.kind];
      const who = v.name || v.phone || 'Unknown caller';

      await base44.asServiceRole.entities.ContactRequest.create({
        name: who, email: '', phone: v.phone, subject: `${label} from ${who}`,
        message: v.transcript || `${label} received. No transcript.`, source: 'ctm_call', status: 'new',
        call_tracking_number: 'Google Voice', notes: `gmail_id:${id} | voice:${v.kind}`,
      });

      const html = `
<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;padding:20px">
  <p style="color:#666;font-size:13px;margin:0 0 8px">${label} on the MedRevolve line</p>
  <h2 style="margin:0 0 12px">${esc(who)}</h2>
  ${v.transcript ? `<p style="white-space:pre-wrap;font-size:15px;background:#f6f7f6;padding:14px;border-radius:8px">${esc(v.transcript)}</p>` : ''}
  ${v.phone ? `<p style="margin:16px 0"><a href="tel:${v.phone.replace(/\D/g, '')}" style="background:#4A6741;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Call back ${esc(v.phone)}</a></p>` : ''}
</div>`;
      const lines = [`From: MedRevolve Phone <${RAJ}>`, `To: ${RAJ}`, `Subject: ${mimeSubject(`${label}: ${who}${v.transcript ? ' - ' + v.transcript.slice(0, 50) : ''}`)}`,
        'MIME-Version: 1.0', 'Content-Type: text/html; charset=UTF-8', '', html];
      const raw = btoa(unescape(encodeURIComponent(lines.join('\r\n')))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      await fetch(`${GMAIL}/messages/send`, { method: 'POST', headers: json, body: JSON.stringify({ raw }) });

      await fetch(`${GMAIL}/messages/${id}/modify`, { method: 'POST', headers: json, body: JSON.stringify({ addLabelIds: [phoneLabel], removeLabelIds: ['INBOX'] }) });
      processed++;
    }
    console.log('VOICE', JSON.stringify({ processed, skipped }));
    return Response.json({ processed, skipped });
  } catch (error) {
    console.error('voiceInbound error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
