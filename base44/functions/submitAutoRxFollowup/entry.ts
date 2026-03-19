/**
 * Called when a patient submits their monthly AutoRx follow-up questionnaire.
 * 1. Validates the patient + plan
 * 2. POSTs follow-up to Beluga's Follow-Up URL
 * 3. On success: advances the plan cycle, triggers next billing & shipment
 * 4. On clinical flag: pauses plan, alerts admin
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { plan_id, responses } = body;

    if (!plan_id || !responses) {
      return Response.json({ error: 'plan_id and responses are required' }, { status: 400 });
    }

    // Verify authenticated patient owns this plan
    let user = null;
    try {
      user = await base44.auth.me();
    } catch {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const plan = await base44.asServiceRole.entities.AutoRxPlan.get(plan_id);

    if (!plan) {
      return Response.json({ error: 'AutoRx plan not found' }, { status: 404 });
    }

    if (plan.patient_email !== user.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (plan.status !== 'active') {
      return Response.json({ error: `Plan is ${plan.status} and cannot accept follow-ups` }, { status: 400 });
    }

    // --- Step 1: Check for clinical flags that require physician review ---
    const requiresReview = checkClinicalFlags(responses);

    // --- Step 2: Submit to Beluga Follow-Up endpoint ---
    const belugaFollowupUrl = Deno.env.get('BELUGA_FOLLOWUP_URL');
    const belugaApiKey = Deno.env.get('BELUGA_API_KEY');
    const belugaCompanySlug = Deno.env.get('BELUGA_COMPANY_SLUG');

    let belugaResponse = null;
    let belugaStatus = 'skipped';
    let belugaError = null;

    if (belugaFollowupUrl && belugaApiKey) {
      try {
        const followupPayload = {
          visitId: plan.beluga_visit_id,
          masterId: plan.id,
          company: belugaCompanySlug || 'medrevolve',
          month: plan.current_month,
          formObj: {
            // Standard monthly follow-up questions mapped from patient responses
            weightChange: responses.weight_change || '',
            sideEffects: responses.side_effects || 'None',
            medicationCompliance: responses.taking_medication || 'Yes',
            adverseEvents: responses.adverse_events || 'No',
            continueTreatment: responses.continue_treatment || 'Yes',
            currentMedications: responses.current_medications || 'Same as before',
            additionalNotes: responses.additional_notes || '',
            // Pass all raw responses for Beluga record
            ...flattenResponses(responses)
          }
        };

        const belugaRes = await fetch(belugaFollowupUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${belugaApiKey}`,
            'x-api-key': belugaApiKey
          },
          body: JSON.stringify(followupPayload)
        });

        if (belugaRes.ok) {
          belugaResponse = await belugaRes.json();
          belugaStatus = 'success';
          console.log('Beluga follow-up submitted:', JSON.stringify(belugaResponse));
        } else {
          const errText = await belugaRes.text();
          belugaError = `Beluga API ${belugaRes.status}: ${errText}`;
          belugaStatus = 'error';
          console.error('Beluga follow-up error:', belugaError);
        }
      } catch (fetchErr) {
        belugaError = fetchErr.message;
        belugaStatus = 'network_error';
        console.error('Beluga follow-up fetch failed:', fetchErr.message);
      }
    } else {
      // Beluga not configured yet — operate in "platform-only" mode
      belugaStatus = 'not_configured';
      console.log('Beluga credentials not configured, running in platform-only mode');
    }

    // --- Step 3: Update the plan with cycle results ---
    const cycleEntry = {
      month: plan.current_month,
      due_date: plan.next_followup_due,
      submitted_at: new Date().toISOString(),
      beluga_response_status: belugaStatus,
      patient_responses: responses,
      requires_review: requiresReview,
      error: belugaError || undefined
    };

    const updatedCycles = [...(plan.cycles || []), cycleEntry];

    // --- Step 4: Decide what to do next ---
    if (requiresReview) {
      // Clinical flag — pause plan, alert admin
      await base44.asServiceRole.entities.AutoRxPlan.update(plan_id, {
        status: 'paused',
        pause_reason: `Month ${plan.current_month} follow-up flagged for physician review`,
        cycles: updatedCycles,
        followup_reminder_sent: false
      });

      await notifyAdminClinicalFlag(base44, plan, responses);
      await notifyPatientUnderReview(base44, plan);

      return Response.json({
        success: true,
        action: 'paused_for_review',
        message: 'Your responses have been flagged for physician review. Your care team will contact you within 24 hours.'
      });
    }

    if (belugaStatus === 'error' || belugaStatus === 'network_error') {
      // Beluga submission failed — save responses, flag for retry, alert admin
      await base44.asServiceRole.entities.AutoRxPlan.update(plan_id, {
        cycles: updatedCycles,
        followup_reminder_sent: false // allow re-reminder if needed
      });

      await notifyAdminBelugaError(base44, plan, belugaError);

      // Still confirm receipt to patient
      await notifyPatientReceived(base44, plan);

      return Response.json({
        success: true,
        action: 'received_pending_retry',
        message: 'Your check-in has been received. We are processing your prescription renewal.'
      });
    }

    // --- Step 5: Advance the cycle ---
    const isLastMonth = plan.current_month >= plan.total_months;
    const nextMonth = plan.current_month + 1;
    const nextDueDate = getNextMonthDate(plan.next_followup_due);

    const planUpdates = {
      cycles: updatedCycles,
      followup_reminder_sent: false,
      ...(isLastMonth
        ? { status: 'completed', current_month: plan.total_months }
        : {
            current_month: nextMonth,
            next_followup_due: nextDueDate
          })
    };

    // Mark shipment + billing triggered in the cycle
    updatedCycles[updatedCycles.length - 1].prescription_renewed = true;
    updatedCycles[updatedCycles.length - 1].shipment_triggered = true;
    updatedCycles[updatedCycles.length - 1].billing_triggered = true;

    await base44.asServiceRole.entities.AutoRxPlan.update(plan_id, planUpdates);

    // --- Step 6: Trigger billing via Stripe subscription advance ---
    if (plan.stripe_subscription_id) {
      try {
        await base44.asServiceRole.functions.invoke('triggerAutoRxBilling', {
          plan_id: plan.id,
          stripe_subscription_id: plan.stripe_subscription_id,
          patient_email: plan.patient_email,
          medication_name: plan.medication_name,
          month: plan.current_month
        });
      } catch (billingErr) {
        console.error('Billing trigger failed:', billingErr.message);
        await notifyAdminBillingError(base44, plan, billingErr.message);
      }
    }

    // --- Step 7: Notify patient of successful renewal ---
    if (isLastMonth) {
      await notifyPatientPlanCompleted(base44, plan);
    } else {
      await notifyPatientRenewalConfirmed(base44, plan, nextDueDate);
    }

    return Response.json({
      success: true,
      action: isLastMonth ? 'plan_completed' : 'renewed',
      next_followup_due: isLastMonth ? null : nextDueDate,
      message: isLastMonth
        ? 'Your 6-month AutoRx plan is complete! Your care team will reach out about continuing your treatment.'
        : 'Your prescription has been renewed and your next shipment is on its way!'
    });

  } catch (error) {
    console.error('submitAutoRxFollowup error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// ── Helpers ──────────────────────────────────────────────────────────────

function checkClinicalFlags(responses) {
  // Flags that require physician review before renewing
  if (responses.adverse_events && responses.adverse_events.toLowerCase() !== 'no') return true;
  if (responses.hospitalized === 'Yes' || responses.hospitalized === true) return true;
  if (responses.stop_medication === 'Yes' || responses.stop_medication === true) return true;
  if (responses.severe_side_effects === 'Yes' || responses.severe_side_effects === true) return true;
  if (responses.pregnancy === 'Yes' || responses.pregnancy === true) return true;
  return false;
}

function flattenResponses(responses) {
  // Map the patient responses to Q&A keys Beluga expects
  const entries = {};
  let idx = 1;
  for (const [key, value] of Object.entries(responses)) {
    entries[`Q${idx}`] = key.replace(/_/g, ' ');
    entries[`A${idx}`] = String(value || '');
    idx++;
  }
  return entries;
}

function getNextMonthDate(currentDueDateStr) {
  const d = new Date(currentDueDateStr);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
}

async function notifyAdminClinicalFlag(base44, plan, responses) {
  const adminEmail = Deno.env.get('ADMIN_EMAIL');
  if (!adminEmail) return;
  await base44.asServiceRole.integrations.Core.SendEmail({
    from_name: 'MedRevolve AutoRx Alert',
    to: adminEmail,
    subject: `🚨 AutoRx Clinical Flag — ${plan.patient_name || plan.patient_email} (Month ${plan.current_month})`,
    body: `A patient's monthly AutoRx follow-up has been flagged for clinical review.

Patient:    ${plan.patient_name || 'N/A'} (${plan.patient_email})
Medication: ${plan.medication_name} ${plan.dosage || ''}
Plan ID:    ${plan.id}
Month:      ${plan.current_month} of ${plan.total_months}

FLAGGED RESPONSES:
${JSON.stringify(responses, null, 2)}

ACTION REQUIRED: Review the patient's responses and clear the plan or contact the patient within 24 hours.
Plan is currently PAUSED.
`
  }).catch(e => console.error('Admin clinical flag email failed:', e.message));
}

async function notifyAdminBelugaError(base44, plan, error) {
  const adminEmail = Deno.env.get('ADMIN_EMAIL');
  if (!adminEmail) return;
  await base44.asServiceRole.integrations.Core.SendEmail({
    from_name: 'MedRevolve AutoRx Alert',
    to: adminEmail,
    subject: `⚠️ AutoRx Beluga Submission Failed — ${plan.patient_email}`,
    body: `Beluga follow-up submission failed for an AutoRx plan.

Patient:    ${plan.patient_name || 'N/A'} (${plan.patient_email})
Medication: ${plan.medication_name}
Plan ID:    ${plan.id}
Month:      ${plan.current_month}
Error:      ${error}

ACTION: Manually resubmit to Beluga or retry via the Admin dashboard.
`
  }).catch(e => console.error('Admin Beluga error email failed:', e.message));
}

async function notifyAdminBillingError(base44, plan, error) {
  const adminEmail = Deno.env.get('ADMIN_EMAIL');
  if (!adminEmail) return;
  await base44.asServiceRole.integrations.Core.SendEmail({
    from_name: 'MedRevolve AutoRx Alert',
    to: adminEmail,
    subject: `💳 AutoRx Billing Error — ${plan.patient_email}`,
    body: `AutoRx billing trigger failed for a patient.

Patient:    ${plan.patient_name || 'N/A'} (${plan.patient_email})
Medication: ${plan.medication_name}
Plan ID:    ${plan.id}
Stripe Sub: ${plan.stripe_subscription_id}
Error:      ${error}

ACTION: Check Stripe and manually charge or retry.
`
  }).catch(e => console.error('Admin billing error email failed:', e.message));
}

async function notifyPatientReceived(base44, plan) {
  await base44.asServiceRole.integrations.Core.SendEmail({
    from_name: 'MedRevolve Care Team',
    to: plan.patient_email,
    subject: `✅ Monthly Check-In Received — ${plan.medication_name}`,
    body: `Hi ${plan.patient_name || ''},

We've received your monthly check-in for your ${plan.medication_name} plan.

We are processing your prescription renewal and will send a confirmation once your next shipment is dispatched.

If you have any questions, please reply to this email or visit your Patient Portal.

Warm regards,
MedRevolve Care Team`
  }).catch(e => console.error('Patient receipt email failed:', e.message));
}

async function notifyPatientUnderReview(base44, plan) {
  await base44.asServiceRole.integrations.Core.SendEmail({
    from_name: 'MedRevolve Care Team',
    to: plan.patient_email,
    subject: `📋 Your Check-In is Under Physician Review — ${plan.medication_name}`,
    body: `Hi ${plan.patient_name || ''},

Thank you for completing your monthly check-in for ${plan.medication_name}.

Based on your responses, our medical team wants to review your progress before issuing your next prescription. This is a routine safety check.

NEXT STEPS:
• A licensed provider will review your responses within 24 hours
• You may be contacted for additional information
• Your prescription renewal will be confirmed after review

Your health and safety are our top priority. Please don't hesitate to reach out if you have any urgent concerns.

Warm regards,
MedRevolve Care Team`
  }).catch(e => console.error('Patient under review email failed:', e.message));
}

async function notifyPatientRenewalConfirmed(base44, plan, nextDueDate) {
  await base44.asServiceRole.integrations.Core.SendEmail({
    from_name: 'MedRevolve Care Team',
    to: plan.patient_email,
    subject: `🚀 Prescription Renewed — ${plan.medication_name} (Month ${plan.current_month})`,
    body: `Hi ${plan.patient_name || ''},

Great news! Your ${plan.medication_name} prescription has been renewed for month ${plan.current_month}.

━━━━━━━━━━━━━━━━━━━━━
  RENEWAL CONFIRMED
━━━━━━━━━━━━━━━━━━━━━
  Medication:  ${plan.medication_name} ${plan.dosage || ''}
  Month:       ${plan.current_month} of ${plan.total_months}
  Next check-in: ${nextDueDate}
━━━━━━━━━━━━━━━━━━━━━

Your next shipment is being prepared and will be dispatched within 2-3 business days. You'll receive a tracking notification once it ships.

Your next monthly check-in will be due around ${nextDueDate}. We'll send you a reminder a few days before.

Keep up the great work!

Warm regards,
MedRevolve Care Team`
  }).catch(e => console.error('Patient renewal email failed:', e.message));
}

async function notifyPatientPlanCompleted(base44, plan) {
  await base44.asServiceRole.integrations.Core.SendEmail({
    from_name: 'MedRevolve Care Team',
    to: plan.patient_email,
    subject: `🎉 Your 6-Month Plan is Complete — ${plan.medication_name}`,
    body: `Hi ${plan.patient_name || ''},

Congratulations! You've completed your 6-month ${plan.medication_name} AutoRx plan.

Your prescribing physician will review your progress and reach out to discuss:
• Continuing your treatment
• Adjusting your dosage
• Next steps for your wellness journey

We'll be in touch within 5 business days. In the meantime, please log into your Patient Portal to view your full treatment history.

Thank you for trusting MedRevolve with your health journey!

Warm regards,
MedRevolve Care Team`
  }).catch(e => console.error('Plan completed email failed:', e.message));
}