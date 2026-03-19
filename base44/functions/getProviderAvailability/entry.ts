import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { provider_id, date } = await req.json();

    if (!provider_id || !date) {
      return Response.json({ error: 'provider_id and date are required' }, { status: 400 });
    }

    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();

    // Get provider's schedule for this day of week
    const schedules = await base44.asServiceRole.entities.ProviderSchedule.filter({
      provider_id,
      day_of_week: dayOfWeek,
      is_available: true
    });

    if (schedules.length === 0) {
      return Response.json({ available_slots: [], message: 'Provider not available on this day' });
    }

    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all blocked times and filter relevant ones (one-off or recurring on this weekday)
    const allBlockedTimes = await base44.asServiceRole.entities.BlockedTime.filter({ provider_id });

    const relevantBlocks = allBlockedTimes.filter(block => {
      if (block.is_recurring) {
        const blockDay = block.recurring_day_of_week ?? new Date(block.start_datetime).getDay();
        return blockDay === dayOfWeek;
      }
      const blockStart = new Date(block.start_datetime);
      const blockEnd = new Date(block.end_datetime);
      return blockStart <= endOfDay && blockEnd >= startOfDay;
    });

    // Get existing appointments on this date
    const allAppointments = await base44.asServiceRole.entities.Appointment.filter({
      provider_id,
      status: ['scheduled', 'confirmed']
    });
    const dateAppointments = allAppointments.filter(apt =>
      new Date(apt.appointment_date).toDateString() === requestedDate.toDateString()
    );

    // Helper: is a given slot start time blocked?
    const isTimeBlocked = (slotStart, block) => {
      if (block.is_recurring) {
        const [bStartH, bStartM] = (block.recurring_start_time || '00:00').split(':').map(Number);
        const [bEndH, bEndM] = (block.recurring_end_time || '23:59').split(':').map(Number);
        const blockStart = new Date(requestedDate);
        blockStart.setHours(bStartH, bStartM, 0, 0);
        const blockEnd = new Date(requestedDate);
        blockEnd.setHours(bEndH, bEndM, 0, 0);
        return slotStart >= blockStart && slotStart < blockEnd;
      }
      const blockStart = new Date(block.start_datetime);
      const blockEnd = new Date(block.end_datetime);
      return slotStart >= blockStart && slotStart < blockEnd;
    };

    const now = new Date();
    const availableSlots = [];

    for (const schedule of schedules) {
      const slotDuration = schedule.slot_duration_minutes || 30;
      const [startHour, startMin] = schedule.start_time.split(':').map(Number);
      const [endHour, endMin] = schedule.end_time.split(':').map(Number);

      let currentTime = new Date(requestedDate);
      currentTime.setHours(startHour, startMin, 0, 0);

      const endTime = new Date(requestedDate);
      endTime.setHours(endHour, endMin, 0, 0);

      while (currentTime < endTime) {
        const slotEnd = new Date(currentTime.getTime() + slotDuration * 60000);

        // Skip past slots
        if (currentTime <= now) { currentTime = slotEnd; continue; }

        const isBlocked = relevantBlocks.some(block => isTimeBlocked(currentTime, block));
        const isBooked = dateAppointments.some(apt => {
          const aptTime = new Date(apt.appointment_date);
          const aptEnd = new Date(aptTime.getTime() + (apt.duration_minutes || 30) * 60000);
          return currentTime >= aptTime && currentTime < aptEnd;
        });

        if (!isBlocked && !isBooked) {
          availableSlots.push({
            start_time: currentTime.toISOString(),
            end_time: slotEnd.toISOString(),
            display_time: currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
          });
        }

        currentTime = slotEnd;
      }
    }

    return Response.json({ available_slots: availableSlots, provider_id, date: requestedDate.toISOString() });

  } catch (error) {
    console.error('Error getting availability:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});