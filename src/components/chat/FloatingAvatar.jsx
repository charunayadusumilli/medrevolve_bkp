import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Avatar3D from './Avatar3D';

export default function FloatingAvatar({ onClick }) {
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 180 });
  const [isHovered, setIsHovered] = useState(false);
  const isDragging = useRef(false);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    const startX = e.clientX || e.touches?.[0]?.clientX;
    const startY = e.clientY || e.touches?.[0]?.clientY;
    const startPos = { ...position };

    const handleMove = (moveEvent) => {
      if (!isDragging.current) return;
      const clientX = moveEvent.clientX || moveEvent.touches?.[0]?.clientX;
      const clientY = moveEvent.clientY || moveEvent.touches?.[0]?.clientY;
      
      setPosition({
        x: Math.min(Math.max(60, startPos.x + (clientX - startX)), window.innerWidth - 60),
        y: Math.min(Math.max(80, startPos.y + (clientY - startY)), window.innerHeight - 100)
      });
    };

    const handleUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleUp);
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 320 }}
      className="fixed z-[35] cursor-grab active:cursor-grabbing"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onClick={onClick}
    >
      {/* Premium glow effect */}
      <div 
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${isHovered ? 'opacity-60' : 'opacity-30'}`}
        style={{
          background: 'radial-gradient(circle, rgba(91, 139, 168, 0.5) 0%, rgba(74, 124, 150, 0.2) 50%, transparent 80%)',
          transform: 'scale(1.4)',
        }}
      />
      
      {/* Avatar with smooth hover scale */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Avatar3D size={76} animated={true} />
        
        {/* Active status - sleek dot */}
        <div className="absolute bottom-2 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-lg shadow-emerald-500/40 animate-pulse" />
      </motion.div>

      {/* Clean tooltip */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.18 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
        >
          <div className="bg-black/95 backdrop-blur-md text-white text-xs font-medium px-4 py-2 rounded-full shadow-2xl border border-white/15">
            Rev - Your AI Guide
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}