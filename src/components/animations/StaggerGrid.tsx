'use client';

import { useRef, ReactNode, createContext, useContext } from 'react';
import { motion, useInView, useReducedMotion, type Transition } from 'framer-motion';

// Context to pass stagger timing to children
interface StaggerContextValue {
  isInView: boolean;
  staggerDelay: number;
  prefersReducedMotion: boolean | null;
}

const StaggerContext = createContext<StaggerContextValue>({
  isInView: false,
  staggerDelay: 0.08,
  prefersReducedMotion: false,
});

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  /** Delay between each item in seconds */
  staggerDelay?: number;
}

/**
 * StaggerGrid - Container that triggers staggered animations for child StaggerItems
 */
export function StaggerGrid({
  children,
  className = '',
  staggerDelay = 0.08,
}: StaggerGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const prefersReducedMotion = useReducedMotion();

  return (
    <StaggerContext.Provider value={{ isInView, staggerDelay, prefersReducedMotion }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </StaggerContext.Provider>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  /** Index of this item in the grid (for calculating delay) */
  index: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Slide distance in pixels */
  slideDistance?: number;
}

/**
 * StaggerItem - Individual item that animates with stagger delay based on index
 */
export function StaggerItem({
  children,
  className = '',
  index,
  duration = 0.5,
  slideDistance = 30,
}: StaggerItemProps) {
  const { isInView, staggerDelay, prefersReducedMotion } = useContext(StaggerContext);

  const transition: Transition = {
    duration: prefersReducedMotion ? 0.3 : duration,
    delay: index * staggerDelay,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <motion.div
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
