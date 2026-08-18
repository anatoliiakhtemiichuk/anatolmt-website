'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

interface AuroraBackgroundProps {
  className?: string;
}

/**
 * AuroraBackground - Soft, slowly drifting light blobs
 * Creates a calm, hypnotic gradient animation using Framer Motion
 * Respects prefers-reduced-motion (static gradient when set)
 */
export function AuroraBackground({ className = '' }: AuroraBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();

  // Blob animation variants - slow, continuous drifting
  const blob1Variants: Variants = {
    animate: {
      x: [0, 50, -30, 70, 0],
      y: [0, -60, 30, -40, 0],
      scale: [1, 1.1, 0.95, 1.05, 1],
      transition: {
        duration: 20,
        ease: [0.42, 0, 0.58, 1], // easeInOut as cubic bezier
        repeat: Infinity,
        repeatType: 'loop',
      },
    },
  };

  const blob2Variants: Variants = {
    animate: {
      x: [0, -60, 40, -20, 0],
      y: [0, 40, -50, 20, 0],
      scale: [1, 0.95, 1.1, 1, 1],
      transition: {
        duration: 25,
        ease: [0.42, 0, 0.58, 1],
        repeat: Infinity,
        repeatType: 'loop',
      },
    },
  };

  const blob3Variants: Variants = {
    animate: {
      x: [0, 30, -50, 60, 0],
      y: [0, 50, -30, 40, 0],
      scale: [1, 1.05, 0.9, 1.1, 1],
      transition: {
        duration: 22,
        ease: [0.42, 0, 0.58, 1],
        repeat: Infinity,
        repeatType: 'loop',
      },
    },
  };

  return (
    <div className={`absolute inset-0 overflow-hidden z-0 ${className}`}>
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />

      {/* Aurora blobs - animate with Framer Motion if motion is allowed */}
      <div className="absolute inset-0">
        {/* Primary blue blob */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] bg-[#2563EB]"
          style={{
            top: '10%',
            left: '20%',
          }}
          variants={blob1Variants}
          animate={prefersReducedMotion ? undefined : 'animate'}
        />

        {/* Secondary blue blob */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] bg-[#3B82F6]"
          style={{
            top: '40%',
            right: '10%',
          }}
          variants={blob2Variants}
          animate={prefersReducedMotion ? undefined : 'animate'}
        />

        {/* Accent purple blob */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[80px] bg-[#6366F1]"
          style={{
            bottom: '20%',
            left: '30%',
          }}
          variants={blob3Variants}
          animate={prefersReducedMotion ? undefined : 'animate'}
        />
      </div>

      {/* Subtle noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
