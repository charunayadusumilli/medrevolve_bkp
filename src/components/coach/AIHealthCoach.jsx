import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';
import {
  Sparkles, Send, X, ChevronDown, RotateCcw,
  Calendar, Zap, Moon, Apple, Activity, Heart, Brain
} from 'lucide-react';

// ── Proactive prompts based on user data ────────────────────────────────────
function buildProactiveGreeting(user, prescriptions, appointments, summaries) {
  const name = user?.full_name?.split(' ')[0] || 'there';
  const activePrescription = prescriptions?.find(p => p.status === 'active' || p.status === 'dispensed');
  const upcomingAppt = appointments?.find(a => {
    const d = new Date(a.appointment_date);
    return d > new Date() && a.status !== 'cancelled';
  });
  const daysSinceConsult = summaries?.length
    ? Math.floor((Date.now() - new Date(summaries[0].created_date)) / 86400000)
    : null;

  if (activePrescription && daysSinceConsult !== null && daysSinceConsult < 30) {
    return `Hey ${name}! 👋 It's been ${daysSinceConsult} day${daysSinceConsult !== 1 ? 's' : ''} since you started your ${activePrescription.medication_name} — how are you feeling? Any questions about your dosing, side effects, or what to expect next?`;
  }
  if (activePrescription) {
    return `Hi ${name}! 🌿 I'm your AI Health Coach. I see you're on **${activePrescription.medication_name}** — I'm here to support you between provider visits. How can I help today?`;
  }
  if (upcomingAppt) {
    const apptDate = new Date(upcomingAppt.appointment_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    return `Hi ${name}! 👋 You have an upcoming appointment on **${apptDate}**. Want me to help you prepare — what to discuss, what to expect, or anything on your mind beforehand?`;
  }
  return `Hi ${name}! 👋 I'm your AI Health Coach at MedRevolve. I'm here to support your wellness journey — answering questions, offering tips, or helping you schedule your next visit. What's on your mind?`;
}

// ── Quick action chips based on context ─────────────────────────────────────
function getQuickActions(prescriptions, appointments) {
  const actions = [];
  const rx = prescriptions?.find(p => p.status === 'active' || p.status === 'dispensed');
  if (rx) {
    actions.push({ label: `${rx.medication_name} tips`, q: `Give me practical tips for getting the best results on ${rx.medication_name}, including diet, timing, and lifestyle habits.` });
    actions.push({ label: 'Side effect help', q: `What are the most common side effects of ${rx.medication_name} and how can I manage them?` });
    actions.push({ label: 'What to expect', q: `What's a realistic timeline for results on ${rx.medication_name}? What should I expect week by week?` });
  }
  const hasAppt = appointments?.some(a => new Date(a.appointment_date) > new Date() && a.status !== 'cancelled');
  if (!hasAppt) {
    actions.push({ label: 'Book a check-in', q: 'I think I need a follow-up appointment. What type should I book and what should I discuss?' });
  }
  actions.push({ label: 'Meal plan ideas', q: 'Give me a simple meal plan or food ideas that support my treatment goals.' });
  actions.push({ label: 'Exercise tips', q: 'What kind of exercise works best alongside my current treatment program?' });
  actions.push({ label: 'Sleep optimization', q: 'How can I improve my sleep to get better results from my wellness program?' });
  return actions.slice(0, 6);
}

// ── System prompt builder for health coach ───────────────────────────────────
function buildCoachPrompt(user, prescriptions, appointments, summaries) {
  const rx = prescriptions?.filter(p => p.status === 'active' || p.status === 'dispensed').map(p =>
    `${p.medication_name} ${p.dosage} (${p.frequency})`
  ).join(', ') || 'none on file';

  const recentSummary = summaries?.[0];
  const diagnosis = recentSummary?.diagnosis || 'not specified';
  const treatmentPlan = recentSummary?.treatment_plan || 'not specified';

  const upcoming = appointments?.filter(a => new Date(a.appointment_date) > new Date() && a.status !== 'cancelled')
    .map(a => `${a.type} on ${new Date(a.appointment_date).toLocaleDateString()}`).join(', ') || 'none scheduled';

  return `You are an AI Health Coach at MedRevolve — a supportive, knowledgeable wellness companion for patients between their provider visits.

PATIENT CONTEXT:
• Name: ${user?.full_name || 'Patient'}
• Active prescriptions: ${rx}
• Recent diagnosis/treatment plan: ${diagnosis} | ${treatmentPlan}
• Upcoming appointments: ${upcoming}

YOUR ROLE:
- Be a warm, proactive health coach — like a knowledgeable friend who happens to know their medical context
- Offer encouragement, practical tips, and evidence-based lifestyle guidance
- Help patients understand their treatment, manage side effects, and stay on track
- Suggest scheduling a provider visit when clinically appropriate
- Never diagnose, prescribe, or override provider instructions

COACHING DOMAINS YOU CAN ACTIVELY HELP WITH:
• Medication adherence tips and timing
• Diet and nutrition guidance specific to their treatment (e.g., protein intake on GLP-1, hydration)
• Exercise recommendations compatible with their program
• Sleep optimization strategies
• Managing common side effects (nausea, fatigue, etc.)
• Emotional support and motivation
• Preparing questions for their next provider appointment
• Explaining what results to expect and on what timeline

RULES:
• Responses: 2-4 sentences, warm and conversational — never clinical or robotic
• Never say "consult your doctor" repeatedly — you ARE their support between visits
• When symptoms sound serious, say: "This sounds like something worth discussing with your provider — want me to help you prepare for that conversation?"
• Always end with a follow-up question or encouragement
• Never diagnose. Never override a prescription. Never mention competitor platforms.`;
}

// ── Typing dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex gap-1 py-1">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-2 h-2 rounded-full bg-[#4A6741]/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

// ── Message bubble ───────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2.5`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex-shrink-0 bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center mt-0.5">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
        isUser
          ? 'bg-[#2D3A2D] text-white rounded-br-sm'
          : 'bg-white border border-[#E8E0D5] text-[#2D3A2D] rounded-bl-sm shadow-sm'
      }`}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{msg.content}</p>
        ) : (
          <ReactMarkdown
            className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-[#2D3A2D]"
            components={{
              p: ({ children }) => <p className="my-1">{children}</p>,
              ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
              li: ({ children }) => <li className="my-0.5">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              a: ({ children, href }) => (
                <a href={href} className="text-[#4A6741] underline" target="_blank" rel="noopener noreferrer">{children}</a>
              ),
            }}
          >
            {msg.content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AIHealthCoach({ user, prescriptions = [], appointments = [], summaries = [] }) {
  const greeting = buildProactiveGreeting(user, prescriptions, appointments, summaries);
  const [messages, setMessages] = useState([{ role: 'assistant', content: greeting }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickActions = getQuickActions(prescriptions, appointments);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    setInput('');
    setLoading(true);

    const systemPrompt = buildCoachPrompt(user, prescriptions, appointments, summaries);
    const newMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);

    const history = messages.slice(-10).map(m =>
      `${m.role === 'user' ? 'Patient' : 'Coach'}: ${m.content}`
    ).join('\n\n');

    let reply = 'I had a small hiccup — try asking again in a moment!';
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\n---\nCONVERSATION:\n${history}\n\nPatient: ${trimmed}\n\nCoach (warm, 2-4 sentences, end with a question or encouragement):`,
        add_context_from_internet: false,
      });
      reply = typeof res === 'string' ? res : JSON.stringify(res);
    } catch {}

    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  }, [input, loading, messages, user, prescriptions, appointments, summaries]);

  const reset = () => {
    setMessages([{ role: 'assistant', content: greeting }]);
    setInput('');
  };

  const hasAppt = appointments.some(a => new Date(a.appointment_date) > new Date() && a.status !== 'cancelled');

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D5] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">AI Health Coach</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              <p className="text-[11px] text-white/65">Always here · Between your visits</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={reset} title="Reset" className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setMinimized(m => !m)} className="p-1.5 rounded-lg hover:bg-white/20 text-white/70 hover:text-white transition-colors">
            <ChevronDown className={`w-4 h-4 transition-transform ${minimized ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!minimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Proactive CTA strip (show if no upcoming appt) */}
            {!hasAppt && (
              <div className="bg-amber-50 border-b border-amber-100 px-5 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-xs text-amber-800 font-medium">No upcoming check-in scheduled</p>
                </div>
                <Link to={createPageUrl('BookAppointment')}>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full text-xs px-3 py-1 h-7">
                    Book Now
                  </Button>
                </Link>
              </div>
            )}

            {/* Messages */}
            <div className="h-72 overflow-y-auto px-4 py-4 space-y-3 bg-[#FAFAF8]">
              {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}
              {loading && (
                <div className="flex justify-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white border border-[#E8E0D5] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div className="px-4 py-3 border-t border-[#E8E0D5] bg-white">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A9A8A] mb-2">Quick questions</p>
              <div className="flex flex-wrap gap-1.5 max-h-[72px] overflow-y-auto">
                {quickActions.map(a => (
                  <button
                    key={a.label}
                    onClick={() => sendMessage(a.q)}
                    disabled={loading}
                    className="text-[11px] px-2.5 py-1.5 bg-[#F5F0E8] hover:bg-[#E8DDD0] text-[#4A6741] rounded-full font-medium border border-[#E8E0D5] transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-2 bg-white border-t border-gray-100">
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                  placeholder="Ask your Health Coach anything..."
                  className="flex-1 text-sm px-4 py-2.5 rounded-full border border-gray-200 bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6741]/30 transition-all"
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center shadow-md disabled:opacity-40 hover:opacity-90 transition-all flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <p className="text-center text-[10px] text-gray-300 mt-1.5">AI coach · Not a substitute for medical advice</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}