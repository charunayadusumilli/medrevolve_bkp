import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { clearCart } from '@/lib/cartStore';
import { Lock, Loader2, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CartCheckoutPanel({ cart, subtotal, tax, total, hasMonthly }) {
  const mode = 'payment'; // card-verify ($0 auth) is a backend-side flow, not a user choice
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null); // { refNum, maskedCard, cardType, amount }
  const [tokenizationReady, setTokenizationReady] = useState(false);
  const [configError, setConfigError] = useState('');

  const cardFormRef = useRef(null);
  const containerRef = useRef(null);
  const tokenizationKeyRef = useRef(null);

  // ── Load QBI tokenization key + script, then mount the card form ──
  useEffect(() => {
    let cancelled = false;
    let cardForm = null;

    const init = async () => {
      try {
        // 1. Fetch the tokenization key from our backend
        const res = await base44.functions.invoke('getQBIPublishableKey', {});
        const key = res?.data?.publishableKey;
        const scriptUrl = res?.data?.scriptUrl || 'https://tokenization.qbigateway.com/tokenization/v0.2';

        if (!key) {
          setConfigError(res?.data?.error || 'Payment gateway not configured.');
          return;
        }

        if (cancelled) return;
        tokenizationKeyRef.current = key;

        // 2. Load the Hosted Tokenization script
        if (!window.HostedTokenization) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = scriptUrl;
            s.async = true;
            s.onload = resolve;
            s.onerror = () => reject(new Error('Failed to load payment script'));
            document.head.appendChild(s);
          });
        }

        if (cancelled || !window.HostedTokenization) return;

        // 3. Create and mount the card form
        const hostedTokenization = new window.HostedTokenization(key);
        cardForm = hostedTokenization.create('card-form');
        cardForm.mount(containerRef.current, { zip: true, requireCvv2: true });
        cardFormRef.current = cardForm;

        setTokenizationReady(true);
      } catch (err) {
        console.error('Tokenization init error:', err);
        setConfigError(err.message || 'Could not initialize payment form.');
      }
    };

    init();

    return () => {
      cancelled = true;
      if (cardForm) {
        try { cardForm.destroy(); } catch {}
      }
    };
  }, []);

  const handleCheckout = async () => {
    setError('');

    if (!fullName.trim() || !email.trim()) {
      setError('Please enter your name and email to continue.');
      return;
    }
    if (mode === 'payment' && cart.length === 0) {
      setError('Add a service to your cart before checking out.');
      return;
    }
    if (!tokenizationReady || !cardFormRef.current) {
      setError('Payment form is still loading. Please wait a moment and try again.');
      return;
    }

    setLoading(true);
    try {
      // 1. Get the nonce token from the QBI iframe
      const tokenResult = await cardFormRef.current.getNonceToken();

      if (!tokenResult || !tokenResult.nonce) {
        setError('Could not process your card. Please check your card details and try again.');
        setLoading(false);
        return;
      }

      // 2. Call our backend to charge via QBI Gateway
      const res = await base44.functions.invoke('createQBICheckout', {
        nonce: tokenResult.nonce,
        expiryMonth: tokenResult.expiryMonth,
        expiryYear: tokenResult.expiryYear,
        avsZip: tokenResult.avsZip,
        amount: total,
        customerName: fullName,
        customerEmail: email,
        items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
        mode,
      });

      if (res?.data?.success) {
        setSuccess({
          refNum: res.data.referenceNumber,
          maskedCard: res.data.maskedCard,
          cardType: res.data.cardType,
          amount: res.data.amount,
          mode: res.data.mode,
        });
        clearCart();
        // Reset the card form for potential future use
        try { cardFormRef.current?.resetForm(); } catch {}
      } else {
        setError(res?.data?.error || 'Payment was declined. Please try a different card.');
      }
    } catch (e) {
      setError(e.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──
  if (success) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 text-center">
        <CheckCircle2 className="w-14 h-14 text-[#0B8B7A] mx-auto mb-4" />
        <h3 className="font-black text-[#0A0A0A] text-lg mb-2">Payment Successful!</h3>
        <p className="text-gray-600 text-sm mb-4">
          Your payment of ${success.amount?.toFixed(2)} has been processed.
        </p>
        {success.maskedCard && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 text-left space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Card</span>
              <span className="text-[#0A0A0A] font-mono font-semibold">{success.maskedCard}</span>
            </div>
            {success.cardType && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Type</span>
                <span className="text-[#0A0A0A] font-semibold">{success.cardType}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Reference</span>
              <span className="text-[#0A0A0A] font-mono font-semibold">{success.refNum}</span>
            </div>
          </div>
        )}
        <p className="text-gray-500 text-xs mb-4">
          A confirmation email is on its way to <span className="text-[#0A0A0A] font-semibold">{email}</span>.
          Our team will reach out within 24 hours to activate your services.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="w-full bg-[#0B8B7A] hover:bg-[#0A7A6A] text-white rounded-lg font-bold h-11">
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 sticky top-28">
      <h3 className="font-black text-[#0A0A0A] text-lg mb-1">Checkout</h3>
      <p className="text-gray-500 text-xs mb-5">Secure payment via QBI Payments / Easy Pay Direct</p>

      {/* Config error */}
      {configError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-700 mt-0.5 flex-shrink-0" />
          <p className="text-yellow-800 text-xs">{configError}</p>
        </div>
      )}

      {/* Contact info */}
      <div className="space-y-3 mb-5">
        <div>
          <Label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-1.5">Full Name</Label>
          <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Doe"
            className="bg-white border-gray-300 text-[#0A0A0A] placeholder:text-gray-400 rounded-lg" />
        </div>
        <div>
          <Label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-1.5">Email</Label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@business.com"
            className="bg-white border-gray-300 text-[#0A0A0A] placeholder:text-gray-400 rounded-lg" />
        </div>
      </div>

      {/* QBI Hosted Tokenization card form */}
      <div className="mb-5">
        <Label className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-1.5">Card Details</Label>
        <div
          ref={containerRef}
          className="min-h-[120px] rounded-lg overflow-hidden border border-gray-200 bg-gray-50/40"
          style={{ opacity: tokenizationReady ? 1 : 0.5 }}
        />
        {!tokenizationReady && !configError && (
          <div className="flex items-center gap-2 mt-2 text-gray-500 text-xs">
            <Loader2 className="w-3 h-3 animate-spin" /> Loading secure card form…
          </div>
        )}
      </div>

      {/* Totals */}
      {mode === 'payment' && cart.length > 0 && (
        <div className="border-t border-gray-200 pt-4 mb-4 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-[#0A0A0A] font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (8%)</span>
            <span className="text-[#0A0A0A] font-semibold">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-[#0A0A0A] font-bold">Total</span>
            <span className="text-[#0B8B7A] font-black text-lg">${total.toFixed(2)}</span>
          </div>
          {hasMonthly && (
            <p className="text-gray-500 text-xs pt-1">Monthly items are billed as one-time here — subscriptions are activated after setup.</p>
          )}
        </div>
      )}

      {/* Services & Charge Policy Disclosure */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5 space-y-2">
        <p className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">Services & Charge Policy</p>
        <div className="space-y-1.5 text-gray-600 text-xs leading-relaxed">
          <p><span className="text-[#0A0A0A] font-semibold">One-time services</span> — charged in full today. No auto-renewal.</p>
          <p><span className="text-[#0A0A0A] font-semibold">Monthly modules</span> — billed as one-time here; recurring subscription activates after platform setup is complete.</p>
          <p><span className="text-[#0A0A0A] font-semibold">Card authorization ($0)</span> — verifies your card with a $0.01 auth that is immediately voided; no charge remains.</p>
          <p><span className="text-[#0A0A0A] font-semibold">Refunds</span> — one-time services are non-refundable once delivered; monthly subscriptions cancel anytime.</p>
          <p><span className="text-[#0A0A0A] font-semibold">High-risk processing</span> — built for telehealth; your account won't be shut down by mainstream processors.</p>
        </div>
      </div>

      {error && (
        <p className="text-red-700 text-xs mb-3 bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</p>
      )}

      <Button
        onClick={handleCheckout}
        disabled={loading || !tokenizationReady || (mode === 'payment' && cart.length === 0)}
        className="w-full bg-[#0B8B7A] hover:bg-[#0A7A6A] text-white rounded-lg font-bold h-12">
        {loading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing payment…</>
        ) : (
          <><Lock className="w-4 h-4 mr-2" /> Pay ${total.toFixed(2)}</>
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5 mt-4 text-gray-500 text-xs">
        <ShieldCheck className="w-3 h-3" /> 256-bit SSL · QBI Payments secured · PCI-compliant
      </div>
    </div>
  );
}