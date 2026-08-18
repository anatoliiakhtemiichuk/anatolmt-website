'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ReactNode } from 'react';

/**
 * FloatingBadge - Gently floats up and down
 * For the promo badge in the hero section
 */
interface FloatingBadgeProps {
  children: ReactNode;
  className?: string;
}

export function FloatingBadge({ children, className = '' }: FloatingBadgeProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      animate={
        prefersReducedMotion
          ? {}
          : {
              y: [0, -6, 0],
            }
      }
      transition={{
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * BreathingGlow - Soft, slowly pulsing glow/shadow effect
 * For the primary CTA button
 */
interface BreathingGlowProps {
  children: ReactNode;
  className?: string;
}

export function BreathingGlow({ children, className = '' }: BreathingGlowProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`relative ${className}`}
      animate={
        prefersReducedMotion
          ? {}
          : {
              boxShadow: [
                '0 0 20px 0px rgba(37, 99, 235, 0.3)',
                '0 0 35px 5px rgba(37, 99, 235, 0.5)',
                '0 0 20px 0px rgba(37, 99, 235, 0.3)',
              ],
            }
      }
      transition={{
        duration: 2.5,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
      }}
      style={{ borderRadius: '0.5rem' }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollIndicator - Bouncing chevron at the bottom of the hero
 * Subtle indication to scroll down
 */
interface ScrollIndicatorProps {
  className?: string;
}

export function ScrollIndicator({ className = '' }: ScrollIndicatorProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return null; // Hide entirely when reduced motion is preferred
  }

  return (
    <motion.div
      className={`flex flex-col items-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <motion.div
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 1.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        <ChevronDown className="w-6 h-6 text-white/50" />
      </motion.div>
    </motion.div>
  );
}
