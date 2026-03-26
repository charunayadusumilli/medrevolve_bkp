import React from 'react';
import { motion } from 'framer-motion';
import RevBotLogo from './RevBotLogo';
import AvatarFigure from './AvatarFigure';
import { getPersonaVisuals } from './chatConfig';

export default function PersonaFAB({ ctx, onClick }) {
  const vis = getPersonaVisuals(ctx.personaKey);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed bottom-6 right-6 z-[35] flex flex-col items-end gap-2"
    >
      {/* Label pill */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55, duration: 0.3 }}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold shadow-xl text-white pointer-events-none tracking-wide"
        style={{ background: vis.fabBg, backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        <RevBotLogo size={14} color="white" />
        <span>Rev Bot</span>
        <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse shadow-sm" />
      </motion.div>

      {/* FAB button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Open Rev Bot AI assistant"
        className="relative flex items-center justify-center shadow-2xl overflow-hidden"
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: '#0A0A0A',
          border: `1.5px solid rgba(255,255,255,0.1)`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.25)`,
        }}
      >
        {/* Logo centered */}
        <RevBotLogo size={30} color="white" />

      </motion.button>
    </motion.div>
  );
}