import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import AvatarFigure from './AvatarFigure';

export default function MessageBubble({ msg, onFeedback }) {
  const isUser = msg.role === 'user';
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFeedback = (val) => {
    setFeedback(val);
    onFeedback?.(val, msg);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mt-0.5">
          <AvatarFigure personaKey={msg.personaKey} size="sm" animated={false} />
        </div>
      )}

      <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'} max-w-[82%]`}>
        <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-[#2D3A2D] text-white rounded-br-sm shadow-sm'
            : 'bg-white border border-[#E8E0D5] text-[#2D3A2D] rounded-bl-sm shadow-sm'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{msg.content}</p>
          ) : (
            <ReactMarkdown
              className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5"
              components={{
                p: ({ children }) => <p className="my-1 text-[#2D3A2D]">{children}</p>,
                ul: ({ children }) => <ul className="my-1 ml-4 list-disc">{children}</ul>,
                li: ({ children }) => <li className="my-0.5">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-[#2D3A2D]">{children}</strong>,
              }}
            >
              {msg.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Feedback row for AI messages */}
        {!isUser && (
          <div className="flex items-center gap-1 px-1">
            <button
              onClick={() => handleFeedback('up')}
              className={`p-1 rounded-md transition-colors ${feedback === 'up' ? 'text-[#4A6741]' : 'text-gray-300 hover:text-[#4A6741]'}`}
              title="Helpful"
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleFeedback('down')}
              className={`p-1 rounded-md transition-colors ${feedback === 'down' ? 'text-red-400' : 'text-gray-300 hover:text-red-400'}`}
              title="Not helpful"
            >
              <ThumbsDown className="w-3 h-3" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1 rounded-md text-gray-300 hover:text-gray-500 transition-colors"
              title="Copy"
            >
              {copied ? <Check className="w-3 h-3 text-[#4A6741]" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}