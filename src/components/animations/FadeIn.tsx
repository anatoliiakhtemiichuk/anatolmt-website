'use client';

import { ReactNode } from 'react';
import { motion, useReducedMotion, type Transition } from 'framer-motion';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Slide distance in pixels */
  slideDistance?: number;
  /** Direction of slide */
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * FadeIn - Animates on mount (page load), not on scroll
 * Use for hero content that should animate immediately when page loads
 */
export function FadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  slideDistance = 30,
  direction = 'up',
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  const getInitialPosition = () => {
    if (prefersReducedMotion) return { x: 0, y: 0 };

    switch (direction) {
      case 'up':
        return { x: 0, y: slideDistance };
      case 'down':
        return { x: 0, y: -slideDistance };
      case 'left':
        return { x: slideDistance, y: 0 };
      case 'right':
        return { x: -slideDistance, y: 0 };
      default:
        return { x: 0, y: slideDistance };
    }
  };

  const transition: Transition = {
    duration: prefersReducedMotion ? 0.3 : duration,
    delay,
    ease: [0.22, 1, 0.36, 1],
  };

  const initialPosition = getInitialPosition();

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...initialPosition,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
