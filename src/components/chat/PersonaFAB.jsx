import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RevBotLogo from './RevBotLogo';

export default function PersonaFAB({ ctx, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed bottom-6 right-6 z-[35] flex items-center justify-end"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Slide-out label — appears to the LEFT of the button on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="label"
            initial={{ opacity: 0, x: 16, width: 0 }}
            animate={{ opacity: 1, x: 0, width: 'auto' }}
            exit={{ opacity: 0, x: 16, width: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="overflow-hidden mr-2"
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-white whitespace-nowrap shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2D3A2D 50%, #4A6741 100%)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <RevBotLogo size={15} color="white" />
              <span>Rev Bot</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Open Rev Bot AI assistant"
        className="relative flex items-center justify-center shadow-2xl flex-shrink-0"
        style={{
          width: 62,
          height: 62,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2D3A2D 55%, #4A6741 100%)',
          border: '2px solid rgba(74, 103, 65, 0.5)',
          boxShadow: '0 8px 32px rgba(45,58,45,0.55), 0 2px 8px rgba(0,0,0,0.25)',
        }}
      >
        <RevBotLogo size={30} color="white" />
      </motion.button>
    </motion.div>
  );
}