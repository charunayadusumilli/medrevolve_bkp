import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Send, Sparkles, ChevronDown, RotateCcw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLocation } from 'react-router-dom';
import { getPageContext, PERSONAS, getPersonaVisuals, FAQ_BY_AUDIENCE, buildSystemPrompt } from './chatConfig';
import ReactMarkdown from 'react-markdown';

// Derive page name from react-router pathname
function usePageContext() {
  const location = useLocation();
  const raw = location.pathname.replace(/^\//, '') || 'Home';
  const pageName = raw.split('?')[0] || 'Home';
  const params = new URLSearchParams(location.search);
  const pageProduct = params.get('name') || params.get('id') || null;
  const ctx = getPageContext(pageName);
  return { pageName, pageProduct, ctx };
}

// Persona Avatar — derives visuals directly from PERSONAS definition
function PersonaAvatar({ personaKey, size = 'md', ring = false }) {
  const vis = getPersonaVisuals(personaKey);
  const persona = PERSONAS[personaKey] || PERSONAS.wellness_concierge;
  const [imgErr, setImgErr] = React.useState(false);
  const dims = size === 'sm' ? 'w-7 h-7 text-[11px]' : size === 'lg' ? 'w-14 h-14 text-lg' : 'w-9 h-9 text-sm';
  return (
    <div
      className={`${dims} rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center font-bold text-white ${ring ? 'ring-2 ring-white/40' : ''}`}
      style={{ background: vis.fabBg }}
    >
      {!imgErr && vis.photo ? (
        <img src={vis.photo} alt={persona.name} className="w-full h-full object-cover" onError={() => setImgErr(true)} />
      ) : (
        <span>{vis.initials}</span>
      )}
    </div>
  );
}

// Floating persona badge shown on FAB when closed
function PersonaFAB({ ctx, onClick }) {
  const vis = getPersonaVisuals(ctx.personaKey);
  const [imgErr, setImgErr] = React.useState(false);
  return (
    <motion.div
      key="fab"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
    >
      {/* Persona label pill */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.35 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg text-white"
        style={{ background: vis.fabBg }}
      >
        <span>{ctx.persona}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
      </motion.div>

      {/* Main FAB with persona photo */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        className="relative w-16 h-16 rounded-full shadow-2xl overflow-hidden flex items-center justify-center"
        style={{ background: vis.fabBg }}
      >
        {!imgErr && vis.photo ? (
          <img
            src={vis.photo}
            alt={ctx.persona}
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="font-bold text-white text-lg">{vis.initials}</span>
        )}
        {/* Online indicator */}
        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
      </motion.button>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex gap-1 py-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
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
      {!isUser && (
        <PersonaAvatar personaKey={msg.personaKey} size="sm" />
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-[#2D3A2D] text-white rounded-br-sm'
            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
        }`}
      >
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

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevPageRef = useRef(pageName);

  // Reset conversation when page changes
  useEffect(() => {
    if (prevPageRef.current !== pageName) {
      prevPageRef.current = pageName;
      const newCtx = PAGE_CONTEXTS[pageName] || PAGE_CONTEXTS.default;
      setMessages([{ role: 'assistant', content: newCtx.greeting, personaKey: newCtx.personaKey }]);
      setFaqOpen(true);
    }
  }, [pageName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, minimized]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    setInput('');
    setFaqOpen(false);
    setMessages(prev => [...prev, { role: 'user', content: trimmed }]);
    setLoading(true);

    const activeCtx = getPageContext(pageName);
    const systemPrompt = buildSystemPrompt(pageName, pageProduct);

    // Rolling conversation context (last 10 messages)
    const history = messages
      .slice(-10)
      .map(m => `${m.role === 'user' ? 'User' : activeCtx.persona}: ${m.content}`)
      .join('\n\n');

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}

---
CONVERSATION SO FAR:
${history}

User: ${trimmed}

${activeCtx.persona}:`,
        add_context_from_internet: false,
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: typeof response === 'string' ? response : JSON.stringify(response),
        personaKey: activeCtx.personaKey,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had a hiccup! Please try again in a moment.',
        personaKey: activeCtx.personaKey,
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, pageName, pageProduct]);

  const resetChat = () => {
    const newCtx = PAGE_CONTEXTS[pageName] || PAGE_CONTEXTS.default;
    setMessages([{ role: 'assistant', content: newCtx.greeting, personaKey: newCtx.personaKey }]);
    setFaqOpen(true);
    setInput('');
  };

  const faqs = FAQ_BY_AUDIENCE[ctx.audience] || FAQ_BY_AUDIENCE['customer'];
  const showFaqs = faqOpen && messages.length <= 2;

  return (
    <>
      {/* Floating Action Button — dynamic persona */}
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
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-1.5rem)] flex flex-col"
            style={{ height: minimized ? 'auto' : 'min(620px, calc(100vh - 3rem))' }}
          >
            <Card className="flex flex-col h-full shadow-2xl rounded-2xl overflow-hidden border border-gray-100">

              {/* ── Header ── */}
              <div className={`bg-gradient-to-r ${ctx.color} px-4 py-3 flex items-center justify-between flex-shrink-0`}>
                <div className="flex items-center gap-3">
                  <PersonaAvatar personaKey={ctx.personaKey} size="md" ring />
                  <div>
                    <p className="font-semibold text-white text-sm leading-tight">{ctx.persona}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                      <p className="text-[11px] text-white/65 leading-tight">Online · {ctx.audience} specialist</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={resetChat}
                    title="Reset conversation"
                    className="p-2 rounded-xl hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setMinimized(m => !m)}
                    className="p-2 rounded-xl hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${minimized ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                  >
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

                  {/* ── FAQ Chips ── */}
                  <div className="flex-shrink-0 bg-white border-t border-gray-100">
                    <button
                      onClick={() => setFaqOpen(o => !o)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-[#4A6741] font-semibold hover:bg-[#F5F0E8] transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        Common questions for {ctx.audience}s
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

                  {/* ── Input ── */}
                  <div className="flex-shrink-0 px-3 pb-3 pt-2 bg-white border-t border-gray-100">
                    <div className="flex gap-2 items-center">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage(input);
                          }
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