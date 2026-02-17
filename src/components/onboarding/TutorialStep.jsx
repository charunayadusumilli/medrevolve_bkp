import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, MessageSquare, Video, Pill, 
  Clock, HelpCircle, Shield, Smartphone 
} from 'lucide-react';

export default function TutorialStep() {
  const tutorials = [
    {
      id: 'booking',
      label: 'Booking Appointments',
      icon: Calendar,
      content: [
        {
          title: 'How to Book a Consultation',
          steps: [
            'Go to "Consultations" and click "Book Now"',
            'Choose your consultation type (video, phone, or in-person)',
            'Select a provider based on their specialty and availability',
            'Pick your preferred date and time',
            'Confirm payment and receive appointment confirmation'
          ]
        }
      ]
    },
    {
      id: 'video',
      label: 'Video Consultations',
      icon: Video,
      content: [
        {
          title: 'Joining Your Video Call',
          steps: [
            'Log into your patient portal',
            'Go to "My Appointments" and find your upcoming appointment',
            'Click "Join Call" 5 minutes before your scheduled time',
            'Allow camera and microphone permissions when prompted',
            'Your provider will join shortly after'
          ]
        }
      ]
    },
    {
      id: 'prescriptions',
      label: 'Prescriptions',
      icon: Pill,
      content: [
        {
          title: 'Managing Your Prescriptions',
          steps: [
            'After your consultation, prescriptions appear in your portal',
            'View dosage, frequency, and special instructions',
            'Authorize pharmacy fulfillment',
            'Track your order and receive it within 2-3 business days',
            'Refill available prescriptions directly from your portal'
          ]
        }
      ]
    },
    {
      id: 'messaging',
      label: 'Messaging Your Provider',
      icon: MessageSquare,
      content: [
        {
          title: 'Secure Messaging',
          steps: [
            'Navigate to the "Messages" section in your portal',
            'Click "New Message" to start a conversation',
            'Select a provider or use urgent messaging for time-sensitive issues',
            'Attach documents if needed (test results, photos, etc.)',
            'Receive responses within 24 hours'
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8"
      >
        <h2 className="text-xl font-medium text-[#2D3A2D] mb-2">How to Use MedRevolve</h2>
        <p className="text-[#5A6B5A] mb-8">
          Learn how to make the most of your patient portal and healthcare features
        </p>

        <Tabs defaultValue="booking" className="w-full">
          <TabsList className="w-full justify-start bg-white border-b border-[#E8E0D5] rounded-none mb-6 p-0">
            {tutorials.map((tutorial) => {
              const Icon = tutorial.icon;
              return (
                <TabsTrigger
                  key={tutorial.id}
                  value={tutorial.id}
                  className="rounded-none border-b-2 border-transparent px-6 py-3 text-sm font-medium text-[#5A6B5A] hover:text-[#4A6741] data-[state=active]:border-[#4A6741] data-[state=active]:text-[#4A6741] transition-colors"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tutorial.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tutorials.map((tutorial) => (
            <TabsContent key={tutorial.id} value={tutorial.id} className="space-y-6">
              {tutorial.content.map((section, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <h3 className="text-lg font-medium text-[#2D3A2D] mb-4">{section.title}</h3>
                  <ol className="space-y-3">
                    {section.steps.map((step, stepIdx) => (
                      <li key={stepIdx} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#D4E5D7] text-[#4A6741] flex items-center justify-center font-semibold text-sm flex-shrink-0">
                          {stepIdx + 1}
                        </div>
                        <p className="text-[#5A6B5A] pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#F5F0E8] rounded-2xl p-8"
      >
        <h3 className="text-lg font-medium text-[#2D3A2D] mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#4A6741]" />
          Common Questions
        </h3>

        <div className="space-y-4">
          {[
            {
              q: 'Is my health information secure?',
              a: 'Yes, all patient data is encrypted end-to-end and complies with HIPAA regulations.'
            },
            {
              q: 'What should I do in case of a medical emergency?',
              a: 'Our platform is not for emergencies. Please call 911 or visit your nearest emergency room for urgent care.'
            },
            {
              q: 'Can I cancel or reschedule my appointment?',
              a: 'Yes, you can cancel or reschedule up to 24 hours before your appointment from your portal.'
            },
            {
              q: 'How long does it take to get my prescription?',
              a: 'Most prescriptions are filled within 2-3 business days and shipped directly to your address.'
            }
          ].map((faq, idx) => (
            <details
              key={idx}
              className="bg-white rounded-xl p-4 cursor-pointer group"
            >
              <summary className="font-medium text-[#2D3A2D] group-open:text-[#4A6741] transition-colors">
                {faq.q}
              </summary>
              <p className="text-[#5A6B5A] mt-3 text-sm">{faq.a}</p>
            </details>
          ))}
        </div>
      </motion.div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-2 gap-4"
      >
        {[
          {
            icon: Smartphone,
            title: 'Mobile-Friendly',
            desc: 'Use our app or mobile site for easy access on the go'
          },
          {
            icon: Clock,
            title: 'Available 24/7',
            desc: 'Access your portal anytime to message providers or view records'
          },
          {
            icon: Shield,
            title: 'HIPAA Compliant',
            desc: 'Your privacy and data security are our top priority'
          },
          {
            icon: HelpCircle,
            title: 'Get Help',
            desc: 'Contact our support team anytime if you need assistance'
          }
        ].map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div key={idx} className="bg-white rounded-xl p-4 flex items-start gap-3">
              <Icon className="w-5 h-5 text-[#4A6741] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#2D3A2D] text-sm">{tip.title}</p>
                <p className="text-xs text-[#5A6B5A] mt-1">{tip.desc}</p>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}