import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Sparkles, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLocation } from 'react-router-dom';
import { PAGE_CONTEXTS, FAQ_BY_AUDIENCE, buildSystemPrompt } from './chatConfig';

function getPageName(pathname, search) {
  const path = pathname.replace('/', '') || 'Home';
  return path || 'Home';
}

function getPageProduct(search) {
  const params = new URLSearchParams(search);
  return params.get('id') || params.get('name') || null;
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 rounded-2xl px-4 py-3">
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const location = useLocation();
  const pageName = getPageName(location.pathname, location.search);
  const pageProduct = getPageProduct(location.search);
  const ctx = PAGE_CONTEXTS[pageName] || PAGE_CONTEXTS.default;

  const [isOpen, setIsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: ctx.greeting }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Reset conversation when page changes
  useEffect(() => {
    const newCtx = PAGE_CONTEXTS[pageName] || PAGE_CONTEXTS.default;
    setMessages([{ role: 'assistant', content: newCtx.greeting }]);
    setFaqOpen(false);
  }, [pageName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, minimized]);

  const sendMessage = async (text) => {
    if (!text?.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setFaqOpen(false);

    const activeCtx = PAGE_CONTEXTS[pageName] || PAGE_CONTEXTS.default;
    const systemPrompt = buildSystemPrompt(activeCtx.persona, activeCtx.audience, pageName, pageProduct);

    // Build conversation history for context
    const history = messages
      .slice(-8) // last 8 msgs for context window
      .map(m => `${m.role === 'user' ? 'User' : 'Specialist'}: ${m.content}`)
      .join('\n');

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}

CONVERSATION HISTORY:
${history}

User: ${text.trim()}

Respond as ${activeCtx.persona}:`,
        add_context_from_internet: false,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I ran into an issue. Please try again in a moment!'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const faqs = FAQ_BY_AUDIENCE[ctx.audience] || FAQ_BY_AUDIENCE.customer;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br ${ctx.color} text-white shadow-xl flex items-center justify-center`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            <MessageCircle className="w-7 h-7" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-1.5rem)]"
            style={{ height: minimized ? 'auto' : 'min(600px, calc(100vh - 3rem))' }}
          >
            <Card className="h-full flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
              {/* Header */}
              <div className={`bg-gradient-to-r ${ctx.color} text-white px-4 py-3 flex items-center justify-between flex-shrink-0`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm leading-tight">{ctx.persona}</p>
                    <p className="text-[11px] text-white/75">MedRevolve Specialist</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setMinimized(m => !m)}
                    className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                    <ChevronDown className={`w-4 h-4 transition-transform ${minimized ? 'rotate-180' : ''}`} />
                  </button>
                  <button onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!minimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FDFBF7]">
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-[#4A6741] text-white rounded-br-sm'
                            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                        }`}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    {loading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* FAQ Quick Chips */}
                  <div className="px-3 pt-2 pb-1 bg-white border-t border-gray-100">
                    <button
                      onClick={() => setFaqOpen(o => !o)}
                      className="text-xs text-[#4A6741] font-medium flex items-center gap-1 mb-1.5 hover:underline"
                    >
                      <Sparkles className="w-3 h-3" />
                      Suggested questions
                      <ChevronDown className={`w-3 h-3 transition-transform ${faqOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {faqOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-1.5 pb-2">
                            {faqs.map(faq => (
                              <button
                                key={faq.label}
                                onClick={() => sendMessage(faq.q)}
                                disabled={loading}
                                className="text-[11px] px-2.5 py-1 bg-[#F5F0E8] hover:bg-[#E8E0D5] text-[#4A6741] rounded-full transition-colors border border-[#E8E0D5] font-medium"
                              >
                                {faq.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Input */}
                  <div className="p-3 bg-white border-t border-gray-100">
                    <div className="flex gap-2">
                      <Input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                        placeholder={`Ask your ${ctx.persona}...`}
                        className="flex-1 rounded-full text-sm border-gray-200"
                        disabled={loading}
                      />
                      <Button
                        onClick={() => sendMessage(input)}
                        disabled={loading || !input.trim()}
                        size="icon"
                        className={`rounded-full bg-gradient-to-br ${ctx.color} border-0 flex-shrink-0`}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
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