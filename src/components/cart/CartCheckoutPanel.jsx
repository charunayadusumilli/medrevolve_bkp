import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { clearCart } from '@/lib/cartStore';
import { CreditCard, Lock, Loader2, ShieldCheck } from 'lucide-react';

export default function CartCheckoutPanel({ cart, subtotal, tax, total, hasMonthly }) {
  const [mode, setMode] = useState('payment'); // 'payment' | 'setup'
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setError('');

    // Block checkout inside an iframe (Stripe requires top-level navigation)
    if (window.self !== window.top) {
      setError('Checkout works only from the published app. Please open the app directly in a new tab.');
      return;
    }
    if (!fullName.trim() || !email.trim()) {
      setError('Please enter your name and email to continue.');
      return;
    }
    if (mode === 'payment' && cart.length === 0) {
      setError('Add a service to your cart before checking out.');
      return;
    }

    setLoading(true);
    try {
      // Card is always enabled; Stripe Checkout also auto-shows Link.
      // Additional methods (CashApp, ACH) can be added once activated in the Stripe dashboard.
      const methodTypes = ['card'];

      const res = await base44.functions.invoke('createCheckout', {
        items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        shippingInfo: { fullName, email },
        mode,
        paymentMethodTypes: methodTypes,
        successUrl: `${window.location.origin}/Cart?status=${mode === 'setup' ? 'setup_success' : 'payment_success'}`,
        cancelUrl: `${window.location.origin}/Cart?status=${mode === 'setup' ? 'setup_canceled' : 'payment_canceled'}`,
      });

      if (res?.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError(res?.data?.error || 'Failed to start checkout. Please try again.');
      }
    } catch (e) {
      setError(e.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sticky top-28">
      <h3 className="font-black text-white text-lg mb-1">Checkout</h3>
      <p className="text-white/40 text-xs mb-5">Secure payment via Stripe</p>

      {/* Mode toggle */}
      <div className="space-y-2 mb-5">
        <button
          onClick={() => setMode('payment')}
          className={`w-full text-left p-3 rounded-xl border transition-all ${mode === 'payment' ? 'bg-[#4A6741]/20 border-[#4A6741]' : 'bg-white/[0.02] border-white/10'}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Charge Now</span>
            <span className="text-[#A8C99B] text-xs font-bold">${total.toFixed(2)}</span>
          </div>
          <p className="text-white/40 text-xs mt-0.5">Pay the full amount today</p>
        </button>

        <button
          onClick={() => setMode('setup')}
          className={`w-full text-left p-3 rounded-xl border transition-all ${mode === 'setup' ? 'bg-[#4A6741]/20 border-[#4A6741]' : 'bg-white/[0.02] border-white/10'}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Authorize Card Only</span>
            <span className="text-[#A8C99B] text-xs font-bold">$0.00</span>
          </div>
          <p className="text-white/40 text-xs mt-0.5">Save your card on file — no charge today</p>
        </button>
      </div>

      {/* Payment methods — card is always enabled; Stripe Checkout also shows Link */}
      {mode === 'payment' && (
        <div className="mb-5 flex items-center gap-2 bg-white/[0.02] border border-white/10 rounded-lg p-3">
          <CreditCard className="w-4 h-4 text-[#A8C99B]" />
          <p className="text-white/60 text-xs">Credit/Debit Card · Stripe Link (more methods available on request)</p>
        </div>
      )}

      {/* Contact info */}
      <div className="space-y-3 mb-5">
        <div>
          <Label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1.5">Full Name</Label>
          <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Doe"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-lg" />
        </div>
        <div>
          <Label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1.5">Email</Label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@business.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-lg" />
        </div>
      </div>

      {/* Totals */}
      {mode === 'payment' && cart.length > 0 && (
        <div className="border-t border-white/10 pt-4 mb-4 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Subtotal</span>
            <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Tax (8%)</span>
            <span className="text-white font-semibold">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/10">
            <span className="text-white font-bold">Total</span>
            <span className="text-[#A8C99B] font-black text-lg">${total.toFixed(2)}</span>
          </div>
          {hasMonthly && (
            <p className="text-white/30 text-xs pt-1">Monthly items are billed as one-time here — subscriptions are activated after setup.</p>
          )}
        </div>
      )}

      {/* Services & Charge Policy Disclosure */}
      <div className="bg-white/[0.02] border border-white/10 rounded-lg p-4 mb-5 space-y-2">
        <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">Services & Charge Policy</p>
        <div className="space-y-1.5 text-white/40 text-xs leading-relaxed">
          <p><span className="text-white/60 font-semibold">One-time services</span> — charged in full today via Stripe. No auto-renewal.</p>
          <p><span className="text-white/60 font-semibold">Monthly modules</span> — billed as one-time here; recurring subscription activates after platform setup is complete.</p>
          <p><span className="text-white/60 font-semibold">Card authorization ($0)</span> — saves your card on file; no charge until services are activated.</p>
          <p><span className="text-white/60 font-semibold">Refunds</span> — one-time services are non-refundable once delivered; monthly subscriptions cancel anytime.</p>
          <p><span className="text-white/60 font-semibold">High-risk processing</span> — built for telehealth; your account won't be shut down by mainstream processors.</p>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs mb-3 bg-red-400/10 border border-red-400/20 rounded-lg p-2.5">{error}</p>
      )}

      <Button
        onClick={handleCheckout}
        disabled={loading || (mode === 'payment' && cart.length === 0)}
        className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-lg font-bold h-12">
        {loading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting to Stripe…</>
        ) : mode === 'setup' ? (
          <><CreditCard className="w-4 h-4 mr-2" /> Authorize Card — $0</>
        ) : (
          <><Lock className="w-4 h-4 mr-2" /> Pay ${total.toFixed(2)}</>
        )}
      </Button>

      <div className="flex items-center justify-center gap-1.5 mt-4 text-white/30 text-xs">
        <ShieldCheck className="w-3 h-3" /> 256-bit SSL secured · Stripe-powered
      </div>
    </div>
  );
}