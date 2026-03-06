import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
// Note: QualiPhyExamStep, ProviderBasicInfoForm, LiveConsultationStep are defined below in this file
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Mail, FileText, ClipboardCheck, Video, ArrowRight, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

const JOURNEY_STEPS = [
  { id: 1, title: 'Email Login', icon: Mail, desc: 'Sign in with your email' },
  { id: 2, title: 'Basic Info', icon: FileText, desc: 'Complete profile details' },
  { id: 3, title: 'Qualiphy Exam', icon: ClipboardCheck, desc: 'Medical qualification exam' },
  { id: 4, title: 'Live Consultation', icon: Video, desc: 'Schedule consultation call' },
];

export default function ProviderOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [providerData, setProviderData] = useState(null);
  const [qualiPhyStatus, setQualiPhyStatus] = useState('pending');
  const [qualiphyInviteUrl, setQualiphyInviteUrl] = useState('');
  const [completedSteps, setCompletedSteps] = useState([]);

  // Check user auth
  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (!isAuth) {
          if (!cancelled) setIsLoggedIn(false);
          return;
        }
        const user = await base44.auth.me();
        if (!cancelled) {
          setEmail(user.email);
          setIsLoggedIn(true);
          // Auto-progress to step 2
          setCurrentStep(2);
          setCompletedSteps([1]);
        }
      } catch (e) {
        if (!cancelled) setIsLoggedIn(false);
      }
    };
    checkAuth();
    return () => { cancelled = true; };
  }, []);

  // Fetch existing provider data if any
  const { data: existingProvider } = useQuery({
    queryKey: ['providerData', email],
    queryFn: async () => {
      if (!email) return null;
      const providers = await base44.entities.ProviderIntake.filter({ email });
      return providers[0] || null;
    },
    enabled: !!email && isLoggedIn,
  });

  useEffect(() => {
    if (existingProvider) {
      setProviderData(existingProvider);
      // Auto-advance based on status
      if (existingProvider.status === 'under_review') setCurrentStep(3);
      if (existingProvider.status === 'approved') setCurrentStep(4);
    }
  }, [existingProvider]);

  const basicInfoMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('submitProviderIntake', { ...data, email }),
    onSuccess: (response) => {
      setProviderData(response.data);
      setCompletedSteps([...completedSteps, 2]);
      setCurrentStep(3);
    },
  });

  const qualiphyMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('qualiphySendInvite', { email, name: providerData?.full_name || 'Provider' });
      return response.data;
    },
    onSuccess: (data) => {
      setQualiphyInviteUrl(data.invite_url);
      setQualiPhyStatus('invited');
      setCompletedSteps([...completedSteps, 3]);
    },
  });

  const handleLogin = async () => {
    if (!email) return;
    await base44.auth.redirectToLogin(window.location.href);
  };

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  // Step 1: Email Login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <Card className="border-none shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-medium text-[#2D3A2D] mb-2">Provider Portal</h1>
                <p className="text-[#5A6B5A]">Complete your onboarding journey</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2D3A2D] mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                    required
                  />
                </div>
                <Button className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white h-12">
                  Sign In with Email
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-medium text-[#2D3A2D]">Welcome, {email?.split('@')[0]}</h1>
            <p className="text-[#5A6B5A] mt-1">Complete your provider profile step by step</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-red-200 text-red-600 hover:bg-red-50">
            Sign Out
          </Button>
        </motion.div>

        {/* Journey Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {JOURNEY_STEPS.map((step) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isActive = currentStep === step.id;
              return (
                <motion.div key={step.id} className="flex flex-col items-center flex-1">
                  <motion.div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                      isCompleted ? 'bg-[#4A6741] text-white' :
                      isActive ? 'bg-[#4A6741] text-white ring-4 ring-[#4A6741]/20' :
                      'bg-white text-[#5A6B5A] border-2 border-[#E8E0D5]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </motion.div>
                  <div className="text-center">
                    <p className={`text-xs font-medium ${isActive ? 'text-[#4A6741]' : 'text-[#5A6B5A]'}`}>{step.title}</p>
                    <p className="text-xs text-gray-400">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <Progress value={(currentStep / JOURNEY_STEPS.length) * 100} className="h-2" />
        </div>

        {/* Content Card */}
        <Card className="border-none shadow-xl">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <ProviderBasicInfoForm
                    onSubmit={(data) => basicInfoMutation.mutate(data)}
                    isLoading={basicInfoMutation.isPending}
                    initialData={providerData}
                  />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <QualiPhyExamStep
                    email={email}
                    onStartExam={() => qualiphyMutation.mutate()}
                    isLoading={qualiphyMutation.isPending}
                    inviteUrl={qualiphyInviteUrl}
                    status={qualiPhyStatus}
                    onContinue={() => {
                      setCompletedSteps([...completedSteps, 3]);
                      setCurrentStep(4);
                    }}
                  />
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <LiveConsultationStep email={email} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E8E0D5]">
              {currentStep > 2 && (
                <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <div />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProviderBasicInfoForm({ onSubmit, isLoading, initialData }) {
  const [formData, setFormData] = React.useState(initialData || {
    full_name: '',
    title: 'MD',
    specialty: '',
    license_number: '',
    states_licensed: [],
    years_experience: '',
    practice_type: 'Telehealth',
    bio: '',
    education: '',
    certifications: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Complete Your Profile</h2>
        <p className="text-[#5A6B5A]">We'll auto-fill what we can from your login</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#2D3A2D] mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="Dr. Jane Smith"
            required
            className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2D3A2D] mb-2">Title *</label>
          <select
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
          >
            <option value="MD">MD</option>
            <option value="DO">DO</option>
            <option value="NP">NP</option>
            <option value="PA">PA</option>
            <option value="PharmD">PharmD</option>
            <option value="RN">RN</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2D3A2D] mb-2">Specialty *</label>
        <input
          type="text"
          value={formData.specialty}
          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
          placeholder="e.g., Family Medicine, Endocrinology"
          required
          className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2D3A2D] mb-2">Medical License Number *</label>
        <input
          type="text"
          value={formData.license_number}
          onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
          placeholder="License #"
          required
          className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#2D3A2D] mb-2">Years of Experience</label>
          <input
            type="number"
            value={formData.years_experience}
            onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
            placeholder="10"
            className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2D3A2D] mb-2">Practice Type</label>
          <select
            value={formData.practice_type}
            onChange={(e) => setFormData({ ...formData, practice_type: e.target.value })}
            className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
          >
            <option value="Telehealth">Telehealth Only</option>
            <option value="In-Person">In-Person Only</option>
            <option value="Both">Both</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2D3A2D] mb-2">Professional Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Tell patients about your approach and expertise..."
          className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] min-h-[120px]"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || !formData.full_name || !formData.specialty || !formData.license_number}
        className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white h-12"
      >
        {isLoading ? 'Saving...' : 'Continue to Exam'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </form>
  );
}

function QualiPhyExamStep({ email, onStartExam, isLoading, inviteUrl, status, onContinue }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Medical Qualification Exam</h2>
        <p className="text-[#5A6B5A]">Complete the Qualiphy.me medical exam to verify your qualifications</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">This exam is required to proceed</p>
          <p>It typically takes 15-30 minutes. You can complete it on your own schedule.</p>
        </div>
      </div>

      {!inviteUrl ? (
        <Button
          onClick={onStartExam}
          disabled={isLoading}
          className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white h-12"
        >
          {isLoading ? 'Sending Invite...' : 'Start Qualiphy Exam'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium mb-2">✅ Exam invite sent!</p>
            <p className="text-sm text-green-700 mb-4">Check {email} for the Qualiphy exam link</p>
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Open Exam
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="text-sm text-[#5A6B5A]">Once you complete the exam, click Continue below.</p>
          <Button
            onClick={onContinue}
            className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white h-12"
          >
            I've Completed the Exam
            <CheckCircle2 className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

function LiveConsultationStep({ email }) {
  const [consultationScheduled, setConsultationScheduled] = React.useState(false);

  const scheduleConsultation = useMutation({
    mutationFn: async () => {
      await base44.functions.invoke('scheduleProviderConsultation', { email });
      return true;
    },
    onSuccess: () => setConsultationScheduled(true),
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium text-[#2D3A2D] mb-2">Schedule Live Consultation</h2>
        <p className="text-[#5A6B5A]">Final step: Chat with our credentialing team</p>
      </div>

      <div className="bg-[#F5F0E8] rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#4A6741] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-[#2D3A2D]">Profile Completed</p>
            <p className="text-sm text-[#5A6B5A]">All your information has been saved</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#4A6741] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-[#2D3A2D]">Exam Submitted</p>
            <p className="text-sm text-[#5A6B5A]">Qualiphy qualification verified</p>
          </div>
        </div>
      </div>

      {!consultationScheduled ? (
        <>
          <p className="text-sm text-[#5A6B5A]">
            Our credentialing team will conduct a 20-30 minute video call to discuss your practice and answer any questions.
          </p>
          <Button
            onClick={() => scheduleConsultation.mutate()}
            disabled={scheduleConsultation.isPending}
            className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white h-12"
          >
            {scheduleConsultation.isPending ? 'Scheduling...' : 'Schedule Consultation Call'}
            <Video className="w-4 h-4 ml-2" />
          </Button>
        </>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium mb-2">✅ Consultation scheduled!</p>
          <p className="text-sm text-green-700">Check your email for the meeting link and time.</p>
          <div className="mt-4">
            <p className="text-sm font-medium text-[#2D3A2D] mb-2">What to expect:</p>
            <ul className="text-sm text-[#5A6B5A] space-y-1">
              <li>• Review of your credentials and experience</li>
              <li>• Discussion of MedRevolve platform and processes</li>
              <li>• Q&A about provider requirements and compensation</li>
              <li>• Next steps upon approval</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}