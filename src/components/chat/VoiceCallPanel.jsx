import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import AvatarFigure from './AvatarFigure';

function SoundWave({ active, color }) {
  return (
    <div className="flex items-center gap-[3px] h-6">
      {[1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ background: color || '#A8C99B' }}
          animate={active ? { height: ['6px', `${10 + i * 3}px`, '6px'] } : { height: '6px' }}
          transition={active ? {
            duration: 0.35 + i * 0.08,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.07,
          } : {}}
        />
      ))}
    </div>
  );
}

export default function VoiceCallPanel({ ctx, status, isSpeaking, isListening, isListeningPaused, onEndCall, onToggleMic }) {
  const { personaKey, persona, role, gradient } = ctx;

  const statusText = isSpeaking ? 'Speaking...'
    : isListening ? 'Listening...'
    : status === 'thinking' ? 'Thinking...'
    : 'Tap mic to speak';

  const statusColor = isSpeaking ? '#A8C99B' : isListening ? '#FCA5A5' : 'rgba(255,255,255,0.4)';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none"
      style={{ background: `linear-gradient(160deg, #0f1e0f 0%, ${gradient[0]} 50%, ${gradient[1]} 100%)` }}
    >
      {/* Avatar area */}
      <div className="relative mb-6">
        {/* Pulsing rings */}
        {(isSpeaking || isListening) && [1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${isSpeaking ? gradient[1] : '#FCA5A5'}` }}
            animate={{ scale: [1, 1.3 + i * 0.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        {/* Avatar circle */}
        <div
          className="w-36 h-36 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl flex items-center justify-center relative z-10"
          style={{ background: `linear-gradient(160deg, ${gradient[0]}44, ${gradient[1]}66)` }}
        >
          <AvatarFigure personaKey={personaKey} size="lg" animated={isSpeaking} />
        </div>

        {/* Live dot */}
        <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white shadow z-20" />
      </div>

      {/* Name / role */}
      <p className="text-white text-xl font-bold mb-1">{persona}</p>
      <p className="text-white/50 text-sm mb-4">{role}</p>

      {/* Sound wave + status */}
      <div className="flex items-center gap-2.5 mb-10" style={{ color: statusColor }}>
        {(isSpeaking || isListening) && <SoundWave active={true} color={statusColor} />}
        {status === 'thinking' && (
          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
        )}
        <span className="text-sm font-medium">{statusText}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={onToggleMic}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
            isListeningPaused ? 'bg-white/10 text-white/40' : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
          aria-label={isListeningPaused ? 'Unmute' : 'Mute'}
        >
          {isListeningPaused ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <button
          onClick={onEndCall}
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all"
          aria-label="End call"
        >
          <PhoneOff className="w-7 h-7 text-white" />
        </button>
      </div>

      <p className="text-white/20 text-xs mt-10">MedRevolve AI · Not medical advice</p>
    </motion.div>
  );
}