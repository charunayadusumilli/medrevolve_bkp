import { base44 } from '@/api/base44Client';

/** Active slots for one surface, in editorial order. */
export async function loadSlots(surface) {
  const page = await base44.entities.UgcSlot.filter(
    { surface, active: true },
    { sort: 'display_order', limit: 24 },
  );
  return page?.items ?? [];
}