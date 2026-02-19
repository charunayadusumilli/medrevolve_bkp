import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import RequireAuth from '@/components/auth/RequireAuth';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  CheckCircle2, AlertCircle, Loader2, ChevronRight, ChevronLeft,
  Pill, Calendar, Heart, Activity, ClipboardList, Shield
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 'taking_medication',
    section: 'Medication Compliance',
    icon: Pill,
    question: 'Are you still taking your medication as prescribed?',
    type: 'radio',
    options: ['Yes, consistently', 'Yes, but missed some doses', 'No, I stopped']
  },
  {
    id: 'side_effects',
    section: 'Side Effects',
    icon: Activity,
    question: 'Have you experienced any side effects this month?',
    type: 'radio',
    options: ['No side effects', 'Mild side effects (manageable)', 'Moderate side effects', 'Severe side effects']
  },
  {
    id: 'severe_side_effects',
    section: 'Side Effects',
    icon: AlertCircle,
    question: 'Did any side effects require you to seek medical attention?',
    type: 'radio',
    options: ['No', 'Yes'],
    flag_on: ['Yes']
  },
  {
    id: 'adverse_events',
    section: 'Adverse Events',
    icon: Shield,
    question: 'Have you experienced any serious adverse events (e.g., allergic reaction, chest pain, severe nausea)?',
    type: 'radio',
    options: ['No', 'Yes — please describe below'],
    flag_on: ['Yes — please describe below']
  },
  {
    id: 'hospitalized',
    section: 'Medical History',
    icon: Heart,
    question: 'Have you been hospitalized or had any emergency medical care in the past 30 days?',
    type: 'radio',
    options: ['No', 'Yes'],
    flag_on: ['Yes']
  },
  {
    id: 'weight_change',
    section: 'Progress',
    icon: Activity,
    question: 'How would you describe your weight change this month?',
    type: 'radio',
    options: ['Lost weight (on track)', 'Weight stable', 'Gained weight', 'Unsure / not tracking']
  },
  {
    id: 'new_medications',
    section: 'Medical History',
    icon: Pill,
    question: 'Have you started any new medications or supplements since your last check-in?',
    type: 'radio',
    options: ['No changes', 'Yes — please list below']
  },
  {
    id: 'pregnancy',
    section: 'Safety',
    icon: Shield,
    question: 'For female patients: Are you pregnant, planning to become pregnant, or currently breastfeeding?',
    type: 'radio',
    options: ['Not applicable', 'No', 'Yes'],
    flag_on: ['Yes']
  },
  {
    id: 'continue_treatment',
    section: 'Treatment',
    icon: ClipboardList,
    question: 'Do you wish to continue your treatment for next month?',
    type: 'radio',
    options: ['Yes, continue', 'No, I want to pause', 'No, I want to cancel'],
    stop_on: ['No, I want to pause', 'No, I want to cancel']
  },
  {
    id: 'additional_notes',
    section: 'Additional Notes',
    icon: ClipboardList,
    question: 'Any additional comments, concerns, or questions for your provider?',
    type: 'textarea',
    placeholder: "Optional — share anything you'd like your provider to know..."
  }
];

const SECTIONS = [...new Set(QUESTIONS.map(q => q.section))];

export default function AutoRxFollowup() {
  const urlParams = new URLSearchParams(window.location.search);
  const planId = urlParams.get('plan_id');

  const [currentQ, setCurrentQ] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: plan, isLoading: planLoading, error: planError } = useQuery({
    queryKey: ['autoRxPlan', planId],
    queryFn: () => base44.entities.AutoRxPlan.filter({ id: planId }, '-created_date', 1).then(r => r[0]),
    enabled: !!planId && !!user
  });

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const res = await base44.functions.invoke('submitAutoRxFollowup', data);
      return res.data;
    },
    onSuccess: (data) => {
      setSubmitResult(data);
      setSubmitted(true);
    }
  });

  const currentQuestion = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;
  const currentSection = currentQuestion?.section;

  const handleAnswer = (value) => {
    setResponses(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ(prev => prev - 1);
  };

  const handleSubmit = () => {
    submitMutation.mutate({ plan_id: planId, responses });
  };

  const canProceed = currentQuestion?.type === 'textarea' || !!responses[currentQuestion?.id];
  const isLast = currentQ === QUESTIONS.length - 1;

  if (!planId) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#2D3A2D] mb-2">Invalid Link</h2>
          <p className="text-[#5A6B5A] mb-6">This check-in link is invalid or has expired. Please use the link from your reminder email.</p>
          <Link to={createPageUrl('PatientPortal')}>
            <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full">Go to Patient Portal</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <RequireAuth portalName="AutoRx Check-In">
      <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F0EDE6]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A6741] to-[#3D5636] text-white py-8 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Pill className="w-6 h-6 text-white/80" />
              <span className="text-white/70 text-sm font-medium uppercase tracking-wider">AutoRx Monthly Check-In</span>
            </div>
            {plan && (
              <div>
                <h1 className="text-2xl font-semibold">{plan.medication_name}</h1>
                <p className="text-white/70 text-sm mt-1">Month {plan.current_month} of {plan.total_months} · Due {plan.next_followup_due}</p>
              </div>
            )}
            {planLoading && <p className="text-white/70">Loading your plan...</p>}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* Progress bar */}
          {!submitted && (
            <div className="mb-8">
              <div className="flex justify-between text-xs text-[#5A6B5A] mb-2">
                <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
                <span className="font-medium text-[#4A6741]">{currentSection}</span>
              </div>
              <div className="w-full h-2 bg-[#E8E0D5] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {submitted ? (
              <SuccessScreen key="success" result={submitResult} plan={plan} />
            ) : planLoading ? (
              <div key="loading" className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#4A6741]" />
              </div>
            ) : planError || (!planLoading && !plan) ? (
              <div key="error" className="text-center py-20">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-[#2D3A2D] mb-2">Plan Not Found</h2>
                <p className="text-[#5A6B5A]">We couldn't find this AutoRx plan. Please use the link from your reminder email or contact support.</p>
              </div>
            ) : (
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
              >
                <QuestionCard
                  question={currentQuestion}
                  value={responses[currentQuestion.id]}
                  onChange={handleAnswer}
                />

                {/* Navigation */}
                <div className="flex gap-3 mt-8">
                  {currentQ > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 rounded-full border-[#4A6741] text-[#4A6741]"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                  )}

                  {isLast ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] text-white rounded-full font-semibold py-6"
                    >
                      {submitMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                      ) : (
                        <>Submit Check-In <CheckCircle2 className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed}
                      className="flex-1 bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full py-6"
                    >
                      Continue <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>

                {submitMutation.isError && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {submitMutation.error?.message || 'Something went wrong. Please try again.'}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </RequireAuth>
  );
}

function QuestionCard({ question, value, onChange }) {
  const Icon = question.icon;
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E0D5]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#4A6741]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#4A6741]" />
        </div>
        <Badge variant="outline" className="text-xs text-[#5A6B5A] border-[#C8C0B5]">{question.section}</Badge>
      </div>

      <h2 className="text-xl font-semibold text-[#2D3A2D] mb-6 leading-snug">{question.question}</h2>

      {question.type === 'radio' && (
        <div className="space-y-3">
          {question.options.map((option) => {
            const isFlag = question.flag_on?.includes(option);
            const selected = value === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChange(option)}
                className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-150 ${
                  selected
                    ? isFlag
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-[#4A6741] bg-[#4A6741]/5 text-[#2D3A2D]'
                    : 'border-[#E8E0D5] hover:border-[#4A6741]/30 text-[#2D3A2D]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    selected
                      ? isFlag ? 'border-amber-500 bg-amber-500' : 'border-[#4A6741] bg-[#4A6741]'
                      : 'border-[#C8C0B5]'
                  }`}>
                    {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="font-medium text-sm">{option}</span>
                  {isFlag && selected && <AlertCircle className="w-4 h-4 text-amber-500 ml-auto" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {question.type === 'textarea' && (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="w-full border-2 border-[#E8E0D5] rounded-2xl p-4 text-sm text-[#2D3A2D] placeholder-[#9A8B7A] focus:outline-none focus:border-[#4A6741] resize-none h-32 transition-colors"
        />
      )}
    </div>
  );
}

function SuccessScreen({ result, plan }) {
  const isPaused = result?.action === 'paused_for_review';
  const isCompleted = result?.action === 'plan_completed';
  const isPending = result?.action === 'received_pending_retry';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
          isPaused ? 'bg-amber-100' : 'bg-gradient-to-br from-[#4A6741] to-[#6B8F5E]'
        }`}
      >
        {isPaused
          ? <AlertCircle className="w-12 h-12 text-amber-600" />
          : <CheckCircle2 className="w-12 h-12 text-white" />
        }
      </motion.div>

      <h2 className="text-3xl font-bold text-[#2D3A2D] mb-3">
        {isPaused ? 'Under Review' : isCompleted ? 'Plan Complete! 🎉' : 'Check-In Complete!'}
      </h2>

      <p className="text-[#5A6B5A] text-base max-w-sm mx-auto mb-8">{result?.message}</p>

      {!isPaused && !isCompleted && plan && (
        <div className="bg-[#F5F0E8] rounded-2xl p-5 text-left mb-8 max-w-sm mx-auto">
          <div className="flex items-center gap-3">
            <Pill className="w-5 h-5 text-[#4A6741]" />
            <div>
              <p className="font-semibold text-[#2D3A2D] text-sm">{plan.medication_name}</p>
              <p className="text-xs text-[#5A6B5A]">Month {plan.current_month} renewed</p>
            </div>
          </div>
          {result?.next_followup_due && (
            <div className="flex items-center gap-3 mt-3">
              <Calendar className="w-5 h-5 text-[#4A6741]" />
              <div>
                <p className="font-semibold text-[#2D3A2D] text-sm">Next Check-In</p>
                <p className="text-xs text-[#5A6B5A]">{result.next_followup_due}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <Link to={createPageUrl('PatientPortal')}>
        <Button className="bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full px-8">
          Go to Patient Portal
        </Button>
      </Link>
    </motion.div>
  );
}