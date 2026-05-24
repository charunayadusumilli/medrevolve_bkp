import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * processMeetingTranscript
 * 1. Receives a meeting_id and audio_url (or transcript text)
 * 2. Transcribes audio via Whisper (if audio_url provided)
 * 3. AI summarizes + extracts action items + auto-creates tickets
 * 4. Sends email notifications to assigned team members
 */

const TEAM_MEMBERS = {
  support: { name: 'Support Team', email: 'support@medrevolve.com' },
  engineering: { name: 'Engineering Team', email: 'rned@medrevolve.com' },
  marketing: { name: 'Marketing Team', email: 'rned@medrevolve.com' },
  operations: { name: 'Operations Team', email: 'rned@medrevolve.com' },
  compliance: { name: 'Compliance Team', email: 'rned@medrevolve.com' },
  product: { name: 'Product Team', email: 'rned@medrevolve.com' },
  other: { name: 'General Team', email: 'rned@medrevolve.com' },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { meeting_id, audio_url, transcript_text } = await req.json();

    if (!meeting_id) {
      return Response.json({ error: 'meeting_id is required' }, { status: 400 });
    }

    // Mark as processing
    await base44.entities.MeetingRecord.update(meeting_id, {
      transcription_status: 'processing'
    });

    let transcript = transcript_text || '';

    // Step 1: Transcribe audio if provided
    if (audio_url && !transcript_text) {
      console.log('Transcribing audio via Whisper...');
      const transcription = await base44.integrations.Core.TranscribeAudio({ audio_url });
      transcript = transcription;
      console.log('Transcription complete, length:', transcript.length);
    }

    if (!transcript || transcript.trim().length < 10) {
      await base44.entities.MeetingRecord.update(meeting_id, { transcription_status: 'failed' });
      return Response.json({ error: 'No valid transcript to process' }, { status: 400 });
    }

    // Step 2: AI analysis — summarize, extract action items, auto-create tickets
    console.log('Running AI analysis on transcript...');
    const aiResult = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a project manager AI for MedRevolve, a telehealth platform.
      
Analyze this meeting transcript and return a structured JSON response:

TRANSCRIPT:
${transcript}

Return JSON with:
{
  "summary": "2-3 sentence executive summary of the meeting",
  "key_decisions": ["decision 1", "decision 2"],
  "action_items": [
    {
      "action": "specific action to take",
      "owner": "person's name or role",
      "due": "timeframe mentioned or 'ASAP'",
      "bucket": "support|engineering|marketing|operations|compliance|product|other",
      "priority": "low|medium|high|urgent"
    }
  ],
  "tickets": [
    {
      "title": "short ticket title",
      "description": "detailed description of the issue or task",
      "bucket": "support|engineering|marketing|operations|compliance|product|other",
      "priority": "low|medium|high|urgent",
      "tags": ["tag1", "tag2"]
    }
  ]
}

Important: Only create tickets for concrete actionable items. Classify by bucket based on the nature of the work.`,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          key_decisions: { type: 'array', items: { type: 'string' } },
          action_items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                action: { type: 'string' },
                owner: { type: 'string' },
                due: { type: 'string' },
                bucket: { type: 'string' },
                priority: { type: 'string' }
              }
            }
          },
          tickets: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                bucket: { type: 'string' },
                priority: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } }
              }
            }
          }
        }
      }
    });

    console.log(`AI extracted ${aiResult.tickets?.length || 0} tickets and ${aiResult.action_items?.length || 0} action items`);

    // Step 3: Create tickets in DB and send email notifications
    const createdTicketIds = [];
    const emailPromises = [];

    for (const ticketData of (aiResult.tickets || [])) {
      const assignee = TEAM_MEMBERS[ticketData.bucket] || TEAM_MEMBERS.other;

      const ticket = await base44.entities.Ticket.create({
        title: ticketData.title,
        description: ticketData.description,
        bucket: ticketData.bucket || 'other',
        priority: ticketData.priority || 'medium',
        status: 'open',
        assigned_to_email: assignee.email,
        assigned_to_name: assignee.name,
        reporter_email: user.email,
        source: 'meeting_transcript',
        meeting_id,
        tags: ticketData.tags || [],
        email_sent: false,
      });

      createdTicketIds.push(ticket.id);

      // Queue email notification
      emailPromises.push(
        base44.integrations.Core.SendEmail({
          to: assignee.email,
          subject: `🎫 New Ticket Assigned: ${ticketData.title}`,
          body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #0A0A0A; padding: 20px; border-radius: 8px 8px 0 0;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="background: white; color: black; font-weight: 900; padding: 4px 8px; border-radius: 4px; font-size: 12px;">MR</span>
      <span style="color: white; font-weight: bold;">MedRevolve</span>
    </div>
  </div>
  <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e5e5e5;">
    <h2 style="color: #1a1a1a; margin: 0 0 16px;">New Ticket Assigned to You</h2>
    
    <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <p style="margin: 0 0 8px; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold;">TICKET</p>
      <h3 style="margin: 0 0 12px; color: #1a1a1a;">${ticketData.title}</h3>
      <p style="margin: 0 0 12px; color: #555; font-size: 14px;">${ticketData.description}</p>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <span style="background: #f0f4ef; color: #4A6741; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">${ticketData.bucket?.toUpperCase()}</span>
        <span style="background: ${ticketData.priority === 'urgent' ? '#fee2e2' : ticketData.priority === 'high' ? '#fef3c7' : '#f0f9ff'}; color: ${ticketData.priority === 'urgent' ? '#dc2626' : ticketData.priority === 'high' ? '#d97706' : '#0369a1'}; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">${ticketData.priority?.toUpperCase()} PRIORITY</span>
      </div>
    </div>

    <div style="background: #fff8ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
      <p style="margin: 0; font-size: 13px; color: #92400e;">📋 <strong>Source:</strong> Auto-generated from a meeting transcript</p>
    </div>

    <p style="color: #666; font-size: 13px;">Please log in to the MedRevolve admin dashboard to view and manage this ticket.</p>
    
    <a href="https://medrevolve.com/ProjectManagement" style="display: inline-block; background: #4A6741; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 8px;">View Ticket Dashboard →</a>
  </div>
  <div style="background: #f0f0f0; padding: 12px 24px; border-radius: 0 0 8px 8px;">
    <p style="margin: 0; font-size: 11px; color: #999;">MedRevolve Project Management · admin@medrevolve.com</p>
  </div>
</div>
          `.trim()
        }).then(() =>
          base44.entities.Ticket.update(ticket.id, { email_sent: true })
        ).catch(err => console.error('Email send failed:', err))
      );
    }

    await Promise.allSettled(emailPromises);

    // Step 4: Update meeting record with results
    await base44.entities.MeetingRecord.update(meeting_id, {
      transcript_raw: transcript,
      transcript_summary: aiResult.summary,
      action_items: aiResult.action_items || [],
      tickets_created: createdTicketIds,
      transcription_status: 'completed',
      status: 'completed',
    });

    return Response.json({
      success: true,
      summary: aiResult.summary,
      tickets_created: createdTicketIds.length,
      action_items: aiResult.action_items?.length || 0,
      key_decisions: aiResult.key_decisions || [],
    });

  } catch (error) {
    console.error('Error processing transcript:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});