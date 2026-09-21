import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Sparkles, X, Send, Phone, ArrowRight, MessageCircle, AlertCircle, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';

const PHONE = '(240) 387-5224';
const PHONE_TEL = 'tel:+12403875224';
const WHATSAPP_URL = 'https://wa.me/12403875224';

const ROUTE_CTA = {
  patient: { label: 'Start your intake', to: '/CustomerIntake', blurb: 'Begin your clinician-reviewed intake' },
  operator: { label: 'Apply for white-label', to: '/ForBusiness', blurb: 'Build your telehealth platform' },
  affiliate: { label: 'Visit medrevolveruo.com', to: null, href: 'https://medrevolveruo.com', blurb: 'Explore affiliate & merchant programs' },
};

const SUGGESTED = [
  'What is peptide therapy?',
  'How much does the white-label platform cost?',
  'Do I qualify for GLP-1?',
  'How fast can I launch my telehealth business?',
];

function RouteCTACard({ route }) {
  const cta = ROUTE_CTA[route];
  if (!cta) return null;
  const inner = (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1">
        <p className="text-[11px] font-bold text-white">{cta.label}</p>
        <p className="text-[9px] text-white/60">{cta.blurb}</p>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-white flex-shrink-0" />
    </div>
  );
  return (
    <div className="rounded-xl p-2.5 bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] shadow-sm">
      {cta.to ? <Link to={cta.to} className="block">{inner}</Link> : <a href={cta.href} target="_blank" rel="noopener noreferrer" className="block">{inner}</a>}
    </div>
  );
}

function EscalationCard({ onCapture }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async () => {
    if (!email && !phone) return;
    try {
      await base44.entities.ContactRequest.create({
        name: 'Answer Engine Lead',
        email: email || 'not_provided@unknown.com',
        phone: phone || '',
        source: 'website_form',
        status: 'new',
        subject: 'Answer Engine escalation — could not auto-answer',
        message: `Visitor asked a question the AI could not confidently answer. Email: ${email || 'N/A'}, Phone: ${phone || 'N/A'}`,
      });
    } catch {}
    setSaved(true);
    onCapture?.(email, phone);
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 space-y-2.5">
      <div className="flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
        <p className="text-[11px] font-semibold text-amber-800">Let a specialist answer this personally</p>
      </div>
      {!show ? (
        <button onClick={() => setShow(true)} className="text-[11px] text-amber-700 underline font-medium">
          Leave my contact info →
        </button>
      ) : saved ? (
        <p className="text-[11px] text-emerald-700 font-medium">✓ Got it — a specialist will reach out shortly.</p>
      ) : (
        <div className="space-y-1.5">
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="h-8 text-xs rounded-lg" />
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" className="h-8 text-xs rounded-lg" />
          <button onClick={submit} className="w-full bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold rounded-lg py-1.5 transition-colors">
            Send to specialist
          </button>
        </div>
      )}
      <div className="flex gap-1.5 pt-1">
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 bg-[#25D366] hover:opacity-90 text-white text-[10px] font-semibold rounded-lg py-1.5 transition-opacity">
          <MessageCircle className="w-3 h-3" /> WhatsApp
        </a>
        <a href={PHONE_TEL} className="flex-1 flex items-center justify-center gap-1 bg-[#0A0A0A] hover:opacity-90 text-white text-[10px] font-semibold rounded-lg py-1.5 transition-opacity">
          <Phone className="w-3 h-3" /> {PHONE}
        </a>
      </div>
    </div>
  );
}

export default function AnswerEngine() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [kb, setKb] = useState([]);
  const [route, setRoute] = useState(null);
  const [showEscalation, setShowEscalation] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const kbRef = useRef([]);

  // Load KB once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const records = await base44.entities.AnswerKB.list('-created_date', 200);
        if (cancelled) return;
        const active = (records || []).filter(r => r.status !== 'archived');
        kbRef.current = active;
        setKb(active);
      } catch (e) {
        console.warn('AnswerKB load failed', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (messages.length === 0 && kb.length > 0) {
      setMessages([{ role: 'assistant', content: "Hi! I'm the MedRevolve Answer Engine. Ask me anything about peptide therapy, GLP-1, hormones, NAD+, white-label telehealth, pricing, or compliance — I'll answer instantly and point you to the right next step." }]);
    }
  }, [kb.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 250);
  }, [isOpen]);

  const buildGrounding = useCallback(() => {
    if (kbRef.current.length === 0) return '';
    return kbRef.current.map((r, i) =>
      `[${i + 1}] CATEGORY: ${r.category} | AUDIENCE: ${r.audience_route}\nQ: ${r.question}\nA: ${r.answer}`
    ).join('\n\n');
  }, []);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    setInput('');
    setLoading(true);
    setShowEscalation(false);
    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);

    const grounding = buildGrounding();
    const systemPrompt = `You are the MedRevolve Answer Engine — an AI that instantly answers visitor questions about telehealth services and routes them to the right funnel.

KNOWLEDGE BASE (use these answers as your grounding — quote them faithfully, do not contradict them):
${grounding}

COMPLIANCE GUARDRAILS (absolute rules):
- NEVER diagnose a medical condition.
- NEVER give dosing guidance or specific dosages.
- NEVER promise outcomes or guarantee results.
- ALWAYS defer to licensed clinician review for anything clinical.
- Do NOT name specific drug/product brands beyond service categories (e.g. say "GLP-1 therapy", "peptide therapy", "hormone optimization" — not brand names).
- Use "clinician-guided" language. Treatments are "clinician-guided" and "clinician-supervised."

ROUTING (end EVERY answer with exactly ONE routing CTA based on the visitor's intent):
- Patient questions (peptides, GLP-1, hormones, NAD+, personal health) → route to "patient". End with: "Ready to take the next step? Start your intake — a licensed clinician will review your case."
- Operator/business questions (white-label, pricing, launch, compliance, platform) → route to "operator". End with: "Want to see how it works? Apply for white-label or call (240) 387-5224."
- Affiliate/merchant questions → route to "affiliate". End with: "Explore our affiliate and merchant programs at medrevolveruo.com."

CONFIDENCE:
- If the knowledge base does not contain a relevant answer, say: "I want to make sure you get an accurate answer on that — let me connect you with a specialist." Then stop. Do not guess.
- After your answer, on a new line, output exactly: ROUTE: <patient|operator|affiliate|none>
- If ROUTE is none, output: ROUTE: none

Keep answers concise (2-5 sentences), warm, and professional. Do not use markdown headers.`;

    let reply = '';
    let detectedRoute = null;
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\n---\nVISITOR QUESTION:\n${trimmed}\n\nAnswer now:`,
        add_context_from_internet: false,
      });
      if (typeof response === 'string') {
        reply = response;
      } else if (response && typeof response === 'object') {
        reply = response.text || response.content || response.message || response.response || JSON.stringify(response);
      }
    } catch (err) {
      console.error('AnswerEngine LLM error', err);
      reply = "I'm having trouble right now — please call (240) 387-5224 and a specialist will help immediately.\n\nROUTE: none";
    }

    // Parse route
    const routeMatch = reply.match(/ROUTE:\s*(patient|operator|affiliate|none)/i);
    if (routeMatch) {
      const r = routeMatch[1].toLowerCase();
      detectedRoute = r === 'none' ? null : r;
      reply = reply.replace(/ROUTE:\s*\w+.*/i, '').trim();
    }
    setRoute(detectedRoute);
    if (!detectedRoute) setShowEscalation(true);

    setMessages(prev => [...prev, { role: 'assistant', content: reply, route: detectedRoute }]);
    setLoading(false);
  }, [input, loading, buildGrounding]);

  return (
    <>
      {/* Floating bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="answer-bubble"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[55] flex items-center gap-2 bg-[#0A0A0A] hover:bg-[#1a1a1a] text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl transition-all group"
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0A0A0A] animate-pulse" />
            </div>
            <span className="font-bold text-sm tracking-tight">Ask MedRevolve AI</span>
            <span className="hidden sm:inline text-[10px] text-white/40 font-medium ml-1 group-hover:text-white/60 transition-colors">→</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="answer-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-6 right-6 z-[55] w-[380px] max-w-[calc(100vw-1.5rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-white"
            style={{ height: 'min(600px, calc(100vh - 120px))', maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between flex-shrink-0 bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a]">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0A0A0A] animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-sm leading-tight">Answer Engine</p>
                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#4A6741] to-[#6B8F5E] rounded-full text-[8px] font-bold text-white uppercase tracking-wider">AI</span>
                  </div>
                  <p className="text-[10px] text-white/50 leading-tight flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                    Instant answers · {kb.length} topics loaded
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 bg-[#F9F9F7]">
              {messages.map((msg, idx) => (
                <div key={idx} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={msg.role === 'user'
                    ? 'bg-[#0A0A0A] text-white rounded-2xl rounded-br-sm px-3.5 py-2.5 max-w-[85%] shadow-sm'
                    : 'bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 max-w-[90%] shadow-sm'
                  }>
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    {msg.role === 'assistant' && msg.route && (
                      <div className="mt-2.5">
                        <RouteCTACard route={msg.route} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {showEscalation && !loading && (
                <EscalationCard />
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested prompts */}
            {messages.length <= 1 && (
              <div className="flex-shrink-0 px-4 py-2.5 border-t border-gray-100 bg-white">
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED.map(s => (
                    <button key={s} onClick={() => sendMessage(s)} disabled={loading}
                      className="text-[11px] px-2.5 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 hover:bg-[#4A6741] hover:text-white hover:border-[#4A6741] transition-all disabled:opacity-50">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="flex-shrink-0 px-3 py-3 bg-white border-t border-gray-100">
              <div className="flex gap-2 items-center">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                  placeholder="Ask about peptides, GLP-1, pricing, white-label..."
                  className="flex-1 rounded-xl text-sm border-gray-200 bg-gray-50 focus:bg-white focus:border-[#4A6741] h-10 transition-colors"
                  disabled={loading}
                  maxLength={2000}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all shadow-md ${
                    input.trim() ? 'bg-gradient-to-br from-[#4A6741] to-[#6B8F5E] text-white hover:shadow-lg hover:scale-105' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 px-1">
                <p className="text-[9px] text-gray-400">Clinician-guided · No medical advice</p>
                <a href={PHONE_TEL} className="text-[9px] text-[#4A6741] font-medium flex items-center gap-1 hover:underline">
                  <Phone className="w-3 h-3" /> {PHONE}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}