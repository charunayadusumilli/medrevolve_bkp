/**
 * MedRevolve public contact details — ONE place to change the phone number.
 *
 * To switch numbers (for example to the free Google Voice number on rned@medrevolve.com):
 *   1. Change PHONE_DISPLAY and PHONE_E164 below.
 *   2. Publish. Every page, footer, legal notice and email template that imports this picks it up.
 *
 * History:
 *   240-387-5224  — IONOS AI receptionist line (paid). Being retired.
 *   (704) 426-3311 — old tracking number on legal pages. Retired.
 */
export const PHONE_DISPLAY = '240-387-5224';
export const PHONE_E164 = '+12403875224';
export const PHONE_TEL = `tel:${PHONE_E164}`;
export const PHONE_HOURS = 'Mon-Fri 9 AM to 5 PM ET';

export const EMAIL_SUPPORT = 'support@medrevolve.com';
export const EMAIL_PARTNERSHIPS = 'partnerships@medrevolve.com';
export const BOOKING_URL = 'https://calendly.com/rned-medrevolve/medrevolve-intro-call';
export const SPECIALIST_TITLE = 'MR Personal Onboarding Specialist';

// WhatsApp Business number in E.164 digits only, e.g. '15302006352'. Leave empty until a
// number is registered on WhatsApp Business; the site then hides WhatsApp buttons instead of
// sending people to a number that does not answer.
export const WHATSAPP_NUMBER = '';
export const WHATSAPP_URL = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I am reaching out from medrevolve.com')}` : '';
