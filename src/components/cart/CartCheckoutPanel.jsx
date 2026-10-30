import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';
import { CHECKOUT_CONSENT } from '@/lib/storefront/consent';

/**
 * Legacy /Cart checkout panel.
 * Card entry was removed here: no gateway is connected, so this page collects no card data
 * and cannot take payment until a processor is live and tested.
 */
export default function CartCheckoutPanel({ cart, subtotal, tax, total, hasMonthly }) {
  const mode = 'payment';
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 sticky top-28">
      <h3 className="font-black text-[#0A0A0A] text-lg mb-1">Checkout</h3>
      <p className="text-gray-500 text-xs mb-5">Secure checkout is being finalized.</p>

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
          <p><span className="text-[#0A0A0A] font-semibold">Refunds</span> — one-time services are non-refundable once delivered; monthly subscriptions cancel anytime.</p>
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 mb-4">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-none accent-[#0B8B7A]"
        />
        <span className="text-gray-600 text-xs leading-relaxed">{CHECKOUT_CONSENT}</span>
      </label>

      <Button
        disabled
        className="w-full bg-[#0B8B7A] hover:bg-[#0A7A6A] text-white rounded-lg font-bold h-12 disabled:opacity-50 disabled:cursor-not-allowed">
        Checkout coming soon
      </Button>

      <p className="text-gray-500 text-xs text-center mt-3 leading-relaxed">
        Card processing is not yet enabled on this page.
      </p>

      <div className="flex items-center justify-center gap-1.5 mt-4 text-gray-500 text-xs">
        <ShieldCheck className="w-3 h-3" /> 256-bit SSL · PCI-compliant
      </div>
    </div>
  );
}