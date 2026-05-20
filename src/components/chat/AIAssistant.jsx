import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Send, Sparkles, ChevronDown, RotateCcw, PhoneCall, Zap, HeadphonesIcon } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLocation } from 'react-router-dom';
import { getPageContext, FAQ_BY_AUDIENCE, buildSystemPrompt, getPersonaVisuals } from './chatConfig';

import MessageBubble from './MessageBubble';
import VoiceCallPanel from './VoiceCallPanel';
import FloatingAvatar from './FloatingAvatar';
import Avatar3D from './Avatar3D';

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
  const [showEscalate, setShowEscalate] = useState(false);

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
    utterance.lang = 'en-US';
    utterance.rate = 0.92;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    // Prefer natural-sounding female voices
    const femaleVoice =
      voices.find(v => v.name === 'Samantha') ||
      voices.find(v => v.name === 'Karen') ||
      voices.find(v => v.name === 'Moira') ||
      voices.find(v => v.name.includes('Zira')) ||
      voices.find(v => v.name === 'Google US English' && v.lang === 'en-US') ||
      voices.find(v => /female|woman|girl/i.test(v.name) && v.lang.startsWith('en')) ||
      voices.find(v => v.lang === 'en-US' && !v.name.toLowerCase().includes('male')) ||
      voices.find(v => v.lang.startsWith('en'));
    if (femaleVoice) utterance.voice = femaleVoice;
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
    // Show live agent escalation after 4+ exchanges
    if (messages.length >= 6) setShowEscalate(true);

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
    let firstName = '';
    try { const u = await base44.auth.me(); firstName = (u?.full_name || u?.display_name || '').split(' ')[0]; } catch {}
    const nameGreeting = firstName ? `, ${firstName}` : '';
    const greeting = `Hey${nameGreeting}! I'm Rev, your personal wellness guide at MedRevolve. I'm here to help with anything — treatments, consultations, or just figuring out the best next step for your health journey. What's on your mind?`;
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

      {/* Floating 3D Avatar */}
      <AnimatePresence>
        {!isOpen && <FloatingAvatar onClick={() => { setIsOpen(true); setMinimized(false); }} />}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-6 right-6 z-[45] w-[360px] max-w-[calc(100vw-1.5rem)] flex flex-col pointer-events-auto"
            style={{ height: minimized ? 'auto' : 'min(560px, calc(100vh - 140px))', maxHeight: 'calc(100vh - 140px)' }}
          >
            <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#fff' }}>

              {/* ── Header ── */}
              <div className="px-4 py-3 flex items-center justify-between flex-shrink-0" style={{ background: '#0A0A0A' }}>
                <div className="flex items-center gap-2.5">
                  {/* Avatar dot */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[#4A6741] flex items-center justify-center text-white text-xs font-black">MR</div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0A0A0A]" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">MR Personal Guide</p>
                    <p className="text-[10px] text-white/40 leading-tight">Always here to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {voiceSupported && (
                    <button onClick={startVoiceCall} title="Voice call" className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
                      <PhoneCall className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={resetChat} title="New chat" className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all">
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
                    className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0"
                    style={{ background: '#F9F9F7' }}
                  >
                    {messages.map((msg, idx) => (
                      <MessageBubble key={idx} msg={msg} />
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                          <TypingDots />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* ── Quick prompts — only on first open, max 3 ── */}
                  {ctx.suggestedPrompts?.length > 0 && messages.length <= 1 && (
                    <div className="flex-shrink-0 px-4 py-2.5 border-t border-gray-100" style={{ background: '#F9F9F7' }}>
                      <p className="text-[10px] text-gray-400 font-medium mb-2">Quick starts</p>
                      <div className="flex flex-col gap-1.5">
                        {ctx.suggestedPrompts.slice(0, 3).map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => sendMessage(prompt)}
                            disabled={loading}
                            className="text-[12px] px-3 py-2 bg-white hover:bg-[#4A6741] text-gray-700 hover:text-white rounded-xl font-medium border border-gray-200 hover:border-[#4A6741] transition-all text-left disabled:opacity-50"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Live Agent Banner — only after long convo ── */}
                  {showEscalate && (
                    <div className="flex-shrink-0 px-4 py-2.5 flex items-center justify-between gap-3 border-t border-gray-100 bg-white">
                      <span className="text-[11px] text-gray-500">Want to talk to someone?</span>
                      <a
                        href="mailto:rned@medrevolve.com?subject=Live Support Request"
                        className="text-[11px] bg-[#0A0A0A] hover:bg-[#4A6741] text-white px-3 py-1.5 rounded-full font-semibold transition-colors whitespace-nowrap"
                      >
                        Contact Team
                      </a>
                      <button onClick={() => setShowEscalate(false)} className="text-gray-300 hover:text-gray-500 flex-shrink-0">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* ── Input ── */}
                  <div className="flex-shrink-0 px-3 py-3 bg-white border-t border-gray-100">
                    <div className="flex gap-2 items-center">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                        placeholder="Ask me anything…"
                        className="flex-1 rounded-xl text-sm border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-300 h-10"
                        disabled={loading}
                        aria-label="Chat input"
                        maxLength={2000}
                      />
                      <button
                        onClick={() => sendMessage(input)}
                        disabled={loading || !input.trim()}
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-30 transition-all"
                        style={{ background: input.trim() ? '#0A0A0A' : '#e5e7eb' }}
                        aria-label="Send"
                      >
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <p className="text-[9px] text-gray-300 text-center mt-2">For guidance only · Not medical advice</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}