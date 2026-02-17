import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, ArrowRight, Check, Shield, Truck, Clock, 
  Star, ChevronRight, Leaf, Heart, Loader2, ShoppingCart
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PersonalizedRecommendations from '@/components/recommendations/PersonalizedRecommendations';

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || '1';
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const products = await base44.entities.Product.list();
        const foundProduct = products.find(p => p.product_id === productId || p.id === productId);
        
        if (foundProduct) {
          setProduct({
            ...foundProduct,
            images: foundProduct.image_url ? [foundProduct.image_url] : ['https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80'],
          });
        } else {
          // Fallback if product not found
          setProduct({
            name: 'Product Not Found',
            category: 'Wellness',
            description: 'This product is no longer available.',
            image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
            images: ['https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80'],
            price: 0,
            benefits: [],
            howItWorks: 'Product information unavailable.',
            sideEffects: [],
            dosage: 'Please contact support.'
          });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct({
          name: 'Error Loading Product',
          category: 'Wellness',
          description: 'Unable to load product details.',
          image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
          images: ['https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80'],
          price: 0,
          benefits: [],
          howItWorks: '',
          sideEffects: [],
          dosage: ''
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.minimum_price || product.price || 0,
          image: product.image_url || product.images?.[0] || '',
          quantity: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.location.href = createPageUrl('Cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4A6741] animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-[#2D3A2D] mb-4">Product Not Found</h1>
        <Link to={createPageUrl('Products')}>
          <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white">
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

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

      {/* Personalized Recommendations */}
      <PersonalizedRecommendations 
        currentProductId={productId} 
        title="You May Also Like" 
      />
    </div>
  );
}