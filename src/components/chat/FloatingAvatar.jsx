import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';

export default function FloatingAvatar({ onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 320 }}
      className="fixed bottom-6 right-6 z-[45] flex items-center justify-center rounded-full shadow-2xl cursor-pointer focus:outline-none"
      style={{ width: 60, height: 60, background: 'linear-gradient(135deg, #0A0A0A 0%, #4A6741 100%)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Active dot */}
      <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />

      <MessageSquare className="w-6 h-6 text-white" />

      {/* Tooltip */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-[70px] right-0 whitespace-nowrap pointer-events-none"
        >
          <div className="bg-black/90 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-xl">
            Chat with Melinda
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}