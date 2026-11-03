import { base44 } from '@/api/base44Client';

const ATTRIBUTION_KEY = 'mr_attribution';
const SESSION_KEY = 'mr_session_id';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ref'];

function safeGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode) — tracking simply does nothing
  }
}

/** Reads the query string and persists any utm_* / ref values for the rest of the visit. */
export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const found = {};
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) found[key] = value;
  });
  if (!Object.keys(found).length) return getAttribution();

  const merged = { ...getAttribution(), ...found, captured_at: new Date().toISOString() };
  safeSet(ATTRIBUTION_KEY, JSON.stringify(merged));
  return merged;
}

export function getAttribution() {
  const raw = safeGet(ATTRIBUTION_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function getRefCode() {
  return getAttribution().ref || '';
}

/** Appends the stored attribution to an internal path or an external (Stripe) URL. */
export function withTracking(url) {
  if (!url) return url;
  const attribution = getAttribution();
  const params = new URLSearchParams();
  UTM_KEYS.forEach((key) => {
    if (attribution[key]) params.set(key, attribution[key]);
  });
  if (![...params].length) return url;

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

export function getSessionId() {
  let id = safeGet(SESSION_KEY);
  if (!id) {
    id = window.crypto?.randomUUID?.() || `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    safeSet(SESSION_KEY, id);
  }
  return id;
}

export function getDevice() {
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}

/** Fire-and-forget traffic record — never blocks or breaks the page. */
export function trackEvent(eventType, extra = {}) {
  const attribution = getAttribution();
  const payload = {
    session_id: getSessionId(),
    event_type: eventType,
    page_path: extra.page_path || `${window.location.pathname}${window.location.search}`,
    service_interest: extra.service_interest || undefined,
    utm_source: attribution.utm_source || undefined,
    utm_medium: attribution.utm_medium || undefined,
    utm_campaign: attribution.utm_campaign || undefined,
    utm_content: attribution.utm_content || undefined,
    ref_code: attribution.ref || undefined,
    referrer: document.referrer || undefined,
    device: getDevice(),
    created_at: new Date().toISOString(),
  };

  base44.entities.TrafficEvent.create(payload).catch(() => {});
}

const CONVERSION_TARGETS = ['/services', '/audit', '/partners', '/ruo', 'buy.stripe.com'];

export function isConversionLink(href = '') {
  return CONVERSION_TARGETS.some((target) => href.includes(target));
}

/** Pulls a service slug out of a link so the click can be attributed to a service. */
export function serviceFromHref(href = '') {
  const match = href.match(/\/services\/([a-z0-9-]+)/i);
  if (match) return match[1];
  const campaign = href.match(/[?&]utm_campaign=([a-z0-9-]+)/i);
  return campaign ? campaign[1] : undefined;
}