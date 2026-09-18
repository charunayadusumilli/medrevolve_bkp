import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { getCart, updateQty, removeFromCart, addToCart, clearCart } from '@/lib/cartStore';
import CartCheckoutPanel from '@/components/cart/CartCheckoutPanel';
import {
  Phone, Globe, Package, Megaphone, Pill, Truck, CreditCard, Building,
  Trash2, Plus, Minus, ArrowLeft, ShoppingCart, CheckCircle2, X
} from 'lucide-react';

const CATALOG = [
  { id: 'consultation', name: 'B2B Strategy Consultation', price: 199, type: 'one-time', desc: '1-on-1 strategy call + personalized launch roadmap', icon: Phone },
  { id: 'platform',    name: 'MedRevolve B2B Platform',    price: 2999, type: 'monthly',  desc: 'Full white-label telehealth platform under your brand', icon: Globe },
  { id: 'full_bundle', name: 'Full Platform Bundle',        price: 250,  type: 'monthly',  desc: 'Website + compliance + providers + pharmacy network', icon: Package },
  { id: 'marketing',   name: 'Marketing Integration',       price: 150,  type: 'monthly',  desc: 'Social media, ads, and email marketing suite', icon: Megaphone },
  { id: 'product',     name: 'Product Integration',         price: 750,  type: 'one-time', desc: 'Product catalog + inventory setup', icon: Pill },
  { id: 'pharmacy',    name: 'Pharmacy Integration',        price: 100,  type: 'monthly',  desc: 'Licensed 503A pharmacy network connection', icon: Truck },
  { id: 'payment',     name: 'Payment Integration',         price: 100,  type: 'monthly',  desc: 'Stripe + card processing setup', icon: CreditCard },
  { id: 'llc',         name: 'LLC Formation',               price: 1500, type: 'one-time', desc: 'Business entity formation & registration', icon: Building },
];

export default function Cart() {
  const [cart, setCart] = useState(getCart());
  const [showCatalog, setShowCatalog] = useState(false);

  useEffect(() => {
    const h = () => setCart(getCart());
    window.addEventListener('cart-updated', h);
    return () => window.removeEventListener('cart-updated', h);
  }, []);

  // Stripe redirect status
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const success = status === 'payment_success' || status === 'setup_success';

  useEffect(() => {
    if (success) {
      clearCart();
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [success]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const hasMonthly = cart.some(i => i.type === 'monthly');

  const handleAdd = (item) => {
    addToCart({ id: item.id, name: item.name, price: item.price, type: item.type, image: item.image });
    setShowCatalog(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Back link */}
        <Link to="/" className="inline-flex items-center text-white/40 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
        </Link>

        {/* Success banner */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-[#4A6741]/15 border border-[#4A6741]/40 rounded-2xl p-5 mb-8 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#A8C99B] flex-shrink-0" />
              <div>
                <p className="font-bold text-white">
                  {status === 'setup_success' ? 'Card authorized successfully!' : 'Payment successful!'}
                </p>
                <p className="text-white/50 text-sm">
                  {status === 'setup_success'
                    ? 'Your card is saved on file. A MedRevolve specialist will reach out within 24 hours to finalize your setup.'
                    : 'A specialist will reach out within 24 hours to kick off your platform setup.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <ShoppingCart className="w-7 h-7 text-[#A8C99B]" /> Your Cart
            </h1>
            <p className="text-white/40 text-sm mt-1">Add services, then check out — pay now or authorize a card on file.</p>
          </div>
          {cart.length > 0 && (
            <Button variant="ghost" onClick={() => clearCart()} className="text-white/40 hover:text-white text-sm">
              Clear all
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Cart items / catalog */}
          <div className="lg:col-span-2 space-y-4">

            {cart.length === 0 && !showCatalog && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
                <ShoppingCart className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="font-bold text-white text-lg mb-1">Your cart is empty</h3>
                <p className="text-white/40 text-sm mb-6">Browse our B2B services and add what you need to get started.</p>
                <Button onClick={() => setShowCatalog(true)} className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-lg font-bold px-6">
                  Browse Services
                </Button>
              </div>
            )}

            {/* Cart items */}
            <AnimatePresence>
              {cart.map(item => {
                const Icon = CATALOG.find(c => c.id === item.id)?.icon || Package;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#4A6741]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#A8C99B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm">{item.name}</h3>
                      <p className="text-white/40 text-xs">${item.price} {item.type === 'monthly' ? '/mo' : 'one-time'}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center">
                        <Minus className="w-3.5 h-3.5 text-white/60" />
                      </button>
                      <span className="w-8 text-center text-white text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center">
                        <Plus className="w-3.5 h-3.5 text-white/60" />
                      </button>
                    </div>
                    <div className="text-right w-20">
                      <p className="text-white font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Add more / catalog */}
            {cart.length > 0 && !showCatalog && (
              <button onClick={() => setShowCatalog(true)} className="w-full py-3 border border-dashed border-white/15 rounded-2xl text-white/50 hover:text-white hover:border-white/30 text-sm font-medium transition-all">
                + Add another service
              </button>
            )}

            <AnimatePresence>
              {showCatalog && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden">
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white">Available Services</h3>
                      <button onClick={() => setShowCatalog(false)} className="text-white/40 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {CATALOG.map(item => {
                        const Icon = item.icon;
                        const inCart = cart.some(c => c.id === item.id);
                        return (
                          <div key={item.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-9 h-9 rounded-lg bg-[#4A6741]/20 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-4 h-4 text-[#A8C99B]" />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-white text-sm">{item.name}</p>
                                <p className="text-white/40 text-xs leading-snug">{item.desc}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="text-[#A8C99B] font-bold text-sm">${item.price}{item.type === 'monthly' ? '/mo' : ''}</span>
                              <Button size="sm" onClick={() => handleAdd(item)} disabled={inCart}
                                className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-lg text-xs h-8 px-3">
                                {inCart ? 'Added' : 'Add'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Checkout panel */}
          <div>
            <CartCheckoutPanel
              cart={cart}
              subtotal={subtotal}
              tax={tax}
              total={total}
              hasMonthly={hasMonthly}
            />
          </div>
        </div>
      </div>
    </div>
  );
}