import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar3D from './Avatar3D';

export default function FloatingAvatar({ onClick }) {
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 200 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Smooth floating animation
  useEffect(() => {
    let time = 0;
    const animate = () => {
      time += 0.02;
      if (!isDragging) {
        setPosition(prev => ({
          x: prev.x,
          y: prev.y + Math.sin(time) * 0.3
        }));
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isDragging]);

  // Mouse/touch drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const startX = e.clientX || e.touches?.[0]?.clientX;
    const startY = e.clientY || e.touches?.[0]?.clientY;
    const startPos = { ...position };

    const handleMove = (moveEvent) => {
      const clientX = moveEvent.clientX || moveEvent.touches?.[0]?.clientX;
      const clientY = moveEvent.clientY || moveEvent.touches?.[0]?.clientY;
      
      setPosition({
        x: startPos.x + (clientX - startX),
        y: startPos.y + (clientY - startY)
      });
    };

    const handleUp = () => {
      setIsDragging(false);
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

  // Keep avatar within viewport bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(Math.max(60, prev.x), window.innerWidth - 60),
        y: Math.min(Math.max(60, prev.y), window.innerHeight - 100)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      ref={dragRef}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
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
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(74, 103, 65, 0.4) 0%, transparent 70%)',
          transform: 'scale(1.5)',
          opacity: isHovered ? 0.6 : 0
        }}
      />

      {/* Avatar container */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
        onClick={onClick}
      >
        <Avatar3D size={72} animated={!isDragging} />
        
        {/* Status indicator */}
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
      </motion.div>

      {/* Tooltip on hover */}
      <AnimatePresence>
        {isHovered && !isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-black/90 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl border border-white/10">
              Rev - Your AI Guide
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}