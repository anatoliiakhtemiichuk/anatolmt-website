'use client';

import { useReducedMotion } from 'framer-motion';

interface AuroraBackgroundProps {
  className?: string;
}

/**
 * AuroraBackground - Soft, slowly drifting light blobs
 * Creates a calm, hypnotic gradient animation
 * Respects prefers-reduced-motion (static gradient when set)
 */
export function AuroraBackground({ className = '' }: AuroraBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`absolute inset-0 overflow-hidden z-0 ${className}`}>
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />

      {/* Aurora blobs - only animate if motion is allowed */}
      <div
        className={`absolute inset-0 ${
          prefersReducedMotion ? '' : 'animate-aurora'
        }`}
      >
        {/* Primary blue blob */}
        <div
          className={`absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] bg-[#2563EB] ${
            prefersReducedMotion ? '' : 'animate-blob-1'
          }`}
          style={{
            top: '10%',
            left: '20%',
          }}
        />

        {/* Secondary blue blob */}
        <div
          className={`absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] bg-[#3B82F6] ${
            prefersReducedMotion ? '' : 'animate-blob-2'
          }`}
          style={{
            top: '40%',
            right: '10%',
          }}
        />

        {/* Accent purple blob */}
        <div
          className={`absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[80px] bg-[#6366F1] ${
            prefersReducedMotion ? '' : 'animate-blob-3'
          }`}
          style={{
            bottom: '20%',
            left: '30%',
          }}
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
