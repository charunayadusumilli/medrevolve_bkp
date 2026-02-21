import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Send, Sparkles, ChevronDown, RotateCcw, Mic, MicOff, PhoneCall, PhoneOff, Bot } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLocation } from 'react-router-dom';
import { getPageContext, PERSONAS, AUDIENCES, getPersonaVisuals, FAQ_BY_AUDIENCE, buildSystemPrompt } from './chatConfig';
import ReactMarkdown from 'react-markdown';
import AvatarFigure from './AvatarFigure';

function usePageContext() {
  const location = useLocation();
  const raw = location.pathname.replace(/^\//, '') || 'Home';
  const pageName = raw.split('?')[0] || 'Home';
  const params = new URLSearchParams(location.search);
  const pageProduct = params.get('name') || params.get('id') || null;
  const ctx = getPageContext(pageName);
  return { pageName, pageProduct, ctx };
}

function PersonaAvatar({ personaKey, size = 'md', ring = false }) {
  const vis = getPersonaVisuals(personaKey);
  const dims = size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-20 h-20' : 'w-12 h-12';
  return (
    <div
      className={`${dims} rounded-2xl flex-shrink-0 overflow-hidden flex items-end justify-center ${ring ? 'ring-2 ring-white/40' : ''}`}
      style={{ background: `linear-gradient(160deg, ${vis.gradient[0]}22 0%, ${vis.gradient[1]}44 100%)` }}
    >
      <AvatarFigure personaKey={personaKey} size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'} animated={size !== 'sm'} />
    </div>
  );
}

function PersonaFAB({ ctx, onClick }) {
  const vis = getPersonaVisuals(ctx.personaKey);
  return (
    <motion.div
      key="fab"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2"
    >
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.35 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg text-white"
        style={{ background: vis.fabBg }}
      >
        <Bot className="w-3 h-3" />
        <span>AI {ctx.persona}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
      </motion.div>
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        className="relative w-20 h-20 rounded-2xl shadow-2xl overflow-hidden flex items-end justify-center"
        style={{ background: `linear-gradient(160deg, ${vis.gradient[0]}33, ${vis.gradient[1]}66)`, border: `2px solid ${vis.gradient[0]}55` }}
      >
        <AvatarFigure personaKey={ctx.personaKey} size="md" animated={true} />
        <span className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
      </motion.button>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-1 py-1">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

// Animated sound wave bars for speaking indicator
function SoundWave({ active }) {
  return (
    <div className="flex items-center gap-[3px] h-6">
      {[1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-current"
          animate={active ? {
            height: ['6px', `${10 + Math.random() * 14}px`, '6px'],
          } : { height: '6px' }}
          transition={active ? {
            duration: 0.4 + i * 0.1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.08,
          } : {}}
        />
      ))}
    </div>
  );
}

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2`}
    >
      {!isUser && <PersonaAvatar personaKey={msg.personaKey} size="sm" />}
      <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
        isUser ? 'bg-[#2D3A2D] text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
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
              strong: ({ children }) => <strong className="font-semibold text-[#2D3A2D]">{children}</strong>,
            }}
          >
            {msg.content}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
}

// ── Full-screen Voice Call Overlay ──────────────────────────────────────────
function VoiceCallOverlay({ ctx, status, isSpeaking, isListening, onEndCall, onToggleMic, isListeningPaused }) {
  const vis = getPersonaVisuals(ctx.personaKey);
  const [imgErr, setImgErr] = React.useState(false);

  const statusText = isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : status === 'thinking' ? 'Thinking...' : 'Tap mic to speak';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1a2a1a 0%, #2D3A2D 60%, #4A6741 100%)' }}
    >
      {/* Pulsing ring when speaking */}
      <div className="relative mb-8">
        {isSpeaking && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(74,103,65,0.3)' }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(74,103,65,0.2)' }}
              animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
          </>
        )}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-red-400"
            animate={{ scale: [1, 1.15, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl relative z-10">
          {!imgErr && vis.photo ? (
            <img src={vis.photo} alt={ctx.persona} className="w-full h-full object-cover" onError={() => setImgErr(true)} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold" style={{ background: vis.fabBg }}>
              {vis.initials}
            </div>
          )}
        </div>
      </div>

      {/* Name & status */}
      <p className="text-white text-xl font-bold mb-1">{ctx.persona}</p>
      <p className="text-white/50 text-sm mb-2">{ctx.role}</p>

      {/* Sound wave / status */}
      <div className={`flex items-center gap-2 mb-10 text-sm font-medium ${
        isSpeaking ? 'text-[#A8C99B]' : isListening ? 'text-red-300' : 'text-white/40'
      }`}>
        {isSpeaking ? (
          <><SoundWave active={true} /> {statusText}</>
        ) : isListening ? (
          <><SoundWave active={true} /> {statusText}</>
        ) : status === 'thinking' ? (
          <><span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin inline-block" /> {statusText}</>
        ) : (
          <span>{statusText}</span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        {/* Mute/unmute */}
        <button
          onClick={onToggleMic}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            isListeningPaused ? 'bg-white/10 text-white/40' : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
        >
          {isListeningPaused ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* End call */}
        <button
          onClick={onEndCall}
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all"
        >
          <PhoneOff className="w-7 h-7 text-white" />
        </button>
      </div>

      <p className="text-white/20 text-xs mt-8">MedRevolve AI · Not medical advice</p>
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function AIAssistant() {
  const { pageName, pageProduct, ctx } = usePageContext();

  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: ctx.greeting, personaKey: ctx.personaKey }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [faqOpen, setFaqOpen] = useState(true);

  // Voice state
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListeningPaused, setIsListeningPaused] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('idle'); // idle | thinking | listening | speaking

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevPageRef = useRef(pageName);
  const recognitionRef = useRef(null);
  const sendMessageRef = useRef(null);
  const voiceLoopRef = useRef(false); // controls continuous loop
  const isListeningPausedRef = useRef(false);

  const voiceSupported = typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

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
    if (isOpen && !minimized && !isVoiceCallOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, minimized, isVoiceCallOpen]);

  // ── speak() — returns a promise that resolves when done ──────────────────
  const speak = useCallback((text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) { resolve(); return; }
      window.speechSynthesis.cancel();

      // Strip markdown for speech
      const clean = text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/`{1,3}[^`]*`{1,3}/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\n+/g, '. ')
        .replace(/•/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'en-US';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to pick a natural voice
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v =>
        v.name.includes('Samantha') || v.name.includes('Karen') ||
        v.name.includes('Google US English') || v.name.includes('Alex') ||
        (v.lang === 'en-US' && !v.name.includes('Google'))
      ) || voices.find(v => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => { setIsSpeaking(true); setVoiceStatus('speaking'); };
      utterance.onend = () => { setIsSpeaking(false); resolve(); };
      utterance.onerror = () => { setIsSpeaking(false); resolve(); };

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  // ── startListeningOnce() — one round of mic input ────────────────────────
  const startListeningOnce = useCallback(() => {
    if (!voiceSupported || isListeningPausedRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => { setIsListening(true); setVoiceStatus('listening'); };

    recognition.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setIsListening(false);
        sendMessageRef.current?.(transcript, true); // true = voice mode
      }
    };

    recognition.onend = () => { setIsListening(false); };
    recognition.onerror = (e) => {
      setIsListening(false);
      // On no-speech, restart listening if voice loop is still active
      if (e.error === 'no-speech' && voiceLoopRef.current && !isListeningPausedRef.current) {
        setTimeout(() => startListeningOnce(), 500);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceSupported]);

  // ── sendMessage ───────────────────────────────────────────────────────────
  const sessionId = useRef(`chat-${Date.now()}-${Math.random().toString(36).slice(2)}`);

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

    const history = messages
      .slice(-12)
      .map(m => `${m.role === 'user' ? 'User' : activeCtx.persona}: ${m.content}`)
      .join('\n\n');

    let replyText = 'Sorry, I had a hiccup! Try again in a moment.';
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}

---
CONVERSATION SO FAR:
${history}

User: ${trimmed}

${activeCtx.persona} (respond conversationally, as if speaking out loud — no bullet points, no markdown, just natural spoken sentences, 2-4 sentences max):`,
        add_context_from_internet: false,
      });
      replyText = typeof response === 'string' ? response : JSON.stringify(response);
    } catch {
      // use default error text
    }

    setMessages(prev => [...prev, { role: 'assistant', content: replyText, personaKey: activeCtx.personaKey }]);
    setLoading(false);

    // Log conversation to database
    try {
      let userEmail = null;
      try { const u = await base44.auth.me(); userEmail = u?.email; } catch {}
      await base44.entities.ChatLog.create({
        session_id: sessionId.current,
        user_email: userEmail,
        page_name: pageName,
        user_message: trimmed,
        ai_response: replyText,
        user_agent: navigator.userAgent,
      });
    } catch {}


    // In voice mode: speak then listen again
    if (fromVoice && voiceLoopRef.current) {
      setVoiceStatus('speaking');
      await speak(replyText);
      setVoiceStatus('idle');
      if (voiceLoopRef.current && !isListeningPausedRef.current) {
        setTimeout(() => startListeningOnce(), 300);
      }
    }
  }, [input, loading, messages, pageName, pageProduct, speak, startListeningOnce]);

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  const resetChat = () => {
    const newCtx = getPageContext(pageName);
    setMessages([{ role: 'assistant', content: newCtx.greeting, personaKey: newCtx.personaKey }]);
    setFaqOpen(true);
    setInput('');
  };

  // ── Start voice call ──────────────────────────────────────────────────────
  const startVoiceCall = async () => {
    setIsVoiceCallOpen(true);
    voiceLoopRef.current = true;
    isListeningPausedRef.current = false;
    setIsListeningPaused(false);

    // Speak greeting then start listening
    const greeting = `Hi! I'm your ${ctx.persona} at MedRevolve. Feel free to ask me anything about our treatments, like semaglutide, tirzepatide, or any of our wellness programs. What would you like to know?`;
    setVoiceStatus('speaking');
    await speak(greeting);
    setVoiceStatus('idle');

    if (voiceLoopRef.current) {
      setTimeout(() => startListeningOnce(), 300);
    }
  };

  // ── End voice call ────────────────────────────────────────────────────────
  const endVoiceCall = () => {
    voiceLoopRef.current = false;
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    setIsVoiceCallOpen(false);
    setIsListening(false);
    setIsSpeaking(false);
    setVoiceStatus('idle');
  };

  const toggleMicPause = () => {
    const pausing = !isListeningPausedRef.current;
    isListeningPausedRef.current = pausing;
    setIsListeningPaused(pausing);
    if (pausing) {
      recognitionRef.current?.stop();
    } else {
      // Resume listening
      if (!isSpeaking && !loading) {
        setTimeout(() => startListeningOnce(), 200);
      }
    }
  };

  const faqs = FAQ_BY_AUDIENCE[ctx.audience] || FAQ_BY_AUDIENCE[AUDIENCES?.CUSTOMER] || [];

  return (
    <>
      {/* Voice call overlay */}
      <AnimatePresence>
        {isVoiceCallOpen && (
          <VoiceCallOverlay
            ctx={ctx}
            status={voiceStatus}
            isSpeaking={isSpeaking}
            isListening={isListening}
            isListeningPaused={isListeningPaused}
            onEndCall={endVoiceCall}
            onToggleMic={toggleMicPause}
          />
        )}
      </AnimatePresence>

      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <PersonaFAB ctx={ctx} onClick={() => { setIsOpen(true); setMinimized(false); }} />
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed bottom-6 right-6 z-40 w-[400px] max-w-[calc(100vw-1.5rem)] flex flex-col"
            style={{ height: minimized ? 'auto' : 'min(580px, calc(100vh - 8rem))' }}
          >
            <Card className="flex flex-col h-full shadow-2xl rounded-2xl overflow-hidden border border-gray-100">

              {/* ── Header ── */}
              <div className={`bg-gradient-to-r ${ctx.color} px-4 py-3 flex items-center justify-between flex-shrink-0`}>
                <div className="flex items-center gap-3">
                  <PersonaAvatar personaKey={ctx.personaKey} size="md" ring />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-white text-sm leading-tight">{ctx.persona}</p>
                      <span className="text-[10px] bg-white/20 text-white/80 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Bot className="w-2.5 h-2.5" /> AI
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                      <p className="text-[11px] text-white/65 leading-tight">AI Assistant · MedRevolve only</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <button onClick={resetChat} title="Reset" className="p-2 rounded-xl hover:bg-white/20 text-white/70 hover:text-white transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  {voiceSupported && (
                    <button
                      onClick={startVoiceCall}
                      title="Start voice conversation"
                      className="p-2 rounded-xl hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                    >
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
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#FAFAF8] min-h-0">
                    {messages.map((msg, idx) => (
                      <ChatBubble key={idx} msg={msg} />
                    ))}
                    {loading && (
                      <div className="flex justify-start gap-2">
                        <PersonaAvatar personaKey={ctx.personaKey} size="sm" />
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                          <TypingDots />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* ── Voice call CTA banner ── */}
                  {voiceSupported && (
                    <div className="flex-shrink-0 bg-gradient-to-r from-[#4A6741]/10 to-[#6B8F5E]/10 border-t border-[#4A6741]/10 px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-3.5 h-3.5 text-[#4A6741]" />
                        <span className="text-xs text-[#4A6741] font-medium">Prefer to talk?</span>
                      </div>
                      <button
                        onClick={startVoiceCall}
                        className="text-xs bg-[#4A6741] text-white px-3 py-1 rounded-full font-semibold hover:bg-[#3D5636] transition-colors"
                      >
                        Start Voice Chat
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
                          <div className="px-3 pb-3 flex flex-wrap gap-1.5 max-h-[108px] overflow-y-auto">
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

                  {/* ── Text Input ── */}
                  <div className="flex-shrink-0 px-3 pb-3 pt-2 bg-white border-t border-gray-100">
                    <div className="flex gap-2 items-center">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
                        }}
                        placeholder={`Ask your ${ctx.persona}...`}
                        className="flex-1 rounded-full text-sm border-gray-200 bg-[#FAFAF8] focus:bg-white"
                        disabled={loading}
                      />
                      <Button
                        onClick={() => sendMessage(input)}
                        disabled={loading || !input.trim()}
                        size="icon"
                        className={`rounded-full bg-gradient-to-br ${ctx.color} border-0 flex-shrink-0 w-9 h-9 shadow-md`}
                      >
                        <Send className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <p className="text-center text-[10px] text-gray-300 mt-1.5">
                      MedRevolve AI · Not a substitute for medical advice
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