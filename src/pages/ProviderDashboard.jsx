import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle, Calendar, FileText, Video } from 'lucide-react';

const PROVIDER_JOURNEY = [
  {
    step: 1,
    title: 'Email Login',
    description: 'Sign in with your provider email',
    icon: '📧',
    status: 'completed',
  },
  {
    step: 2,
    title: 'Complete Profile',
    description: 'Fill in credentials, experience, and bio',
    duration: '10 mins',
    icon: '📝',
  },
  {
    step: 3,
    title: 'Qualiphy.me Exam',
    description: 'Medical qualification exam (15-30 mins)',
    duration: '20 mins',
    icon: '✅',
  },
  {
    step: 4,
    title: 'Live Consultation',
    description: 'Chat with credentialing team (20-30 mins)',
    duration: '25 mins',
    icon: '🎥',
  },
  {
    step: 5,
    title: 'Approval & Onboarding',
    description: 'Receive contract and platform training',
    duration: '2-3 days',
    icon: '🎉',
  },
];

export default function ProviderDashboard() {
  const [user, setUser] = useState(null);
  const [journeyProgress, setJourneyProgress] = useState(1);

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (e) {
        base44.auth.redirectToLogin();
      }
    };
    checkUser();
  }, []);

  const { data: providerData } = useQuery({
    queryKey: ['provider', user?.email],
    queryFn: () => base44.entities.ProviderIntake.filter({ email: user?.email }),
    enabled: !!user?.email,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#2D3A2D] mb-2">Provider Onboarding</h1>
              <p className="text-[#5A6B5A]">Welcome back, {user.full_name}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => base44.auth.logout('/')}
              className="border-red-200 text-red-600"
            >
              Sign Out
            </Button>
          </div>
        </motion.div>

        {/* Current Status */}
        {providerData && providerData[0] && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="border-none shadow-lg bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-1">Application Status</h3>
                    <p className="text-blue-700">
                      Your application is currently: <span className="font-bold capitalize">{providerData[0].status}</span>
                    </p>
                  </div>
                  <div className="text-3xl">
                    {providerData[0].status === 'pending' && '⏳'}
                    {providerData[0].status === 'under_review' && '📋'}
                    {providerData[0].status === 'approved' && '✅'}
                    {providerData[0].status === 'rejected' && '❌'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Journey Steps */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#2D3A2D]">Your Onboarding Journey</h2>

          <div className="relative">
            {/* Timeline connector */}
            <div className="absolute left-6 top-12 bottom-0 w-1 bg-gradient-to-b from-[#4A6741] to-[#E8E0D5]" />

            {/* Steps */}
            <div className="space-y-6">
              {PROVIDER_JOURNEY.map((item, idx) => {
                const isCompleted = journeyProgress > item.step;
                const isCurrent = journeyProgress === item.step;

                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card
                      className={`border-none transition-all ${
                        isCurrent
                          ? 'shadow-lg ring-2 ring-[#4A6741] bg-white'
                          : isCompleted
                          ? 'shadow-md bg-green-50 border-l-4 border-green-500'
                          : 'shadow-sm bg-white'
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl relative z-10 -ml-8 ${
                              isCompleted
                                ? 'bg-green-500 text-white'
                                : isCurrent
                                ? 'bg-[#4A6741] text-white ring-4 ring-[#4A6741]/20'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : item.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-lg font-semibold text-[#2D3A2D]">
                                Step {item.step}: {item.title}
                              </h3>
                              {item.duration && (
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {item.duration}
                                </span>
                              )}
                            </div>
                            <p className="text-[#5A6B5A] mb-4">{item.description}</p>

                            {isCurrent && (
                              <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white">
                                Continue Onboarding
                              </Button>
                            )}

                            {isCompleted && (
                              <div className="flex items-center gap-2 text-green-700 font-medium">
                                <CheckCircle2 className="w-4 h-4" />
                                Completed
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#2D3A2D] mb-6">Frequently Asked Questions</h2>
          <div className="grid gap-4">
            {[
              {
                q: 'How long does the entire onboarding process take?',
                a: 'Typically 7-10 business days from initial application to approval. Most of this is credentialing review time.',
              },
              {
                q: 'What if I need to pause and continue later?',
                a: 'No problem! Your profile is saved. You can return anytime using your email to pick up where you left off.',
              },
              {
                q: 'When will I be able to see and accept patient consultations?',
                a: 'After approval and onboarding (Step 5), you\'ll receive full access to the provider dashboard and schedule management.',
              },
              {
                q: 'What\'s the difference between the Qualiphy exam and the live consultation?',
                a: 'Qualiphy is an automated medical qualification exam. The live consultation is a call with our medical director to discuss your practice.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-[#2D3A2D] mb-2">Q: {item.q}</h4>
                    <p className="text-[#5A6B5A]">A: {item.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div className="mt-12 bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-3">Need Help?</h3>
          <p className="mb-6">
            Our provider relations team is here to support you through every step of the process.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <a href="mailto:providers@medrevolve.com" className="flex items-center gap-2 hover:underline">
              📧 providers@medrevolve.com
            </a>
            <a href="tel:+15302006352" className="flex items-center gap-2 hover:underline">
              📞 +1 (530) 200-6352
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}