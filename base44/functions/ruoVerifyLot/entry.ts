import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Lot verification proxy.
// Calls the third-party lab verification endpoint server-side so the browser
// never hits a cross-origin API, and returns the lab's JSON unchanged.

const VERIFY_BASE = 'https://superagent-2b1f1f56.base44.app/functions/verifyBatch';
const LOT_PATTERN = /^[A-Za-z0-9-]{3,32}$/;

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    let lot = (url.searchParams.get('lot') || '').trim();

    if (!lot && req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      lot = String(body.lot || '').trim();
    }

    if (!lot) {
      return Response.json({ ok: false, error: 'Enter the lot number printed on the vial label.' }, { status: 400 });
    }
    if (!LOT_PATTERN.test(lot)) {
      return Response.json({ ok: false, error: 'That does not look like a lot number.' }, { status: 400 });
    }

    const res = await fetch(`${VERIFY_BASE}?lot=${encodeURIComponent(lot)}`, {
      signal: AbortSignal.timeout(12000),
      headers: { Accept: 'application/json' },
    });

    const raw = await res.text();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(raw);
    } catch {
      console.error('verifyBatch returned non-JSON:', res.status, raw.slice(0, 300));
      return Response.json(
        { ok: false, error: 'The verification service did not return a readable response.' },
        { status: 502 },
      );
    }

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('ruoVerifyLot error:', error);
    return Response.json({ ok: false, error: 'Lot verification is temporarily unavailable.' }, { status: 500 });
  }
});