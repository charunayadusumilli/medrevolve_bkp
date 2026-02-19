/**
 * Scheduled function: runs daily to send monthly follow-up reminder emails
 * to patients whose AutoRx follow-up is due within the next 3 days.
 * Admin-only scheduled — no user auth needed (called by automation).
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // This is a scheduled/admin function, use service role
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    const todayStr = today.toISOString().split('T')[0];
    const futureStr = threeDaysFromNow.toISOString().split('T')[0];

    // Fetch all active AutoRx plans where follow-up is due soon and reminder not yet sent
    const plans = await base44.asServiceRole.entities.AutoRxPlan.filter({ status: 'active' }, '-created_date', 200);

    let remindersSent = 0;
    let errors = 0;

    for (const plan of plans) {
      if (!plan.next_followup_due) continue;
      if (plan.followup_reminder_sent) continue;
      if (plan.next_followup_due > futureStr) continue; // not due yet
      if (plan.next_followup_due < todayStr) {
        // Overdue — still send if reminder not sent
      }

      // Send reminder email
      try {
        const followupUrl = `https://medrevolve.com/AutoRxFollowup?plan_id=${plan.id}`;

        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'MedRevolve Care Team',
          to: plan.patient_email,
          subject: `⏰ Monthly Check-In Due — ${plan.medication_name} (Month ${plan.current_month})`,
          body: `Hi ${plan.patient_name || plan.patient_email},

Your monthly check-in for your ${plan.medication_name} AutoRx plan is due.

This quick 2-minute questionnaire helps your prescribing physician confirm your prescription renewal and ensure your treatment is going well.

━━━━━━━━━━━━━━━━━━━━━
  MONTHLY CHECK-IN
━━━━━━━━━━━━━━━━━━━━━
  Medication:  ${plan.medication_name} ${plan.dosage || ''}
  Month:       ${plan.current_month} of ${plan.total_months}
  Due By:      ${plan.next_followup_due}
━━━━━━━━━━━━━━━━━━━━━

👉 Complete your check-in here:
${followupUrl}

IMPORTANT: Your next shipment depends on completing this check-in. If you don't complete it within 5 days of the due date, your plan may be paused automatically.

If you have any side effects or concerns, please note them in the questionnaire and your provider will review.

Need help? Reply to this email or message us through your Patient Portal.

Warm regards,
MedRevolve Care Team
`
        });

        // Mark reminder as sent
        await base44.asServiceRole.entities.AutoRxPlan.update(plan.id, {
          followup_reminder_sent: true,
          followup_reminder_sent_at: new Date().toISOString()
        });

        remindersSent++;
        console.log(`Reminder sent to ${plan.patient_email} for plan ${plan.id}`);
      } catch (emailErr) {
        console.error(`Failed to send reminder for plan ${plan.id}:`, emailErr.message);
        errors++;
      }
    }

    console.log(`AutoRx reminders complete: ${remindersSent} sent, ${errors} errors`);
    return Response.json({ success: true, reminders_sent: remindersSent, errors });

  } catch (error) {
    console.error('AutoRx reminder scheduler error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});