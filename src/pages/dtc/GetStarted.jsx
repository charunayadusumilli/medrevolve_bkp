import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProduct } from '@/data/dtcProducts';
import { addToCart } from '@/lib/cartStore';
import { getGoal, toCartItem } from '@/components/dtc/v2/brand';
import FlowProgress from '@/components/dtc/v2/flow/FlowProgress';
import StepGoal from '@/components/dtc/v2/flow/StepGoal';
import StepQuestions from '@/components/dtc/v2/flow/StepQuestions';
import StepPlan from '@/components/dtc/v2/flow/StepPlan';
import StepEssentials from '@/components/dtc/v2/flow/StepEssentials';

export default function GetStarted() {
  const initialGoal = getGoal(new URLSearchParams(window.location.search).get('goal'));
  const navigate = useNavigate();
  const [goalId, setGoalId] = useState(initialGoal?.id || null);
  const [step, setStep] = useState(initialGoal ? 1 : 0);
  const [answers, setAnswers] = useState({});
  const [productId, setProductId] = useState(null);
  const [essentials, setEssentials] = useState([]);

  const go = (s) => { setStep(s); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goal = getGoal(goalId);

  const finish = () => {
    [productId, ...essentials].forEach((id) => addToCart(toCartItem(getProduct(id))));
    navigate('/dtc-cart');
  };

  const toggle = (id) => setEssentials((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  return (
    <div className="bg-dtc-page min-h-screen py-10 sm:py-14 px-5 font-body">
      <FlowProgress step={step} onBack={() => go(step - 1)} />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
          {step === 0 && <StepGoal onSelect={(id) => { setGoalId(id); setProductId(null); go(1); }} />}
          {step === 1 && <StepQuestions answers={answers} setAnswers={setAnswers} onNext={() => go(2)} />}
          {step === 2 && goal && <StepPlan goal={goal} selectedId={productId} onSelect={setProductId} onNext={() => go(3)} />}
          {step === 3 && <StepEssentials picked={essentials} toggle={toggle} onFinish={finish} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}