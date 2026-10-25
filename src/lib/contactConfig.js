/**
 * MedRevolve public contact details — ONE place to change the phone number.
 *
 * ⚠️  240-387-5224 IS RETIRED (Oct 23). It is out of service and must never be
 * published, quoted, or posted again. PHONE_E164 is left EMPTY on purpose, which
 * switches off every phone CTA across the site (pages, footer, chat, email and
 * social templates). "Book a Demo" is the stand-in everywhere a phone CTA was.
 *
 * To switch the new Google Voice number on later:
 *   1. Set PHONE_DISPLAY and PHONE_E164 below.
 *   2. Publish. Every page, footer, legal notice and template that imports this picks it up.
 *
 * History:
 *   240-387-5224   — IONOS AI receptionist line (paid). RETIRED Oct 23, 2026.
 *   (704) 426-3311 — old tracking number on legal pages. Retired.
 */
export const PHONE_DISPLAY = '';
export const PHONE_E164 = '';
export const PHONE_TEL = '';
export const PHONE_RETIRED = true;
export const PHONE_HOURS = 'Mon-Fri 9 AM to 5 PM ET';

export const EMAIL_SUPPORT = 'support@medrevolve.com';
export const EMAIL_PARTNERSHIPS = 'partnerships@medrevolve.com';
export const BOOKING_URL = 'https://calendly.com/rned-medrevolve/medrevolve-intro-call';
export const SPECIALIST_TITLE = 'MR Personal Onboarding Specialist';

// AI intake assistant brand
export const AI_NAME = 'Nova';
export const AI_BRAND = 'Ask Nova';
export const AI_GREETING = "Hi! I'm Nova — your 24/7 AI intake assistant. How can we help you today?";

// WhatsApp Business number in E.164 digits only, e.g. '15302006352'. Leave empty until a
// number is registered on WhatsApp Business; the site then hides WhatsApp buttons instead of
// sending people to a number that does not answer.
export const WHATSAPP_NUMBER = '';
export const WHATSAPP_URL = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I am reaching out from medrevolve.com')}` : '';