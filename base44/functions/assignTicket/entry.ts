import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * assignTicket — manually assign or reassign a ticket and send notification email
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { ticket_id, assigned_to_email, assigned_to_name, status } = await req.json();

    if (!ticket_id) {
      return Response.json({ error: 'ticket_id is required' }, { status: 400 });
    }

    // Update ticket
    const updates = { email_sent: false };
    if (assigned_to_email) updates.assigned_to_email = assigned_to_email;
    if (assigned_to_name) updates.assigned_to_name = assigned_to_name;
    if (status) updates.status = status;

    await base44.entities.Ticket.update(ticket_id, updates);

    // Fetch updated ticket for email
    const tickets = await base44.asServiceRole.entities.Ticket.filter({ id: ticket_id });
    const ticket = tickets[0];

    if (assigned_to_email && ticket) {
      await base44.integrations.Core.SendEmail({
        to: assigned_to_email,
        subject: `🎫 Ticket Assigned to You: ${ticket.title}`,
        body: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #0A0A0A; padding: 20px; border-radius: 8px 8px 0 0;">
    <span style="color: white; font-weight: bold; font-size: 16px;">MedRevolve Project Management</span>
  </div>
  <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e5e5e5;">
    <h2 style="color: #1a1a1a;">You've been assigned a ticket</h2>
    <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <h3 style="margin: 0 0 8px;">${ticket.title}</h3>
      <p style="color: #555; font-size: 14px; margin: 0 0 12px;">${ticket.description || 'No description provided.'}</p>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <span style="background: #f0f4ef; color: #4A6741; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">${(ticket.bucket || 'general').toUpperCase()}</span>
        <span style="background: #fef3c7; color: #d97706; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">${(ticket.priority || 'medium').toUpperCase()}</span>
        <span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">${(ticket.status || 'open').toUpperCase()}</span>
      </div>
    </div>
    <p style="font-size: 13px; color: #666;">Assigned by: ${user.full_name || user.email}</p>
    <a href="https://medrevolve.com/ProjectManagement" style="display: inline-block; background: #4A6741; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 8px;">View in Dashboard →</a>
  </div>
</div>
        `.trim()
      });

      await base44.entities.Ticket.update(ticket_id, { email_sent: true });
    }

    return Response.json({ success: true, ticket_id });

  } catch (error) {
    console.error('Error assigning ticket:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});