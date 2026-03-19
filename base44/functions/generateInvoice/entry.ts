import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

        const { paymentId } = await req.json();
        if (!paymentId) return Response.json({ error: 'paymentId required' }, { status: 400 });

        const payments = await base44.asServiceRole.entities.ConsultationPayment.filter({ id: paymentId });
        if (!payments.length) return Response.json({ error: 'Payment not found' }, { status: 404 });

        const p = payments[0];

        // Only patient or admin can view their invoice
        if (p.patient_email !== user.email && user.role !== 'admin') {
            return Response.json({ error: 'Forbidden' }, { status: 403 });
        }

        const paidAt = p.paid_at ? new Date(p.paid_at) : new Date(p.created_date);
        const apptDate = p.appointment_date ? new Date(p.appointment_date) : null;

        const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Invoice ${p.invoice_number}</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 680px; margin: 40px auto; color: #2D3A2D; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; border-bottom: 2px solid #4A6741; padding-bottom: 16px; }
  .logo { font-size: 22px; font-weight: bold; color: #4A6741; }
  .invoice-title { font-size: 28px; font-weight: 300; color: #2D3A2D; }
  .section { margin-bottom: 24px; }
  .label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  .value { font-size: 15px; color: #2D3A2D; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th { background: #F5F0E8; padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #888; }
  td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
  .total-row td { font-weight: bold; font-size: 16px; border-top: 2px solid #4A6741; border-bottom: none; }
  .status-paid { background: #D4E5D7; color: #2D6741; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; }
  .footer { margin-top: 40px; text-align: center; color: #aaa; font-size: 12px; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo">🌿 MedRevolve</div>
    <div>
      <div class="invoice-title">Invoice</div>
      <div style="color:#888; font-size:14px;">${p.invoice_number}</div>
    </div>
  </div>

  <div style="display:flex; gap:48px; margin-bottom:32px;">
    <div class="section">
      <div class="label">Billed To</div>
      <div class="value">${p.patient_email}</div>
    </div>
    <div class="section">
      <div class="label">Provider</div>
      <div class="value">${p.provider_name || 'MedRevolve Provider'}</div>
    </div>
    <div class="section">
      <div class="label">Invoice Date</div>
      <div class="value">${paidAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
    </div>
    <div class="section">
      <div class="label">Status</div>
      <div style="margin-top:4px;"><span class="status-paid">${p.status.toUpperCase()}</span></div>
    </div>
  </div>

  <table>
    <thead><tr><th>Description</th><th>Date</th><th style="text-align:right;">Amount</th></tr></thead>
    <tbody>
      <tr>
        <td>${p.consultation_type?.charAt(0).toUpperCase() + p.consultation_type?.slice(1)} Consultation</td>
        <td>${apptDate ? apptDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
        <td style="text-align:right;">$${p.amount.toFixed(2)}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="total-row"><td colspan="2">Total</td><td style="text-align:right;">$${p.amount.toFixed(2)}</td></tr>
    </tfoot>
  </table>

  <div class="footer">
    <p>MedRevolve · Telehealth Services · support@medrevolve.com</p>
    <p>This invoice is for telehealth consultation services provided by licensed medical professionals.</p>
  </div>
</body>
</html>`;

        return new Response(html, {
            headers: { 'Content-Type': 'text/html', 'Content-Disposition': `inline; filename="invoice-${p.invoice_number}.html"` }
        });
    } catch (error) {
        console.error('Invoice generation error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});