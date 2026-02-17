import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { 
  ArrowLeft, ArrowRight, Check, ShoppingBag, 
  CreditCard, MapPin, Loader2, AlertCircle
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

let stripePromise = null;

const steps = [
  { id: 1, name: 'Shipping', icon: MapPin },
  { id: 2, name: 'Review', icon: ShoppingBag },
  { id: 3, name: 'Payment', icon: CreditCard }
];

export default function Checkout() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState([]);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      if (items.length === 0) {
        navigate(createPageUrl('Cart'));
      }
      setCartItems(items);
    } else {
      navigate(createPageUrl('Cart'));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const validateShipping = () => {
    const required = ['fullName', 'email', 'address', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!shippingInfo[field]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateShipping()) return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError('');

      // Check if running in iframe
      if (window.self !== window.top) {
        setError('Checkout must be completed in a published app, not in preview mode. Please use the published app URL.');
        setLoading(false);
        return;
      }

      // Initialize Stripe if not already done
      if (!stripePromise) {
        try {
          const { data: keyData } = await base44.functions.invoke('getStripePublishableKey');
          if (keyData.error) {
            setError('Stripe is not configured. Please set up Stripe in the dashboard.');
            setLoading(false);
            return;
          }
          stripePromise = loadStripe(keyData.publishableKey);
        } catch (err) {
          setError('Failed to initialize payment system.');
          setLoading(false);
          return;
        }
      }

      const { data } = await base44.functions.invoke('createCheckout', {
        items: cartItems,
        shippingInfo: shippingInfo,
        successUrl: window.location.origin + createPageUrl('OrderSuccess'),
        cancelUrl: window.location.origin + createPageUrl('Checkout')
      });

      if (data.error) {
        setError(data.error);
        return;
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (stripeError) {
        setError(stripeError.message);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to process checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-[#2D3A2D] mb-6">Shipping Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                  placeholder="John Doe"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                  placeholder="john@example.com"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                placeholder="(555) 123-4567"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                placeholder="123 Main St"
                className="mt-1"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                  placeholder="Los Angeles"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                  placeholder="CA"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                  placeholder="90210"
                  className="mt-1"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-[#2D3A2D] mb-6">Review Your Order</h2>
            
            {/* Shipping Details */}
            <Card className="border-[#E8E0D5]">
              <CardContent className="p-6">
                <h3 className="font-medium text-[#2D3A2D] mb-4">Shipping To</h3>
                <div className="text-sm text-[#5A6B5A] space-y-1">
                  <p className="font-medium text-[#2D3A2D]">{shippingInfo.fullName}</p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                  <p className="pt-2">{shippingInfo.email}</p>
                  {shippingInfo.phone && <p>{shippingInfo.phone}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                  className="mt-4 text-[#4A6741]"
                >
                  Edit
                </Button>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-[#E8E0D5]">
              <CardContent className="p-6">
                <h3 className="font-medium text-[#2D3A2D] mb-4">Order Items</h3>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b border-[#E8E0D5] last:border-0">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg bg-[#F5F0E8] overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-[#2D3A2D]">{item.name}</p>
                          <p className="text-sm text-[#5A6B5A]">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-[#2D3A2D]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-[#2D3A2D] mb-6">Payment</h2>
            
            <Card className="border-[#E8E0D5] bg-[#F5F0E8]/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-[#4A6741] mt-0.5" />
                  <div>
                    <h3 className="font-medium text-[#2D3A2D] mb-2">Secure Payment</h3>
                    <p className="text-sm text-[#5A6B5A] leading-relaxed">
                      You'll be redirected to our secure payment partner Stripe to complete your purchase. 
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-[#5A6B5A] pt-3 border-t border-[#E8E0D5]">
                  <Check className="w-4 h-4 text-[#4A6741]" />
                  <span>256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link 
          to={createPageUrl('Cart')} 
          className="inline-flex items-center gap-2 text-sm text-[#5A6B5A] hover:text-[#4A6741] mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted 
                        ? 'bg-[#4A6741] text-white' 
                        : isActive 
                          ? 'bg-[#4A6741] text-white ring-4 ring-[#4A6741]/20' 
                          : 'bg-[#E8E0D5] text-[#5A6B5A]'
                    }`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${
                      isActive || isCompleted ? 'text-[#4A6741]' : 'text-[#5A6B5A]'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 transition-all ${
                      isCompleted ? 'bg-[#4A6741]' : 'bg-[#E8E0D5]'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="border-[#E8E0D5]">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {renderStep()}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-[#E8E0D5]">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={loading}
                      className="border-[#4A6741] text-[#4A6741]"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  )}
                  
                  {currentStep < 3 ? (
                    <Button
                      onClick={handleNext}
                      className="ml-auto bg-[#4A6741] hover:bg-[#3D5636] text-white"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCheckout}
                      disabled={loading}
                      className="ml-auto bg-[#4A6741] hover:bg-[#3D5636] text-white px-8"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Order
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-[#E8E0D5] sticky top-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#2D3A2D] mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4 pb-4 border-b border-[#E8E0D5]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A6B5A]">Subtotal</span>
                    <span className="text-[#2D3A2D]">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A6B5A]">Shipping</span>
                    <span className="text-[#4A6741]">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5A6B5A]">Tax</span>
                    <span className="text-[#2D3A2D]">${calculateTax().toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold text-[#2D3A2D]">Total</span>
                  <span className="text-2xl font-bold text-[#2D3A2D]">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#5A6B5A]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#4A6741]" />
                    <span>Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#4A6741]" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#4A6741]" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}