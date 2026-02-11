import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    text: 'MedRevolve changed my life. The process was so simple and the results speak for themselves. I feel more confident and energetic than ever.',
    rating: 5,
    treatment: 'Weight Management'
  },
  {
    name: 'Michael R.',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    text: 'The medical team was incredibly thorough and supportive. They took the time to understand my goals and create a personalized plan.',
    rating: 5,
    treatment: 'Longevity'
  },
  {
    name: 'Jennifer L.',
    location: 'Miami, FL',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    text: 'Finally, a wellness company that delivers on its promises. The quality of care and products is exceptional. Highly recommend!',
    rating: 5,
    treatment: 'Hormone Balance'
  },
  {
    name: 'David K.',
    location: 'Seattle, WA',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    text: 'The convenience of having everything delivered to my door combined with professional medical oversight is unbeatable.',
    rating: 5,
    treatment: 'Weight Management'
  }
];

const transformations = [
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80'
];

export default function ResultsSection() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-sm font-medium text-[#4A6741] uppercase tracking-wide mb-4">
            Real Science. Real Results.
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4">
            Empower & <span className="font-medium text-[#4A6741]">Inspire</span>
          </h2>
          <p className="text-lg text-[#5A6B5A] max-w-2xl mx-auto">
            Join thousands who have transformed their wellness journey with MedRevolve
          </p>
        </motion.div>

        {/* Transformation Images */}
        <div className="relative mb-16">
          <div className="flex gap-4 overflow-hidden">
            <motion.div 
              className="flex gap-4"
              animate={{ x: [0, -1000, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {[...transformations, ...transformations].map((img, index) => (
                <div 
                  key={index}
                  className="w-48 h-64 rounded-2xl overflow-hidden flex-shrink-0"
                >
                  <img 
                    src={img}
                    alt="Transformation"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-medium text-[#2D3A2D]">What Our Customers Say</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                className="rounded-full border-[#4A6741]/20 hover:bg-[#4A6741]/10"
              >
                <ChevronLeft className="w-5 h-5 text-[#4A6741]" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                className="rounded-full border-[#4A6741]/20 hover:bg-[#4A6741]/10"
              >
                <ChevronRight className="w-5 h-5 text-[#4A6741]" />
              </Button>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[380px]"
              >
                <div className="bg-[#F5F0E8] rounded-3xl p-8 h-full">
                  <Quote className="w-10 h-10 text-[#4A6741]/20 mb-4" />
                  
                  <p className="text-[#2D3A2D] leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-[#2D3A2D]">{testimonial.name}</p>
                      <p className="text-sm text-[#5A6B5A]">{testimonial.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#E8E0D5]">
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#4A6741] text-[#4A6741]" />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-[#4A6741] bg-[#4A6741]/10 px-3 py-1 rounded-full">
                      {testimonial.treatment}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}