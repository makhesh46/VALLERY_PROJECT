import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse coordinate values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics setup for smooth trailing ring
  const ringX = useSpring(mouseX, { stiffness: 180, damping: 25, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 25, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Setup interactive hover listeners
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, input[type="submit"], [role="button"], select, textarea, .cursor-pointer');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovered(true));
        el.addEventListener('mouseleave', () => setIsHovered(false));
      });
    };

    addHoverListeners();

    // Re-bind hover listeners when the DOM updates (e.g. page navigation)
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      observer.disconnect();
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Outer Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#c5a059] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          scale: isHovered ? 1.5 : 1,
          backgroundColor: isHovered ? 'rgba(197, 160, 89, 0.1)' : 'transparent',
          boxShadow: isHovered ? '0 0 15px rgba(197, 160, 89, 0.3)' : 'none',
          transition: 'scale 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease'
        }}
      />
      {/* 2. Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#c5a059] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
          scale: isHovered ? 0.5 : 1,
          transition: 'scale 0.2s ease'
        }}
      />
    </>
  );
}
