/**
 * Triggers the next billing cycle for an AutoRx plan via Stripe.
 * Called after a successful Beluga follow-up submission.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { plan_id, stripe_subscription_id, patient_email, medication_name, month } = body;

    if (!plan_id) {
      return Response.json({ error: 'plan_id is required' }, { status: 400 });
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return Response.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey);

    // If there's a subscription, create an invoice item and immediately invoice
    if (stripe_subscription_id) {
      try {
        // Get the subscription to find the customer
        const subscription = await stripe.subscriptions.retrieve(stripe_subscription_id);
        const customerId = subscription.customer;

        // Create an immediate invoice for this month's shipment
        // (The subscription handles recurring; this advances it manually when triggered by follow-up)
        const invoice = await stripe.invoices.create({
          customer: customerId,
          subscription: stripe_subscription_id,
          description: `AutoRx Month ${month} — ${medication_name}`,
          metadata: {
            plan_id,
            month: String(month),
            medication_name,
            base44_app_id: Deno.env.get('BASE44_APP_ID')
          },
          auto_advance: true
        });

        // Finalize and pay the invoice immediately
        const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
        const paid = await stripe.invoices.pay(finalized.id);

        console.log(`AutoRx billing success: invoice ${paid.id} for plan ${plan_id}`);

        // Log billing in cycle
        await base44.asServiceRole.entities.AutoRxPlan.get(plan_id).then(async (plan) => {
          const cycles = plan.cycles || [];
          const lastCycle = cycles[cycles.length - 1];
          if (lastCycle) {
            lastCycle.billing_triggered = true;
            lastCycle.stripe_invoice_id = paid.id;
            await base44.asServiceRole.entities.AutoRxPlan.update(plan_id, { cycles });
          }
        }).catch(e => console.error('Cycle update error:', e.message));

        return Response.json({
          success: true,
          invoice_id: paid.id,
          amount_paid: paid.amount_paid / 100
        });

      } catch (stripeErr) {
        console.error('Stripe billing error:', stripeErr.message);

        // Notify admin
        const adminEmail = Deno.env.get('ADMIN_EMAIL');
        if (adminEmail) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            from_name: 'MedRevolve AutoRx',
            to: adminEmail,
            subject: `💳 AutoRx Stripe Billing Failed — ${patient_email}`,
            body: `AutoRx monthly billing failed.

Patient:    ${patient_email}
Plan ID:    ${plan_id}
Medication: ${medication_name}
Month:      ${month}
Stripe Sub: ${stripe_subscription_id}
Error:      ${stripeErr.message}

Please review the Stripe dashboard and retry or manually charge the customer.`
          }).catch(() => {});
        }

        return Response.json({ error: stripeErr.message }, { status: 500 });
      }
    }

    // No subscription — log that billing needs to be set up
    console.log(`Plan ${plan_id} has no Stripe subscription. Manual billing required.`);
    return Response.json({
      success: true,
      note: 'No Stripe subscription linked. Manual billing required.',
      plan_id
    });

  } catch (error) {
    console.error('triggerAutoRxBilling error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});