import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const data = await req.json();

    if (!data.name || !data.email) {
      return Response.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const record = await base44.asServiceRole.entities.BookingRequest.create({
      name: data.name,
      email: data.email,
      company: data.company || '',
      partnership_interest: data.partnership_interest || 'Not sure yet',
      message: data.message || '',
      source: 'Partnerships Page',
      booking_type: 'Partnership Inquiry',
      status: 'new',
    });

    console.log('✅ Partnership inquiry created:', record.id);

    return Response.json({
      success: true,
      booking_request_id: record.id,
      message: 'Partnership inquiry submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting partnership inquiry:', error);
    return Response.json({ error: error.message || 'Failed to submit partnership inquiry' }, { status: 500 });
  }
});