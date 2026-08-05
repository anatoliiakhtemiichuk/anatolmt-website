'use client';

import { useRef, ReactNode } from 'react';
import { motion, useInView, useReducedMotion, type Transition } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Slide distance in pixels */
  slideDistance?: number;
  /** Animation duration in seconds */
  duration?: number;
}

/**
 * Reveal component - fade + slide-up animation on scroll into view
 * Respects prefers-reduced-motion by using simple fade only
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  slideDistance = 30,
  duration = 0.6,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  // Premium easing curve - smooth and elegant
  const transition: Transition = {
    duration: prefersReducedMotion ? 0.3 : duration,
    delay,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: prefersReducedMotion ? 0 : slideDistance,
      }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : prefersReducedMotion ? 0 : slideDistance,
      }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
