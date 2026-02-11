import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, Crown, Zap, CheckCircle } from 'lucide-react';

const tiers = [
  {
    name: 'Bronze',
    icon: Award,
    color: '#CD7F32',
    bgColor: '#FFF5E6',
    commission: '15%',
    requirements: 'Starting tier',
    benefits: [
      '15% commission on all sales',
      'Basic marketing materials',
      'Monthly payouts',
      'Email support'
    ]
  },
  {
    name: 'Silver',
    icon: TrendingUp,
    color: '#C0C0C0',
    bgColor: '#F5F5F5',
    commission: '20%',
    requirements: '$5,000+ monthly sales',
    benefits: [
      '20% commission on all sales',
      'Premium marketing materials',
      'Bi-weekly payouts',
      'Priority email support',
      'Exclusive product previews'
    ],
    popular: true
  },
  {
    name: 'Gold',
    icon: Crown,
    color: '#FFD700',
    bgColor: '#FFFBEA',
    commission: '25%',
    requirements: '$15,000+ monthly sales',
    benefits: [
      '25% commission on all sales',
      'Custom marketing assets',
      'Weekly payouts',
      'Dedicated account manager',
      'Early product access',
      'Featured on website'
    ]
  },
  {
    name: 'Platinum',
    icon: Zap,
    color: '#E5E4E2',
    bgColor: '#F9F9F9',
    commission: '30%',
    requirements: '$30,000+ monthly sales',
    benefits: [
      '30% commission on all sales',
      'Fully custom campaigns',
      'On-demand payouts',
      '24/7 priority support',
      'Co-branding opportunities',
      'Exclusive events & retreats',
      'Annual bonus structure'
    ]
  }
];

export default function CommissionTiers() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#2D3A2D] mb-4">
            Tiered <span className="font-medium text-[#4A6741]">Commission Structure</span>
          </h2>
          <p className="text-lg text-[#5A6B5A] max-w-2xl mx-auto">
            Grow your earnings as you grow your impact. The more you sell, the more you earn.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-[#4A6741] text-white border-none px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div 
                  className={`rounded-3xl p-6 h-full border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    tier.popular 
                      ? 'border-[#4A6741] shadow-lg' 
                      : 'border-[#E8E0D5]'
                  }`}
                  style={{ backgroundColor: tier.bgColor }}
                >
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${tier.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: tier.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-[#2D3A2D]">{tier.name}</h3>
                      <p className="text-xs text-[#5A6B5A]">{tier.requirements}</p>
                    </div>
                  </div>

                  {/* Commission Rate */}
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-[#2D3A2D] mb-1">
                      {tier.commission}
                    </div>
                    <p className="text-sm text-[#5A6B5A]">Commission Rate</p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    {tier.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-[#4A6741] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-[#5A6B5A]">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progression Info */}
        <motion.div 
          className="mt-12 bg-[#F5F0E8] rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#5A6B5A] mb-4">
            <strong className="text-[#2D3A2D]">Tier levels are calculated monthly</strong> based on total sales generated through your referral links. 
            Your commission rate applies retroactively to all sales once you reach a new tier.
          </p>
          <p className="text-sm text-[#5A6B5A]">
            Example: If you reach Gold tier mid-month, all sales for that month will be calculated at 25% commission.
          </p>
        </motion.div>
      </div>
    </section>
  );
}