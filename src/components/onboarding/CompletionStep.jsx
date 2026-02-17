import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MessageSquare, Pill, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function CompletionStep() {
  const nextSteps = [
    {
      icon: Calendar,
      title: 'Book Your First Consultation',
      description: 'Schedule an appointment with a provider',
      link: 'Consultations'
    },
    {
      icon: MessageSquare,
      title: 'Send a Message',
      description: 'Start a conversation with your provider',
      link: 'Messages'
    },
    {
      icon: Pill,
      title: 'View Your Prescriptions',
      description: 'Check your prescription history and status',
      link: 'PatientPortal'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Success Message */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-light text-[#2D3A2D] mb-2">
          You're All Set!
        </h2>
        <p className="text-[#5A6B5A] max-w-lg mx-auto">
          Your account is ready to use. You can now book consultations, message providers, 
          and manage your healthcare all in one place.
        </p>
      </motion.div>

      {/* What's Next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-8"
      >
        <h3 className="text-xl font-medium text-[#2D3A2D] mb-6">Next Steps</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {nextSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <Link
                  to={createPageUrl(step.link)}
                  className="block p-6 rounded-xl border-2 border-[#E8E0D5] hover:border-[#4A6741] hover:bg-[#F5F0E8] transition-all group h-full"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#D4E5D7] flex items-center justify-center mb-4 group-hover:bg-[#4A6741] transition-colors">
                    <Icon className="w-5 h-5 text-[#4A6741] group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="font-medium text-[#2D3A2D] mb-1 group-hover:text-[#4A6741] transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-sm text-[#5A6B5A] mb-4">{step.description}</p>
                  <ArrowRight className="w-4 h-4 text-[#5A6B5A] group-hover:text-[#4A6741] transition-colors" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-[#4A6741]/5 to-[#6B8F5E]/5 rounded-2xl p-8 border border-[#D4E5D7]"
      >
        <h3 className="text-lg font-medium text-[#2D3A2D] mb-4">Pro Tips</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#4A6741] mt-2 flex-shrink-0" />
            <p className="text-[#5A6B5A]">
              <strong>Prepare for appointments:</strong> Have your insurance card and any recent medical records ready
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#4A6741] mt-2 flex-shrink-0" />
            <p className="text-[#5A6B5A]">
              <strong>Use messaging for follow-ups:</strong> Questions between appointments? Send a secure message
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#4A6741] mt-2 flex-shrink-0" />
            <p className="text-[#5A6B5A]">
              <strong>Keep documents updated:</strong> Update your insurance and ID if they change
            </p>
          </li>
        </ul>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center pt-4"
      >
        <p className="text-[#5A6B5A] mb-2">Need help?</p>
        <Link
          to={createPageUrl('Contact')}
          className="text-[#4A6741] hover:text-[#3D5636] font-medium transition-colors"
        >
          Contact our support team →
        </Link>
      </motion.div>
    </div>
  );
}