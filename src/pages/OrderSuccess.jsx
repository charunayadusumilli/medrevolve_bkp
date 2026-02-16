import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

export default function OrderSuccess() {
  useEffect(() => {
    // Clear cart on successful order
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-[#E8E0D5] overflow-hidden">
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>

              <h1 className="text-3xl font-bold text-[#2D3A2D] mb-3">
                Order Placed Successfully!
              </h1>
              <p className="text-lg text-[#5A6B5A] mb-8">
                Thank you for your purchase. Your order is being processed.
              </p>

              <div className="bg-[#F5F0E8] rounded-xl p-6 mb-8 text-left">
                <h2 className="font-semibold text-[#2D3A2D] mb-4">What happens next?</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4A6741]/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-[#4A6741]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#2D3A2D]">Confirmation Email</p>
                      <p className="text-sm text-[#5A6B5A]">
                        You'll receive an order confirmation email shortly with your order details.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4A6741]/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-[#4A6741]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#2D3A2D]">Shipping</p>
                      <p className="text-sm text-[#5A6B5A]">
                        Your order will be shipped within 3-5 business days. You'll receive tracking information via email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={createPageUrl('Products')}>
                  <Button 
                    variant="outline"
                    className="border-[#4A6741] text-[#4A6741]"
                  >
                    Continue Shopping
                  </Button>
                </Link>
                <Link to={createPageUrl('PatientPortal')}>
                  <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white">
                    View Patient Portal
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-[#5A6B5A] mt-8">
                Need help? Contact us at{' '}
                <a href="mailto:support@medrevolve.com" className="text-[#4A6741] hover:underline">
                  support@medrevolve.com
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}