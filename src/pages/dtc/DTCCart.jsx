import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getProduct } from '@/data/dtcProducts';
import { getCart, updateQty, removeFromCart, clearCart } from '@/lib/cartStore';
import CartCheckoutPanel from '@/components/cart/CartCheckoutPanel';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function DTCCart() {
  const [cart, setCart] = useState(getCart());

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

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 px-5 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <Link to="/shop" className="inline-flex items-center text-sm text-gray-400 hover:text-[#0B8B7A] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Continue Shopping
        </Link>

        {/* Success banner */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-green-800">
                  {status === 'setup_success' ? 'Card authorized successfully!' : 'Payment successful!'}
                </p>
                <p className="text-green-600 text-sm">
                  {status === 'setup_success'
                    ? 'Your card is saved on file. A provider will review your order and reach out within 24 hours.'
                    : 'A provider will review your order and reach out within 24 hours to finalize your treatment plan.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#0A0A0A] flex items-center gap-3">
              <ShoppingCart className="w-7 h-7 text-[#0B8B7A]" /> Your Cart
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {cart.length === 0
                ? 'Your cart is empty — browse our catalog to get started.'
                : `${cart.reduce((n, i) => n + i.quantity, 0)} item(s) ready for checkout.`}
            </p>
          </div>
          {cart.length > 0 && (
            <Button variant="ghost" onClick={() => clearCart()} className="text-gray-400 hover:text-red-500 text-sm">
              Clear all
            </Button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-16 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="font-black text-[#0A0A0A] text-xl mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              Browse our research-backed compounds — GLP-1 weight loss, peptides, hormones, longevity, and more.
              Every product links to peer-reviewed studies.
            </p>
            <Link to="/shop">
              <Button className="bg-[#0B8B7A] hover:bg-[#0A7A6A] text-white rounded-lg font-bold px-8 h-auto py-3">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.map(item => {
                  const product = getProduct(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                      className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                      {/* Image */}
                      <Link to={`/product/${item.id}`} className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50">
                          {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                        </div>
                      </Link>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-black text-[#0A0A0A] text-sm hover:text-[#0B8B7A] transition-colors">{item.name}</h3>
                        </Link>
                        <p className="text-gray-400 text-xs">
                          ${item.price} {item.type === 'monthly' ? '/mo' : 'one-time'}
                          {product && <span className="ml-2">· {product.categoryLabel}</span>}
                        </p>
                        {product?.type === 'prescription' && (
                          <p className="text-[10px] text-blue-600 font-bold mt-1">⚠ Provider consultation required</p>
                        )}
                        {product?.type === 'ruo' && (
                          <p className="text-[10px] text-amber-600 font-bold mt-1">⚠ Research Use Only</p>
                        )}
                      </div>
                      {/* Quantity */}
                      <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-md hover:bg-gray-200 flex items-center justify-center">
                          <Minus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <span className="w-8 text-center text-[#0A0A0A] text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-md hover:bg-gray-200 flex items-center justify-center">
                          <Plus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </div>
                      {/* Price */}
                      <div className="text-right w-20">
                        <p className="text-[#0A0A0A] font-black text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      {/* Remove */}
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Add more */}
              <Link to="/shop" className="block w-full py-3 border border-dashed border-gray-200 rounded-2xl text-gray-400 hover:text-[#0B8B7A] hover:border-[#0B8B7A]/30 text-sm font-medium transition-all text-center">
                + Add more products
              </Link>
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
        )}

        {/* Trust strip */}
        {cart.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#0B8B7A]" /> LegiScript Certified</div>
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#0B8B7A]" /> FDA-Compliant Pharmacy</div>
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#0B8B7A]" /> US-Licensed Providers</div>
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#0B8B7A]" /> Free Discreet Delivery</div>
          </div>
        )}
      </div>
    </div>
  );
}