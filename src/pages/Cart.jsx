import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const updateQuantity = (id, delta) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = cartItems.length > 0 ? 9.99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-2">Shopping Cart</h1>
          <p className="text-[#5A6B5A] mb-8">{cartItems.length} items</p>

          {cartItems.length === 0 ? (
            <Card className="text-center py-16">
              <ShoppingCart className="w-16 h-16 text-[#D4E5D7] mx-auto mb-4" />
              <h3 className="text-xl font-light text-[#2D3A2D] mb-2">Your cart is empty</h3>
              <p className="text-[#5A6B5A] mb-6">Start shopping to add items to your cart</p>
              <Link to={createPageUrl('Products')}>
                <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full">
                  Shop Products
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-6">
                    <div className="flex gap-6">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-[#2D3A2D] mb-1">{item.name}</h3>
                        <p className="text-sm text-[#5A6B5A] mb-3">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-[#2D3A2D] font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="ml-auto text-red-500 hover:text-red-600"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <Card className="p-6 sticky top-24">
                  <h3 className="font-medium text-[#2D3A2D] mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5A6B5A]">Subtotal</span>
                      <span className="text-[#2D3A2D] font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#5A6B5A]">Shipping</span>
                      <span className="text-[#2D3A2D] font-medium">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-[#E8E0D5]">
                      <div className="flex justify-between">
                        <span className="font-medium text-[#2D3A2D]">Total</span>
                        <span className="font-medium text-[#2D3A2D] text-lg">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full h-12">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Link to={createPageUrl('Products')}>
                    <Button variant="ghost" className="w-full mt-3 text-[#5A6B5A]">
                      Continue Shopping
                    </Button>
                  </Link>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}