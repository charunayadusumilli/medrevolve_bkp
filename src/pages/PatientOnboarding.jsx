import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { createPageUrl } from '@/utils';
import { ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import WelcomeStep from '@/components/onboarding/WelcomeStep.jsx';
import ProfileStep from '@/components/onboarding/ProfileStep.jsx';
import DocumentUploadStep from '@/components/onboarding/DocumentUploadStep.jsx';
import TutorialStep from '@/components/onboarding/TutorialStep.jsx';
import CompletionStep from '@/components/onboarding/CompletionStep.jsx';

export default function PatientOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    full_name: '',
    date_of_birth: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });
  const [documents, setDocuments] = useState({
    id_document: null,
    insurance_card: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [emailLocked, setEmailLocked] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
          if (currentUser.full_name) {
            setProfileData(prev => ({ ...prev, full_name: currentUser.full_name }));
          }
        }
      } catch (error) {
        console.error('Failed to get user:', error);
      }
    };
    checkUser();
  }, []);

  const steps = [
    { title: 'Welcome', description: 'Get started with your account' },
    { title: 'Profile', description: 'Complete your profile' },
    { title: 'Documents', description: 'Upload required documents' },
    { title: 'Learn', description: 'Learn how to use MedRevolve' },
    { title: 'Done', description: 'Ready to go!' }
  ];

  const validateStep = () => {
    setValidationError('');

    if (currentStep === 1) {
      // Profile step validation
      const required = ['full_name', 'email', 'date_of_birth', 'phone', 'address', 'city', 'state', 'zip_code'];
      for (const field of required) {
        if (!profileData[field] || !profileData[field].toString().trim()) {
          setValidationError(`Please fill in all required fields before continuing.`);
          return false;
        }
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        setValidationError('Please enter a valid email address.');
        return false;
      }
      const phone = profileData.phone.replace(/\D/g, '');
      if (phone.length < 10) {
        setValidationError('Please enter a valid phone number.');
        return false;
      }
    }

    if (currentStep === 2) {
      // Document upload validation
      if (!documents.id_document) {
        setValidationError('Please upload your Government ID before continuing.');
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (currentStep === steps.length - 1) {
      // Final step - redirect to portal
      window.location.href = createPageUrl('PatientPortal');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setValidationError('');
    setCurrentStep(prev => (prev > 0 ? prev - 1 : 0));
  };

  const handleProfileUpdate = (data) => {
    setProfileData(data);
  };

  const handleDocumentsUpdate = (docs) => {
    setDocuments(docs);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save onboarding data
      if (user?.email) {
        await base44.entities.PatientIntake.create({
          email: user.email,
          answers_json: JSON.stringify({
            profile: profileData,
            documents: documents,
            completed_at: new Date().toISOString()
          })
        });

        // Send welcome email to patient + admin notification
        try {
          await base44.functions.invoke('notifyOnboardingComplete', {
            email: user.email,
            full_name: profileData.full_name || user.full_name || user.email,
            phone: profileData.phone || '',
            state: profileData.state || ''
          });
        } catch (emailError) {
          console.error('Onboarding notification failed:', emailError);
        }
      }
      handleNext();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A6741] to-[#3D5636] text-white py-8 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-light mb-2">Welcome to MedRevolve</h1>
          <p className="text-white/80">Let's get you set up in just a few steps</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-[#2D3A2D]">{steps[currentStep].title}</h2>
            <span className="text-sm text-[#5A6B5A]">Step {currentStep + 1} of {steps.length}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 mb-12 overflow-x-auto pb-2">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => idx <= currentStep && setCurrentStep(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                idx === currentStep
                  ? 'bg-[#4A6741] text-white'
                  : idx < currentStep
                  ? 'bg-[#D4E5D7] text-[#4A6741]'
                  : 'bg-white text-[#5A6B5A] border border-[#E8E0D5]'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                idx < currentStep ? 'bg-[#4A6741] text-white' : ''
              }`}>
                {idx < currentStep ? '✓' : idx + 1}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && <WelcomeStep />}
            {currentStep === 1 && (
              <ProfileStep
                data={profileData}
                onUpdate={handleProfileUpdate}
              />
            )}
            {currentStep === 2 && (
              <DocumentUploadStep
                data={documents}
                onUpdate={handleDocumentsUpdate}
              />
            )}
            {currentStep === 3 && <TutorialStep />}
            {currentStep === 4 && <CompletionStep />}
          </motion.div>
        </AnimatePresence>

        {/* Validation Error */}
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {validationError}
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="rounded-full"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={currentStep === 4 ? handleComplete : handleNext}
            disabled={isLoading}
            className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full"
          >
            {isLoading ? 'Saving...' : currentStep === 4 ? 'Go to Portal' : 'Continue'}
            {!isLoading && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}