import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Users, Lock } from 'lucide-react';

export default function WelcomeStep() {
  const features = [
    {
      icon: Users,
      title: 'Licensed Providers',
      description: 'Connect with board-certified doctors and specialists'
    },
    {
      icon: Clock,
      title: 'Quick Consultations',
      description: 'Get appointments scheduled in minutes, not weeks'
    },
    {
      icon: CheckCircle2,
      title: 'Prescriptions Delivered',
      description: 'Medications shipped directly to your door'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your health information is protected and encrypted'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 text-center"
      >
        <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">
          Welcome to MedRevolve
        </h2>
        <p className="text-[#5A6B5A] mb-6 max-w-2xl mx-auto">
          Get quality healthcare delivered to your door. Connect with licensed providers, 
          get personalized treatment plans, and access prescribed medications—all from home.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-[#D4E5D7] flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-[#4A6741]" />
              </div>
              <h3 className="font-medium text-[#2D3A2D] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#5A6B5A]">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* What to Expect */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#F5F0E8] rounded-2xl p-8"
      >
        <h3 className="text-lg font-medium text-[#2D3A2D] mb-4">What to Expect</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">1</div>
            <div>
              <p className="font-medium text-[#2D3A2D]">Complete Your Profile</p>
              <p className="text-sm text-[#5A6B5A]">Tell us about yourself and your health</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">2</div>
            <div>
              <p className="font-medium text-[#2D3A2D]">Verify Your Identity</p>
              <p className="text-sm text-[#5A6B5A]">Upload your ID and insurance for verification</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#4A6741] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">3</div>
            <div>
              <p className="font-medium text-[#2D3A2D]">Book Your First Consultation</p>
              <p className="text-sm text-[#5A6B5A]">Schedule with a provider at your convenience</p>
            </div>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}