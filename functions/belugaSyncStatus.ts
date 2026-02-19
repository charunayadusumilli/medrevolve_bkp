import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * belugaSyncStatus
 * Syncs the status of pending Beluga visits and tests the connection.
 * Admin only.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action = 'status' } = await req.json().catch(() => ({}));

    const BELUGA_API_KEY = Deno.env.get('BELUGA_API_KEY');
    const BELUGA_PARTNER_ID = Deno.env.get('BELUGA_PARTNER_ID');

    if (action === 'test_connection') {
      if (!BELUGA_API_KEY || !BELUGA_PARTNER_ID) {
        return Response.json({
          connected: false,
          message: 'Beluga API credentials not configured. Set BELUGA_API_KEY and BELUGA_PARTNER_ID in secrets.',
          mode: 'whitelabel'
        });
      }

      try {
        const res = await fetch('https://api.belugahealth.com/v1/ping', {
          headers: {
            'Authorization': `Bearer ${BELUGA_API_KEY}`,
            'X-Partner-ID': BELUGA_PARTNER_ID
          }
        });
        const data = await res.json().catch(() => ({}));
        return Response.json({
          connected: res.ok,
          status: res.status,
          message: res.ok ? 'Beluga Health API connected successfully' : `Connection failed: ${res.status}`,
          response: data
        });
      } catch (err) {
        return Response.json({ connected: false, message: `Connection error: ${err.message}` });
      }
    }

    if (action === 'sync_pending') {
      // Sync pending beluga submissions
      const pendingLogs = await base44.asServiceRole.entities.BelugaVisitLog.filter({
        submission_mode: 'beluga',
        status: 'submitted'
      }, '-created_date', 50);

      let synced = 0;
      let errors = 0;

      for (const log of pendingLogs) {
        if (!log.beluga_visit_id) continue;
        try {
          const res = await fetch(`https://api.belugahealth.com/v1/visits/${log.beluga_visit_id}`, {
            headers: {
              'Authorization': `Bearer ${BELUGA_API_KEY}`,
              'X-Partner-ID': BELUGA_PARTNER_ID
            }
          });
          if (res.ok) {
            const data = await res.json();
            const newStatus = data.status === 'approved' ? 'approved'
              : data.status === 'rejected' ? 'rejected'
              : 'submitted';
            if (newStatus !== log.status) {
              await base44.asServiceRole.entities.BelugaVisitLog.update(log.id, {
                status: newStatus,
                response_payload: data
              });
              synced++;
            }
          }
        } catch {
          errors++;
        }
      }

      return Response.json({ synced, errors, total: pendingLogs.length });
    }

    // Default: return dashboard stats
    const totalLogs = await base44.asServiceRole.entities.BelugaVisitLog.list('-created_date', 200);
    const stats = {
      total: totalLogs.length,
      beluga: totalLogs.filter(l => l.submission_mode === 'beluga').length,
      whitelabel: totalLogs.filter(l => l.submission_mode === 'whitelabel').length,
      pending: totalLogs.filter(l => l.status === 'pending').length,
      submitted: totalLogs.filter(l => l.status === 'submitted').length,
      approved: totalLogs.filter(l => l.status === 'approved').length,
      errors: totalLogs.filter(l => l.status === 'error').length,
      belugaConfigured: !!(BELUGA_API_KEY && BELUGA_PARTNER_ID)
    };

    return Response.json(stats);

  } catch (error) {
    console.error('belugaSyncStatus error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});