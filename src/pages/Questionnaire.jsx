import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import RequireAuthGate from '@/components/auth/RequireAuthGate';
import { 
  ArrowRight, ArrowLeft, Check, User, Heart, Scale, 
  Pill, FileText, Leaf
} from 'lucide-react';

const questions = [
  {
    id: 'goal',
    type: 'radio',
    title: 'What is your primary wellness goal?',
    icon: Scale,
    options: [
      { value: 'weight-loss', label: 'Weight Loss', description: 'Sustainable weight management' },
      { value: 'longevity', label: 'Longevity & Vitality', description: 'Anti-aging and energy' },
      { value: 'hormone', label: 'Hormone Balance', description: 'Optimize hormone levels' },
      { value: 'general', label: 'General Wellness', description: 'Overall health improvement' }
    ]
  },
  {
    id: 'gender',
    type: 'radio',
    title: 'What is your biological sex?',
    icon: User,
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ]
  },
  {
    id: 'age',
    type: 'input',
    title: 'What is your age?',
    icon: User,
    inputType: 'number',
    placeholder: 'Enter your age'
  },
  {
    id: 'conditions',
    type: 'checkbox',
    title: 'Do you have any of the following conditions?',
    icon: Heart,
    options: [
      { value: 'diabetes', label: 'Diabetes' },
      { value: 'heart-disease', label: 'Heart Disease' },
      { value: 'thyroid', label: 'Thyroid Disorder' },
      { value: 'kidney', label: 'Kidney Disease' },
      { value: 'liver', label: 'Liver Disease' },
      { value: 'none', label: 'None of the above' }
    ]
  },
  {
    id: 'medications',
    type: 'radio',
    title: 'Are you currently taking any medications?',
    icon: Pill,
    options: [
      { value: 'yes', label: 'Yes', description: 'Our medical team will review' },
      { value: 'no', label: 'No' }
    ]
  },
  {
    id: 'experience',
    type: 'radio',
    title: 'Have you used weight loss or wellness medications before?',
    icon: FileText,
    options: [
      { value: 'yes', label: 'Yes, I have experience' },
      { value: 'no', label: 'No, this is my first time' }
    ]
  }
];

export default function Questionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit questionnaire
      try {
        await base44.functions.invoke('submitQuestionnaire', { answers });
      } catch (error) {
        console.error('Failed to submit questionnaire:', error);
      }
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const isAnswered = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'checkbox') {
      return answer && answer.length > 0;
    }
    return answer !== undefined && answer !== '';
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-[#D4E5D7] flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-[#4A6741]" />
          </div>
          <h1 className="text-3xl font-medium text-[#2D3A2D] mb-4">
            Thank You!
          </h1>
          <p className="text-lg text-[#5A6B5A] mb-8">
            Your health questionnaire has been submitted. A licensed medical provider will review your information and reach out within 24-48 hours.
          </p>
          <Link to={createPageUrl('Home')}>
            <Button 
              size="lg"
              className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-8 py-6"
            >
              Return Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const Icon = currentQuestion.icon;

  return (
    <RequireAuthGate>
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-lg border-b border-[#E8E0D5]">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#5A6B5A]">
              Step {currentStep + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-[#4A6741]">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-[#E8E0D5]" />
        </div>
      </div>

      {/* Question */}
      <div className="pt-40 pb-32 px-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#4A6741]/10 flex items-center justify-center mb-6">
                <Icon className="w-7 h-7 text-[#4A6741]" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-medium text-[#2D3A2D] mb-8">
                {currentQuestion.title}
              </h2>

              {/* Input Type */}
              {currentQuestion.type === 'input' && (
                <Input
                  type={currentQuestion.inputType}
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => updateAnswer(e.target.value)}
                  className="text-lg py-6 rounded-xl border-[#E8E0D5]"
                />
              )}

              {/* Radio Type */}
              {currentQuestion.type === 'radio' && (
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onValueChange={updateAnswer}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={option.value}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        answers[currentQuestion.id] === option.value
                          ? 'border-[#4A6741] bg-[#4A6741]/5'
                          : 'border-[#E8E0D5] hover:border-[#4A6741]/30'
                      }`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <div>
                        <span className="font-medium text-[#2D3A2D]">{option.label}</span>
                        {option.description && (
                          <p className="text-sm text-[#5A6B5A] mt-0.5">{option.description}</p>
                        )}
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              )}

              {/* Checkbox Type */}
              {currentQuestion.type === 'checkbox' && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isChecked = (answers[currentQuestion.id] || []).includes(option.value);
                    return (
                      <Label
                        key={option.value}
                        htmlFor={option.value}
                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'border-[#4A6741] bg-[#4A6741]/5'
                            : 'border-[#E8E0D5] hover:border-[#4A6741]/30'
                        }`}
                      >
                        <Checkbox
                          id={option.value}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const current = answers[currentQuestion.id] || [];
                            if (checked) {
                              if (option.value === 'none') {
                                updateAnswer(['none']);
                              } else {
                                updateAnswer([...current.filter(v => v !== 'none'), option.value]);
                              }
                            } else {
                              updateAnswer(current.filter(v => v !== option.value));
                            }
                          }}
                        />
                        <span className="font-medium text-[#2D3A2D]">{option.label}</span>
                      </Label>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E0D5] py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-[#5A6B5A]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isAnswered()}
            className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-8"
          >
            {currentStep === questions.length - 1 ? 'Submit' : 'Continue'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
    </RequireAuthGate>
  );
}