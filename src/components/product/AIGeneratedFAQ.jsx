import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { ChevronDown, Loader2 } from 'lucide-react';

export default function AIGeneratedFAQ({ productId, productName }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const loadFAQ = async () => {
      try {
        setLoading(true);
        const { data } = await base44.functions.invoke('generateProductContent', {
          productId,
          contentType: 'faq'
        });
        setFaqs(data.faqs || []);
      } catch (error) {
        console.error('Error generating FAQ:', error);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadFAQ();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-[#4A6741] animate-spin" />
      </div>
    );
  }

  if (!faqs.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-8">
      <h3 className="text-2xl font-medium text-[#2D3A2D] mb-6">Frequently Asked Questions</h3>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="border border-[#E8E0D5] rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#F5F0E8] transition-colors"
            >
              <span className="text-left font-medium text-[#2D3A2D]">{faq.question}</span>
              <motion.div
                animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-[#4A6741] flex-shrink-0" />
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-[#FDFBF7] border-t border-[#E8E0D5]"
                >
                  <p className="px-5 py-4 text-[#5A6B5A] leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}