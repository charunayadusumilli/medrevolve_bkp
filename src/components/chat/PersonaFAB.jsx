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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg text-white pointer-events-none"
        style={{ background: vis.fabBg }}
      >
        <RevBotLogo size={13} />
        <span>Rev Bot</span>
        <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
      </motion.div>

      {/* FAB button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open Rev Bot AI assistant"
        className="relative flex items-center justify-center shadow-2xl overflow-hidden"
        style={{
          width: 68,
          height: 68,
          borderRadius: '50%',
          background: `linear-gradient(140deg, ${vis.gradient[0]}22 0%, ${vis.gradient[1]}44 100%)`,
          border: `2.5px solid ${vis.gradient[0]}70`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <AvatarFigure personaKey={ctx.personaKey} size="sm" animated={true} />
        {/* Online dot */}
        <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white shadow-sm z-10" />
      </motion.button>
    </motion.div>
  );
}