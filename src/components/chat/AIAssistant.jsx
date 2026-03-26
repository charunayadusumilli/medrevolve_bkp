import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Send, Sparkles, ChevronDown, RotateCcw, PhoneCall } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLocation } from 'react-router-dom';
import { getPageContext, FAQ_BY_AUDIENCE, buildSystemPrompt, getPersonaVisuals } from './chatConfig';
import AvatarFigure from './AvatarFigure';
import MessageBubble from './MessageBubble';
import VoiceCallPanel from './VoiceCallPanel';
import PersonaFAB from './PersonaFAB';
import RevBotLogo from './RevBotLogo';

function usePageContext() {
  const location = useLocation();
  const raw = location.pathname.replace(/^\//, '') || 'Home';
  const pageName = raw.split('?')[0] || 'Home';
  const params = new URLSearchParams(location.search);
  const pageProduct = params.get('name') || params.get('id') || null;
  const ctx = getPageContext(pageName);
  return { pageName, pageProduct, ctx };
}

function TypingDots() {
  return (
    <div className="flex gap-1 py-1 px-1">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

export default function AIAssistant() {
  const { pageName, pageProduct, ctx } = usePageContext();
  const vis = getPersonaVisuals(ctx.personaKey);

  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: ctx.greeting, personaKey: ctx.personaKey }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [faqOpen, setFaqOpen] = useState(true);

  // Voice
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListeningPaused, setIsListeningPaused] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('idle');
  const [voiceTranscript, setVoiceTranscript] = useState([]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevPageRef = useRef(pageName);
  const recognitionRef = useRef(null);
  const sendMessageRef = useRef(null);
  const voiceLoopRef = useRef(false);
  const isListeningPausedRef = useRef(false);
  const sessionId = useRef(`chat-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  const voiceSupported = typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  // Reset when page changes
  useEffect(() => {
    if (prevPageRef.current !== pageName) {
      prevPageRef.current = pageName;
      const newCtx = getPageContext(pageName);
      setMessages([{ role: 'assistant', content: newCtx.greeting, personaKey: newCtx.personaKey }]);
      setFaqOpen(true);
    }
  }, [pageName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && !minimized && !isVoiceOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, minimized, isVoiceOpen]);

  // ── speak ──────────────────────────────────────────────────────────────────
  const speak = useCallback((text) => new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '').replace(/`[^`]*`/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n+/g, '. ').replace(/•/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'en-US'; utterance.rate = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English') || (v.lang === 'en-US' && !v.name.includes('Google'))) || voices.find(v => v.lang.startsWith('en'));
    if (pref) utterance.voice = pref;
    utterance.onstart = () => { setIsSpeaking(true); setVoiceStatus('speaking'); };
    utterance.onend = () => { setIsSpeaking(false); resolve(); };
    utterance.onerror = () => { setIsSpeaking(false); resolve(); };
    window.speechSynthesis.speak(utterance);
  }), []);

  // ── startListeningOnce ─────────────────────────────────────────────────────
  const startListeningOnce = useCallback(() => {
    if (!voiceSupported || isListeningPausedRef.current) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = 'en-US'; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onstart = () => { setIsListening(true); setVoiceStatus('listening'); };
    rec.onresult = (e) => {
      const t = e.results[0]?.[0]?.transcript?.trim();
      if (t) { setIsListening(false); sendMessageRef.current?.(t, true); }
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = (e) => {
      setIsListening(false);
      if (e.error === 'no-speech' && voiceLoopRef.current && !isListeningPausedRef.current) {
        setTimeout(() => startListeningOnce(), 500);
      }
    };
    recognitionRef.current = rec;
    rec.start();
  }, [voiceSupported]);

  // ── sendMessage ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text, fromVoice = false) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    setInput('');
    setFaqOpen(false);
    setLoading(true);
    if (fromVoice) setVoiceStatus('thinking');

    const activeCtx = getPageContext(pageName);
    const systemPrompt = buildSystemPrompt(pageName, pageProduct);
    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    if (fromVoice) setVoiceTranscript(prev => [...prev, { role: 'user', content: trimmed }]);

    const history = messages.slice(-16)
      .map(m => `${m.role === 'user' ? 'User' : activeCtx.persona}: ${m.content}`)
      .join('\n\n');

    let replyText = 'Sorry, I had a hiccup! Try again in a moment.';
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\n---\nCONVERSATION SO FAR:\n${history}\n\nUser: ${trimmed}\n\n${activeCtx.persona} (be warm, genuinely helpful, connect their question to their wellness journey and naturally guide toward MedRevolve solutions. End with a question or clear next step):`,
        add_context_from_internet: false,
      });
      if (typeof response === 'string') {
        replyText = response;
      } else if (response && typeof response === 'object') {
        replyText = response.text || response.content || response.message || response.response || JSON.stringify(response);
      }
      console.log('LLM response type:', typeof response, response);
    } catch (err) {
      console.error('Chat LLM error:', err);
    }

    setMessages(prev => [...prev, { role: 'assistant', content: replyText, personaKey: activeCtx.personaKey }]);
    if (fromVoice) setVoiceTranscript(prev => [...prev, { role: 'assistant', content: replyText }]);
    setLoading(false);
    if (messages.length <= 2) setFaqOpen(true);

    try {
      let userEmail = null;
      try { const u = await base44.auth.me(); userEmail = u?.email; } catch {}
      await base44.entities.ChatLog.create({
        session_id: sessionId.current, user_email: userEmail,
        page_name: pageName, user_message: trimmed, ai_response: replyText,
        user_agent: navigator.userAgent,
      });
    } catch {}

    if (fromVoice && voiceLoopRef.current) {
      setVoiceStatus('speaking');
      await speak(replyText);
      setVoiceStatus('idle');
      if (voiceLoopRef.current && !isListeningPausedRef.current) {
        setTimeout(() => startListeningOnce(), 300);
      }
    }
  }, [input, loading, messages, pageName, pageProduct, speak, startListeningOnce]);

  useEffect(() => { sendMessageRef.current = sendMessage; }, [sendMessage]);

  const resetChat = () => {
    const newCtx = getPageContext(pageName);
    setMessages([{ role: 'assistant', content: newCtx.greeting, personaKey: newCtx.personaKey }]);
    setFaqOpen(true); setInput('');
  };

  const startVoiceCall = async () => {
    setIsVoiceOpen(true); voiceLoopRef.current = true;
    isListeningPausedRef.current = false; setIsListeningPaused(false);
    setVoiceTranscript([]);
    setVoiceStatus('speaking');
    const greeting = `Hi! I'm Rev Bot, your AI ${ctx.persona} at MedRevolve — not a human, but here to help! Ask me anything about our treatments, consultations, or wellness programs.`;
    setVoiceTranscript([{ role: 'assistant', content: greeting }]);
    await speak(greeting);
    setVoiceStatus('idle');
    if (voiceLoopRef.current) setTimeout(() => startListeningOnce(), 300);
  };

  const endVoiceCall = () => {
    voiceLoopRef.current = false;
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    setIsVoiceOpen(false); setIsListening(false); setIsSpeaking(false); setVoiceStatus('idle');
  };

  const toggleMicPause = () => {
    const pausing = !isListeningPausedRef.current;
    isListeningPausedRef.current = pausing; setIsListeningPaused(pausing);
    if (pausing) { recognitionRef.current?.stop(); }
    else if (!isSpeaking && !loading) { setTimeout(() => startListeningOnce(), 200); }
  };

  const faqs = FAQ_BY_AUDIENCE[ctx.audience] || [];

  return (
    <>
      {/* Voice Call */}
      <AnimatePresence>
        {isVoiceOpen && (
          <VoiceCallPanel
            ctx={ctx} status={voiceStatus}
            isSpeaking={isSpeaking} isListening={isListening}
            isListeningPaused={isListeningPaused}
            onEndCall={endVoiceCall} onToggleMic={toggleMicPause}
            transcript={voiceTranscript}
            onSendText={(text) => sendMessage(text, true)}
          />
        )}
      </AnimatePresence>

      {/* FAB */}
      <AnimatePresence>
        {!isOpen && <PersonaFAB ctx={ctx} onClick={() => { setIsOpen(true); setMinimized(false); }} />}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 32, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.93 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[45] w-[400px] max-w-[calc(100vw-1.5rem)] flex flex-col pointer-events-auto"
            style={{ height: minimized ? 'auto' : 'min(560px, calc(100vh - 170px))', top: 'auto', maxHeight: 'calc(100vh - 170px)' }}
          >
            <Card className="flex flex-col h-full shadow-2xl rounded-2xl overflow-hidden border border-[#E8E0D5]">

              {/* ── Header ── */}
              <div
                className="px-4 py-3 flex items-center justify-between flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${vis.gradient[0]} 0%, ${vis.gradient[1]} 100%)` }}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar portrait */}
                  <div className="flex-shrink-0 rounded-xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.15)', padding: 3 }}>
                    <AvatarFigure personaKey={ctx.personaKey} size="sm" animated={false} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-sm leading-tight tracking-tight">Rev Bot</p>
                      <span className="text-[9px] bg-white/25 text-white px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 border border-white/30">
                        <RevBotLogo size={9} /> AI
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                      <p className="text-[10px] text-white/65 leading-tight">{ctx.persona} · AI</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <button onClick={resetChat} title="Reset chat" className="p-2 rounded-xl hover:bg-white/20 text-white/70 hover:text-white transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  {voiceSupported && (
                    <button onClick={startVoiceCall} title="Voice call" className="p-2 rounded-xl hover:bg-white/20 text-white/70 hover:text-white transition-colors">
                      <PhoneCall className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => setMinimized(m => !m)} className="p-2 rounded-xl hover:bg-white/20 text-white/70 hover:text-white transition-colors">
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${minimized ? 'rotate-180' : ''}`} />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-white/20 text-white/70 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!minimized && (
                <>
                  {/* ── Messages ── */}
                  <div
                    role="log"
                    aria-live="polite"
                    aria-label="Chat messages"
                    className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#FAFAF8] min-h-0"
                  >
                    {messages.map((msg, idx) => (
                      <MessageBubble key={idx} msg={msg} />
                    ))}
                    {loading && (
                      <div className="flex justify-start gap-2.5">
                        <AvatarFigure personaKey={ctx.personaKey} size="sm" animated={false} />
                        <div className="bg-white border border-[#E8E0D5] rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                          <TypingDots />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* ── Voice banner ── */}
                  {voiceSupported && (
                    <div className="flex-shrink-0 bg-[#F5F0E8] border-t border-[#E8E0D5] px-4 py-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-[#4A6741]" />
                        <span className="text-xs text-[#5A6B5A]">Prefer to talk?</span>
                      </div>
                      <button
                        onClick={startVoiceCall}
                        className="text-xs bg-[#4A6741] text-white px-3 py-1 rounded-full font-semibold hover:bg-[#3D5636] transition-colors"
                      >
                        Start Voice Call
                      </button>
                    </div>
                  )}

                  {/* ── FAQ Chips ── */}
                  <div className="flex-shrink-0 bg-white border-t border-gray-100">
                    <button
                      onClick={() => setFaqOpen(o => !o)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-[#4A6741] font-semibold hover:bg-[#F5F0E8] transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        Common questions
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${faqOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {faqOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
                            {faqs.map(faq => (
                              <button
                                key={faq.label}
                                onClick={() => sendMessage(faq.q)}
                                disabled={loading}
                                className="text-[11px] px-2.5 py-1.5 bg-[#F5F0E8] hover:bg-[#E8DDD0] text-[#4A6741] rounded-full font-medium border border-[#E8E0D5] transition-colors disabled:opacity-50 whitespace-nowrap"
                              >
                                {faq.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Input ── */}
                  <div className="flex-shrink-0 px-3 pb-3 pt-2 bg-white border-t border-gray-100">
                    <div className="flex gap-2 items-center">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                        placeholder={`Ask Rev Bot anything...`}
                        className="flex-1 rounded-full text-sm border-gray-200 bg-[#FAFAF8] focus:bg-white"
                        disabled={loading}
                        aria-label="Chat input"
                        maxLength={2000}
                      />
                      <Button
                        onClick={() => sendMessage(input)}
                        disabled={loading || !input.trim()}
                        size="icon"
                        className="rounded-full border-0 flex-shrink-0 w-9 h-9 shadow-md"
                        style={{ background: `linear-gradient(135deg, ${vis.gradient[0]}, ${vis.gradient[1]})` }}
                        aria-label="Send message"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <p className="text-center text-[10px] text-gray-400 mt-1.5">
                      🤖 AI · MedRevolve topics only · Not medical advice
                    </p>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}