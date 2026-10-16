# MedRevolve app changelog

## 2026-10-15 — Partnerships, mailbox, booking, live connect (88 files)

### Partner pipeline
- `PartnershipOutreach` entity extended: folder/subfolder, phone, contact page, social links, tech stack, LegitScript status, lead source, last-scraped; new partner types Provider/Clinic, Attorney, Supplement/Nutra, Other.
- 86 prospects loaded from Noel's two PEPTIDES lists, organized as Providers (13), Pharmacy (21), Telehealth (28), Attorneys (1), Vendors (23); all status `researching`.

### Mailbox (rned@medrevolve.com)
- New `mailboxOrganizer` function: files mail into plain folders (Partners/Pharmacy, Partners/Telehealth, Partners/Providers, Partners/Attorneys, Partners/Vendors, People, Leads/B2B; Accounts & Billing, System Alerts and Junk archived, never deleted). Decodes HTML entities, strips emoji, dedupes.
- New entities `MailItem` (clean headers for the board) and `MailboxState` (progress and reports).
- Workflows: *Mailbox — Organize Incoming Mail* (every new email), *Mailbox — Cleanup Pass* (every 10 min until the whole mailbox is done), *Quick Audit*, *Remove Old Emoji Labels* (run; old `MedRevolve/…` labels deleted).
- Paused: old *Gmail — Auto-Classify* (emoji labels, 1,037 runs), *Evening Health Check* (duplicate of 7 AM).
- New admin page **Mailbox Board** (`/MailboxBoard`): folder sidebar, unread counts, search, threads grouped, junk hidden. Admin menu: "Mailbox Board" + "Lead Tracker".

### Email subject fix (mojibake)
- 22 send functions wrote raw emoji into the `Subject:` header; all now use `mimeSubject` (strips emoji and `[ACTION REQUIRED]`-style tags, RFC 2047-encodes non-ASCII). Verified: digest arrives as "MedRevolve Daily Digest — N items pending".

### One alert per lead
- Paused 12 duplicate alert workflows (*Action Plan — New …* ×6, *Notify: …* ×6). Each form now emails once.
- Removed second admin address from `submitCustomerIntake`.
- 2-minute double-submit guards in `submitBusinessInquiry` and `submitContactRequest`.

### Booking
- Calendly: new free **MedRevolve Intro Call** (15/20/30 min, Google Meet) at `calendly.com/rned-medrevolve/medrevolve-intro-call`. Old paid "30 Minute Meeting" renamed *Paid Consultation (30 min)* and deactivated.
- `createB2BMeeting`: hardcoded "Sunday May 24 at 6:00 PM" replaced with the real time/duration on both emails; stale pricing and phone removed.

### Connect Now (live)
- New `connectNow` function: `status` (reads Google Calendar free/busy, Mon–Fri 9–5 ET), `meet` (instant 20-min Google Meet + one email/SMS alert), `chat` (one alert, reply-to visitor, confirmation to visitor). 10-min per-email rate limit.
- New `ConnectNow` component: floating "Talk to a specialist" button bottom-left on every page; inline card on Contact. Visitor-facing name is **MR Personal Onboarding Specialist** everywhere (no personal names).
- AI chat (`AnswerEngine`): requests for WhatsApp / a human / a call / a text now show a real handoff card (Meet or message, Book a call, Call) instead of an AI reply. WhatsApp button appears only when `WHATSAPP_NUMBER` is set.

### Phone
- New `src/lib/contactConfig.js`: single source for phone (`PHONE_DISPLAY`, `PHONE_E164`, `PHONE_TEL`), booking URL, specialist title, WhatsApp. 44 files rewritten to import it; (704) 426-3311 and (555) placeholders removed from pages.
- New `voiceInbound` function + *Phone — Google Voice Voicemail to Lead* workflow: voicemail/missed-call/SMS emails become one lead + one alert with transcript and call-back link.
- New `smsPing` function + *SMS — Ping Admin Phone* workflow. Secret `ADMIN_PHONE` set. **Twilio account is suspended (status 4, error 20003)**; SMS will not send until it is reactivated.
- IONOS receptionist copy removed from public pages; the only app-side IONOS workflow was already inactive. IONOS itself must be cancelled in the IONOS account.

### Copy / compliance
- UnifiedCRM landing: WhatsApp no longer claimed as a live channel.

### Open items
- Reactivate Twilio (or create a new account and swap secrets) for SMS alerts and a working phone line.
- Pick the public phone number; change one line in `contactConfig.js`.
- Register a WhatsApp Business number; set `WHATSAPP_NUMBER`.
- Calendly host profile still shows "r ned"; rename in Calendly Account → Profile.
- Automated social/ad copy with unverifiable claims ("50+ MDs", earnings testimonials) should be paused before LegitScript review.
