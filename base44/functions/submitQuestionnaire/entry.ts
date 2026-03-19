import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    // Validate that we have answers
    if (!data.answers || Object.keys(data.answers).length === 0) {
      return Response.json(
        { error: 'No questionnaire answers provided' },
        { status: 400 }
      );
    }

    const answers = data.answers;
    const userEmail = data.email || 'anonymous';

    // Format conditions array for display
    const conditions = answers.conditions?.join(', ') || 'None';

    // Save to PatientIntake entity
    const intakeRecord = await base44.asServiceRole.entities.PatientIntake.create({
      email: userEmail,
      age: answers.age || null,
      weight: answers.weight || null,
      height: answers.height || null,
      goal_weight: answers.goalWeight || null,
      medical_conditions: answers.conditions || [],
      medications: answers.medications || null,
      allergies: answers.allergies || null,
      previous_treatments: answers.previousTreatments || [],
      lifestyle_diet: answers.diet || null,
      lifestyle_exercise: answers.exercise || null,
      primary_goal: answers.goal || null,
      answers_json: JSON.stringify(answers)
    });

    console.log('✅ PatientIntake record created:', intakeRecord.id);

    // Send detailed notification to support@medrevolve.com
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'MedRevolve Health Questionnaire',
      to: 'support@medrevolve.com',
      subject: `New Health Questionnaire - ${userEmail}`,
      body: `
📋 New Health Questionnaire Submitted

Patient Email: ${userEmail}

PRIMARY GOAL:
${answers.goal ? answers.goal.replace('-', ' ').toUpperCase() : 'Not answered'}

DEMOGRAPHIC INFO:
Gender: ${answers.gender || 'Not answered'}
Age: ${answers.age || 'Not answered'}

MEDICAL HISTORY:
Existing Conditions: ${conditions}
Currently Taking Medications: ${answers.medications || 'Not answered'}
Previous Experience with Wellness Meds: ${answers.experience || 'Not answered'}

Submitted: ${new Date().toLocaleString()}

Next Steps:
1. Review patient profile for eligibility
2. Assign to licensed medical provider
3. Schedule initial consultation if approved
4. Send follow-up email within 24-48 hours
      `
    });

    // Send confirmation email if we have patient email
    if (data.email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'MedRevolve Health Team',
        to: data.email,
        subject: 'Health Questionnaire Received - Next Steps',
        body: `
Hi there,

Thank you for completing your health questionnaire! 🏥

We've received your information and our medical team is reviewing your profile to determine the best treatment options for your wellness goals.

What Happens Next:
✓ A licensed medical provider will review your questionnaire (24-48 hours)
✓ We'll assess your eligibility for treatment
✓ You'll receive an email with next steps
✓ If approved, we'll schedule your consultation

Your Wellness Goal: ${answers.goal ? answers.goal.replace('-', ' ') : 'General wellness'}

While You Wait:
• Learn more about our treatments at medrevolve.com/products
• Read success stories from our community
• Prepare any questions for your provider consultation

We're committed to helping you achieve your wellness goals safely and effectively.

Best regards,
MedRevolve Medical Team

Have questions? Reply to this email anytime or call 1-800-MED-REVO
      `
      });
    }

    return Response.json({
      success: true,
      intake_id: intakeRecord.id,
      message: 'Questionnaire submitted successfully',
      next_steps: 'A medical provider will review within 24-48 hours'
    });

  } catch (error) {
    console.error('Error submitting questionnaire:', error);
    return Response.json(
      { error: error.message || 'Failed to submit questionnaire' },
      { status: 500 }
    );
  }
});