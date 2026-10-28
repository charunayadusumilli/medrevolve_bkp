import { base44 } from '@/api/base44Client';

/**
 * Stripe Checkout must open as a top-level page. In the builder preview the app
 * runs inside an iframe, so the tab is opened synchronously inside the click.
 */
export async function startCheckout(payload) {
  const isFramed = window.self !== window.top;
  const tab = isFramed ? window.open('', '_blank') : null;
  if (isFramed && !tab) throw new Error('Allow popups to continue to checkout.');
  if (tab) tab.opener = null;

  try {
    const response = await base44.functions.invoke('storefrontCheckout', payload);
    const url = response?.data?.url;
    if (!url) throw new Error(response?.data?.error || 'Checkout could not be started.');
    if (tab) tab.location.replace(url);
    else window.location.assign(url);
    return { redirecting: true };
  } catch (error) {
    tab?.close();
    throw error;
  }
}