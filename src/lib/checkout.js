import { base44 } from '@/api/base44Client';

/**
 * Charges the basket through QBI Gateway using the nonce produced by the
 * hosted card form. Amounts are recalculated server-side from the catalog.
 */
export async function startCheckout(payload) {
  const response = await base44.functions.invoke('storefrontCheckout', payload);
  const data = response?.data || {};
  if (!data.success) throw new Error(data.error || 'Payment could not be completed.');
  return data;
}