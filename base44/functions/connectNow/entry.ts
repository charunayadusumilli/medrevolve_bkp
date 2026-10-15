/**
 * connectNow — real-time "talk to an MR Personal Onboarding Specialist" for the public site.
 *
 * GET / POST { action: "status" }
 *   -> { available, reason, next_free_at, booking_url, hours }
 *      Reads Raj's Google Calendar (primary) for the next 2 hours.
 *      Available = weekday, 9:00-17:00 ET, no busy block in the next 15 minutes.
 *
 * POST { action: "meet", name, email, company?, topic? }
 *   -> creates a Google Meet starting now (20 min), emails the visitor the link,
 *      emails + SMS-alerts Raj once, logs a MeetingRecord. Only when available.
 *
 * POST { action: "chat", name, email, company?, message }
 *   -> stores a ContactRequest (source: direct), alerts Raj once, replies to visitor
 *      with the booking link. Works any time.
 *
 * One alert per request. Nothing here sends more than one email to rned@.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const RAJ = 'rned@medrevolve.com';
const BOOKING_URL = 'https://calendly.com/rned-medrevolve/medrevolve-intro-call';
const TZ = 'America/New_York';
const HOURS = { start: 9, end: 17 }; // ET, Mon-Fri
const GMAIL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

const mimeSubject = (s) => {
  const clean = String(s ?? '').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '').replace(/\s+/g, ' ').trim();
  return /^[\x20-\x7E]*$/.test(clean) ? clean : `=?UTF-8?B?${btoa(unescape(encodeURIComponent(clean)))}?=`;
};
const esc = (s = '') => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

async function sendMail(base44, { to, subject, html, fromName = 'MedRevolve', replyTo }) {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const lines = [
    `From: ${fromName} <${RAJ}>`, `To: ${to}`, replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${mimeSubject(subject)}`, 'MIME-Version: 1.0', 'Content-Type: text/html; charset=UTF-8', '', html,
  ].filter(l => l !== null);
  const raw = btoa(unescape(encodeURIComponent(lines.join('\r\n')))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const r = await fetch(GMAIL, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ raw }) });
  if (!r.ok) throw new Error(`Gmail send failed: ${await r.text()}`);
}

async function sendSMS(text) {
  const sid = Deno.env.get('TWILIO_ACCOUNT_SID'), tok = Deno.env.get('TWILIO_AUTH_TOKEN');
  const from = Deno.env.get('TWILIO_PHONE_NUMBER'), to = Deno.env.get('ADMIN_PHONE') || '+15302006352';
  if (!sid || !tok || !from) return false;
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST', headers: { Authorization: 'Basic ' + btoa(`${sid}:${tok}`), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: to, From: from, Body: text.slice(0, 300) }),
  });
  return r.ok;
}

const etParts = (d) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false })
    .formatToParts(d).map(x => [x.type, x.value]));
  return { wday: p.weekday, hour: Number(p.hour) % 24, minute: Number(p.minute) };
};
const fmtET = (d) => new Date(d).toLocaleString('en-US', { timeZone: TZ, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' ET';

async function getStatus(base44) {
  const now = new Date();
  const { wday, hour, minute } = etParts(now);
  const inHours = !['Sat', 'Sun'].includes(wday) && hour >= HOURS.start && (hour < HOURS.end - 1 || (hour === HOURS.end - 1 && minute <= 40));
  let busy = [];
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
    const end = new Date(now.getTime() + 2 * 3600e3);
    const r = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
      method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeMin: now.toISOString(), timeMax: end.toISOString(), items: [{ id: 'primary' }] }),
    });
    if (r.ok) busy = ((await r.json()).calendars?.primary?.busy || []).map(b => ({ start: new Date(b.start), end: new Date(b.end) }));
  } catch (e) { console.warn('freeBusy failed:', e.message); }
  const soon = new Date(now.getTime() + 15 * 60e3);
  const blocking = busy.find(b => b.start < soon && b.end > now);
  const available = inHours && !blocking;
  let reason = 'Available right now';
  let next_free_at = null;
  if (!inHours) reason = `Outside live hours (Mon-Fri ${HOURS.start} AM to ${HOURS.end - 12} PM ET)`;
  else if (blocking) { reason = 'In a meeting'; next_free_at = blocking.end.toISOString(); }
  return { available, reason, next_free_at, next_free_label: next_free_at ? fmtET(next_free_at) : null, booking_url: BOOKING_URL, hours: `Mon-Fri 9 AM to 5 PM ET`, now: now.toISOString() };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = req.method === 'GET' ? {} : await req.json().catch(() => ({}));
    const action = body.action || 'status';

    if (action === 'status') { const s = await getStatus(base44); console.log('STATUS', JSON.stringify(s)); return Response.json(s); }

    const name = String(body.name || '').trim(), email = String(body.email || '').trim().toLowerCase();
    const company = String(body.company || '').trim(), topic = String(body.topic || body.message || '').trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return Response.json({ error: 'Name and a valid email are required' }, { status: 400 });
    const first = name.split(' ')[0];

    // Rate limit: one request per email per 10 minutes
    const recent = await base44.asServiceRole.entities.ContactRequest.filter({ email }, '-created_date', 1);
    if (recent[0] && Date.now() - new Date(recent[0].created_date).getTime() < 10 * 60e3) {
      return Response.json({ ok: true, deduped: true, message: 'We already have your request. Your onboarding specialist will be with you shortly.', booking_url: BOOKING_URL });
    }

    if (action === 'meet') {
      const status = await getStatus(base44);
      if (!status.available) return Response.json({ ok: false, available: false, ...status, message: 'Your onboarding specialist is not available right now. Book a time instead.' });

      const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
      const start = new Date(Date.now() + 60e3), end = new Date(start.getTime() + 20 * 60e3);
      const ev = {
        summary: `Connect Now: ${name}${company ? ` (${company})` : ''}`,
        description: `Instant call requested from medrevolve.com.\nName: ${name}\nEmail: ${email}\nCompany: ${company || '-'}\nTopic: ${topic || '-'}`,
        start: { dateTime: start.toISOString(), timeZone: TZ }, end: { dateTime: end.toISOString(), timeZone: TZ },
        attendees: [{ email: RAJ }, { email }],
        conferenceData: { createRequest: { requestId: `connect-${Date.now()}`, conferenceSolutionKey: { type: 'hangoutsMeet' } } },
        reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 0 }] },
      };
      const r = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=none',
        { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(ev) });
      if (!r.ok) throw new Error(`Calendar error: ${await r.text()}`);
      const event = await r.json();
      const meet = event.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri || event.hangoutLink || '';

      await base44.asServiceRole.entities.MeetingRecord.create({
        title: ev.summary, google_event_id: event.id, meet_link: meet, event_link: event.htmlLink || '',
        organizer_email: RAJ, attendees: [email, RAJ], start_time: start.toISOString(), end_time: end.toISOString(),
        status: 'scheduled', transcription_status: 'pending', notes: `Connect Now (instant). ${topic || ''}`.trim(),
      });
      await base44.asServiceRole.entities.ContactRequest.create({
        name, email, subject: `Connect Now: instant Meet`, message: topic || 'Instant Google Meet requested', source: 'direct', status: 'in_progress',
        meeting_booked: true, meeting_link: meet, notes: `connect_now:meet | company:${company}`,
      });

      await sendMail(base44, { to: email, subject: 'Your Google Meet with your MR Onboarding Specialist is ready', fromName: 'MedRevolve', replyTo: RAJ, html: `
<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a">
  <h2 style="margin:0 0 8px">Hi ${esc(first)}, your MR Personal Onboarding Specialist is joining now.</h2>
  <p style="color:#444">Your 20-minute Google Meet is open. Click below to join.</p>
  <p style="margin:24px 0"><a href="${meet}" style="background:#4A6741;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700">Join Google Meet</a></p>
  <p style="color:#888;font-size:13px">${meet}</p>
  <p style="color:#444;font-size:14px">If we get cut off, book a follow-up here: <a href="${BOOKING_URL}">${BOOKING_URL}</a></p>
  <p style="color:#666;font-size:13px;margin-top:24px">MR Personal Onboarding Specialist &middot; MedRevolve &middot; ${RAJ}</p>
</div>` });

      await sendMail(base44, { to: RAJ, subject: `Join now: ${name}${company ? ` (${company})` : ''} is waiting on Meet`, fromName: 'MedRevolve Connect Now', replyTo: email, html: `
<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;padding:20px">
  <h2 style="margin:0 0 12px">${esc(name)} wants to talk now</h2>
  <table style="font-size:14px;border-collapse:collapse">
    <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666">Company</td><td>${esc(company || '-')}</td></tr>
    <tr><td style="padding:4px 12px 4px 0;color:#666">Topic</td><td>${esc(topic || '-')}</td></tr>
  </table>
  <p style="margin:20px 0"><a href="${meet}" style="background:#4A6741;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700">Join Google Meet</a></p>
</div>` });
      await sendSMS(`MedRevolve: ${name}${company ? ` (${company})` : ''} is waiting on Meet now. ${meet}`);

      return Response.json({ ok: true, mode: 'meet', meet_link: meet, message: `Your onboarding specialist has been alerted. Join the Meet and they will be right with you.` });
    }

    if (action === 'chat') {
      if (!topic) return Response.json({ error: 'Please include a message' }, { status: 400 });
      const status = await getStatus(base44);
      await base44.asServiceRole.entities.ContactRequest.create({
        name, email, subject: `Connect Now: ${topic.slice(0, 80)}`, message: topic, source: 'direct', status: 'new',
        meeting_booked: false, notes: `connect_now:chat | company:${company} | raj_available:${status.available}`,
      });
      await sendMail(base44, { to: RAJ, subject: `${name}${company ? ` (${company})` : ''}: ${topic.slice(0, 60)}`, fromName: 'MedRevolve Connect Now', replyTo: email, html: `
<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;padding:20px">
  <p style="color:#666;font-size:13px;margin:0 0 8px">New message from medrevolve.com &middot; reply to this email to answer ${esc(first)} directly</p>
  <h2 style="margin:0 0 12px">${esc(name)}${company ? ` &middot; ${esc(company)}` : ''}</h2>
  <p style="white-space:pre-wrap;font-size:15px;background:#f6f7f6;padding:14px;border-radius:8px">${esc(topic)}</p>
  <p style="font-size:14px"><a href="mailto:${esc(email)}">${esc(email)}</a></p>
</div>` });
      await sendSMS(`MedRevolve chat from ${name}: ${topic.slice(0, 140)} (${email})`);
      await sendMail(base44, { to: email, subject: 'Got your message, your MR Onboarding Specialist will reply shortly', fromName: 'MedRevolve', replyTo: RAJ, html: `
<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a">
  <h2 style="margin:0 0 8px">Thanks, ${esc(first)}.</h2>
  <p style="color:#444">Your MR Personal Onboarding Specialist has your message and replies personally, usually within the hour during business hours (Mon-Fri 9 AM to 5 PM ET).</p>
  <p style="color:#444">Want to lock in a time instead? <a href="${BOOKING_URL}" style="color:#4A6741;font-weight:600">Book a free 20-minute intro call</a>.</p>
  <p style="color:#888;font-size:13px;margin-top:24px">Your message:<br/><em>${esc(topic)}</em></p>
</div>` });
      return Response.json({ ok: true, mode: 'chat', raj_available: status.available, booking_url: BOOKING_URL, message: status.available ? 'Sent. Your onboarding specialist is online and will reply shortly.' : `Sent. Your onboarding specialist replies during business hours; you can also book a time.` });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('connectNow error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
