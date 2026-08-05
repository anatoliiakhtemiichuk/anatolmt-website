'use client';

import { ReactNode } from 'react';
import { motion, useReducedMotion, type Transition } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
  /** Delay before animation starts */
  delay?: number;
  /** Delay between each word */
  staggerDelay?: number;
  /** Animation duration for each word */
  duration?: number;
  /** Render as specific element */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

/**
 * TextReveal - Apple-style word-by-word text reveal
 * Each word rises from behind an invisible mask
 */
export function TextReveal({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.08,
  duration = 0.5,
  as: Component = 'span',
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  // Split text into words
  const words = children.split(' ');

  const transition: Transition = {
    duration: prefersReducedMotion ? 0.3 : duration,
    ease: [0.22, 1, 0.36, 1],
  };

  // If reduced motion, just render the text
  if (prefersReducedMotion) {
    return (
      <Component className={className}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay }}
        >
          {children}
        </motion.span>
      </Component>
    );
  }

  return (
    <Component className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden"
        >
          <motion.span
            className="inline-block"
            initial={{
              y: '100%',
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              ...transition,
              delay: delay + index * staggerDelay,
            }}
          >
            {word}
          </motion.span>
          {/* Add space after each word except the last */}
          {index < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </Component>
  );
}
