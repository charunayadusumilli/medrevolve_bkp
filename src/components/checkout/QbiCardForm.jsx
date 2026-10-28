import React, { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * QBI Gateway hosted tokenization card form.
 * Card data stays inside the gateway's iframe; we only ever receive a nonce.
 */
export default function QbiCardForm({ formRef, onReady, onConfigError }) {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let cardForm = null;

    const init = async () => {
      try {
        const res = await base44.functions.invoke('getQBIPublishableKey', {});
        const key = res?.data?.publishableKey;
        const scriptUrl = res?.data?.scriptUrl || 'https://tokenization.qbigateway.com/tokenization/v0.2';
        if (!key) {
          onConfigError?.(res?.data?.error || 'Card payments are not configured yet.');
          setLoading(false);
          return;
        }

        if (!window.HostedTokenization) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.async = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Could not load the secure card form'));
            document.head.appendChild(script);
          });
        }
        if (cancelled || !window.HostedTokenization) return;

        const hosted = new window.HostedTokenization(key);
        cardForm = hosted.create('card-form');
        cardForm.mount(containerRef.current, { zip: true, requireCvv2: true });
        if (formRef) formRef.current = cardForm;
        setLoading(false);
        onReady?.();
      } catch (err) {
        console.error('QBI tokenization init error:', err);
        onConfigError?.(err?.message || 'Could not initialize the card form.');
        setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (formRef) formRef.current = null;
      if (cardForm) {
        try { cardForm.destroy(); } catch { /* already gone */ }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-site-greige">Card details</p>
      <div
        ref={containerRef}
        className="mt-3 min-h-[120px] overflow-hidden rounded-lg border border-site-line bg-site-cream/40"
        style={{ opacity: loading ? 0.5 : 1 }}
      />
      {loading && <p className="mt-2 text-[11px] text-site-greige">Loading secure card form…</p>}
    </div>
  );
}