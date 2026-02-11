import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, ArrowRight, Check, Shield, Truck, Clock, 
  Star, ChevronRight, Leaf, Heart
} from 'lucide-react';

const products = {
  1: {
    name: 'Semaglutide',
    category: 'Weight Loss',
    description: 'FDA-approved GLP-1 receptor agonist for sustainable weight management. Semaglutide helps reduce appetite and promote long-term weight loss by mimicking the hormone GLP-1.',
    image: 'https://images.unsplash.com/photo-1620231080477-7c3a0a6eff41?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1620231080477-7c3a0a6eff41?w=800&q=80',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
      'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80'
    ],
    tag: 'Best Seller',
    price: 299,
    benefits: [
      'Clinically proven to reduce body weight by up to 15%',
      'Reduces appetite and food cravings',
      'Improves blood sugar control',
      'Once-weekly injection for convenience',
      'Supports long-term weight maintenance'
    ],
    howItWorks: 'Semaglutide works by mimicking the hormone GLP-1, which targets areas of the brain that regulate appetite and food intake. It slows gastric emptying, helping you feel full longer and reducing overall calorie consumption.',
    sideEffects: ['Nausea', 'Diarrhea', 'Vomiting', 'Constipation', 'Abdominal pain'],
    dosage: 'Starting dose of 0.25mg weekly, gradually increasing to maintenance dose of 2.4mg weekly over 16-20 weeks.'
  },
  2: {
    name: 'Tirzepatide',
    category: 'Weight Loss',
    description: 'Advanced dual-action GIP and GLP-1 receptor agonist for enhanced weight management results.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
      'https://images.unsplash.com/photo-1620231080477-7c3a0a6eff41?w=800&q=80',
      'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&q=80'
    ],
    tag: 'Popular',
    price: 399,
    benefits: [
      'Dual-action mechanism for enhanced results',
      'Up to 22% body weight reduction in clinical trials',
      'Improves metabolic health markers',
      'Once-weekly injection',
      'May support cardiovascular health'
    ],
    howItWorks: 'Tirzepatide is a first-in-class dual GIP and GLP-1 receptor agonist. This dual action provides superior weight loss results by targeting multiple pathways that regulate appetite, food intake, and metabolism.',
    sideEffects: ['Nausea', 'Diarrhea', 'Decreased appetite', 'Vomiting', 'Constipation'],
    dosage: 'Starting dose of 2.5mg weekly, with gradual increases up to 15mg weekly based on tolerability.'
  }
};

// Default product for unknown IDs
const defaultProduct = {
  name: 'Wellness Treatment',
  category: 'Wellness',
  description: 'Premium wellness treatment designed to support your health journey.',
  image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
  images: ['https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80'],
  tag: null,
  price: 199,
  benefits: [
    'Science-backed formulation',
    'Premium quality ingredients',
    'Personalized dosing',
    'Medical provider oversight',
    'Discreet delivery'
  ],
  howItWorks: 'This treatment works by supporting your body\'s natural processes to achieve optimal wellness results.',
  sideEffects: ['Consult with your provider for complete information'],
  dosage: 'Dosing will be personalized by your medical provider based on your health profile.'
};

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || '1';
  const product = products[productId] || defaultProduct;
  
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm">
          <Link to={createPageUrl('Home')} className="text-[#5A6B5A] hover:text-[#4A6741]">Home</Link>
          <ChevronRight className="w-4 h-4 text-[#5A6B5A]" />
          <Link to={createPageUrl('Products')} className="text-[#5A6B5A] hover:text-[#4A6741]">Products</Link>
          <ChevronRight className="w-4 h-4 text-[#5A6B5A]" />
          <span className="text-[#2D3A2D]">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F5F0E8] mb-4">
              <img 
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.tag && (
                <Badge className="absolute top-6 left-6 bg-[#4A6741] text-white border-none text-sm px-4 py-1">
                  {product.tag}
                </Badge>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-[#4A6741]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-sm font-medium text-[#4A6741] uppercase tracking-wide">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mt-2 mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-[#5A6B5A] leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-3xl font-medium text-[#2D3A2D]">${product.price}</span>
              <span className="text-[#5A6B5A]">/month</span>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <h3 className="font-medium text-[#2D3A2D] mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#4A6741]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#4A6741]" />
                    </div>
                    <span className="text-[#5A6B5A] text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <Link to={createPageUrl('Questionnaire')}>
              <Button 
                size="lg"
                className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full py-6 text-base font-medium group mb-6"
              >
                Start Your Treatment
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-[#5A6B5A]">
                <Shield className="w-5 h-5 text-[#4A6741]" />
                <span>NABP Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5A6B5A]">
                <Truck className="w-5 h-5 text-[#4A6741]" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5A6B5A]">
                <Clock className="w-5 h-5 text-[#4A6741]" />
                <span>3-5 Days</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16"
        >
          <Tabs defaultValue="how" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-[#E8E0D5] rounded-none p-0 h-auto">
              <TabsTrigger 
                value="how"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4A6741] data-[state=active]:bg-transparent px-6 py-4"
              >
                How It Works
              </TabsTrigger>
              <TabsTrigger 
                value="dosage"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4A6741] data-[state=active]:bg-transparent px-6 py-4"
              >
                Dosage
              </TabsTrigger>
              <TabsTrigger 
                value="side-effects"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4A6741] data-[state=active]:bg-transparent px-6 py-4"
              >
                Side Effects
              </TabsTrigger>
            </TabsList>
            <TabsContent value="how" className="pt-8">
              <div className="max-w-3xl">
                <h3 className="text-2xl font-medium text-[#2D3A2D] mb-4">How {product.name} Works</h3>
                <p className="text-[#5A6B5A] leading-relaxed">{product.howItWorks}</p>
              </div>
            </TabsContent>
            <TabsContent value="dosage" className="pt-8">
              <div className="max-w-3xl">
                <h3 className="text-2xl font-medium text-[#2D3A2D] mb-4">Recommended Dosage</h3>
                <p className="text-[#5A6B5A] leading-relaxed">{product.dosage}</p>
              </div>
            </TabsContent>
            <TabsContent value="side-effects" className="pt-8">
              <div className="max-w-3xl">
                <h3 className="text-2xl font-medium text-[#2D3A2D] mb-4">Potential Side Effects</h3>
                <p className="text-[#5A6B5A] mb-4">
                  Most side effects are mild and tend to decrease over time. Common side effects include:
                </p>
                <ul className="grid grid-cols-2 gap-2">
                  {product.sideEffects.map((effect, index) => (
                    <li key={index} className="flex items-center gap-2 text-[#5A6B5A]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4A6741]" />
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </section>
    </div>
  );
}