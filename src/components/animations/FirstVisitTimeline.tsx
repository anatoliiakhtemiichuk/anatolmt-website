'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  type Transition,
} from 'framer-motion';
import { MessageCircle, Search, Stethoscope, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';

// Steps data with icons defined in client component
const visitSteps = [
  {
    icon: MessageCircle,
    title: 'Krótki wywiad',
    description: 'Rozmawiamy o Twoich dolegliwościach i stylu życia',
  },
  {
    icon: Search,
    title: 'Ocena ciała',
    description: 'Sprawdzam napięcia, zakres ruchu i źródło problemu',
  },
  {
    icon: Stethoscope,
    title: 'Terapia manualna',
    description: 'Indywidualnie dobrana praca z ciałem',
  },
  {
    icon: FileText,
    title: 'Zalecenia',
    description: 'Otrzymujesz wskazówki do dalszej pracy',
  },
];

interface FirstVisitTimelineProps {
  className?: string;
}

/**
 * FirstVisitTimeline - Animated timeline for the first visit steps
 * Vertical line draws on scroll, step numbers light up
 */
export function FirstVisitTimeline({ className = '' }: FirstVisitTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.6'],
  });

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Vertical Line Container - Hidden on mobile, visible on md+ */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-0.5">
        {/* Background line (gray) */}
        <div className="absolute inset-0 bg-gray-200 rounded-full" />

        {/* Animated line (blue) - draws on scroll */}
        {!prefersReducedMotion ? (
          <motion.div
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#2563EB] to-[#3B82F6] rounded-full origin-top"
            style={{
              scaleY: scrollYProgress,
              height: '100%',
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#2563EB] to-[#3B82F6] rounded-full" />
        )}
      </div>

      {/* Steps */}
      <div className="relative space-y-8 md:space-y-0">
        {visitSteps.map((step, index) => (
          <TimelineStep
            key={index}
            step={step}
            index={index}
            totalSteps={visitSteps.length}
            scrollProgress={scrollYProgress}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  );
}

interface TimelineStepProps {
  step: (typeof visitSteps)[number];
  index: number;
  totalSteps: number;
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  prefersReducedMotion: boolean | null;
}

function TimelineStep({
  step,
  index,
  totalSteps,
  scrollProgress,
  prefersReducedMotion,
}: TimelineStepProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { once: true, margin: '-100px' });

  // Calculate when this step should activate based on scroll progress
  const stepThreshold = (index + 0.5) / totalSteps;

  // Transform scroll progress to opacity/scale for the step number
  const stepOpacity = useTransform(
    scrollProgress,
    [Math.max(0, stepThreshold - 0.15), stepThreshold],
    [0.4, 1]
  );

  const stepScale = useTransform(
    scrollProgress,
    [Math.max(0, stepThreshold - 0.15), stepThreshold],
    [0.85, 1]
  );

  const isEven = index % 2 === 0;
  const StepIcon = step.icon;

  const transition: Transition = {
    duration: prefersReducedMotion ? 0.3 : 0.6,
    delay: prefersReducedMotion ? 0 : 0.1,
    ease: [0.22, 1, 0.36, 1],
  };

  return (
    <div
      ref={itemRef}
      className={`relative md:flex md:items-center md:gap-8 py-4 ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Card Side */}
      <motion.div
        className={`md:w-[calc(50%-2.5rem)] ${isEven ? 'md:pr-4' : 'md:pl-4'}`}
        initial={{ opacity: 0, x: prefersReducedMotion ? 0 : isEven ? -30 : 30 }}
        animate={{
          opacity: isInView ? 1 : 0,
          x: isInView ? 0 : prefersReducedMotion ? 0 : isEven ? -30 : 30,
        }}
        transition={transition}
      >
        <div className="relative group">
          {/* Step Number Badge - Mobile only */}
          <div className="md:hidden absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-full flex items-center justify-center shadow-lg z-10">
            <span className="text-white font-bold text-lg">{index + 1}</span>
          </div>

          {/* Card */}
          <Card hover className="h-full transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
            <CardContent className="pt-8 md:pt-6">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB]/10 to-[#3B82F6]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <StepIcon className="w-8 h-8 text-[#2563EB]" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-[#0F172A] mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Center Step Number - Desktop only */}
      <div className="hidden md:flex items-center justify-center w-20 flex-shrink-0">
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-full flex items-center justify-center shadow-lg z-10 border-4 border-white"
          style={
            prefersReducedMotion
              ? {}
              : {
                  opacity: stepOpacity,
                  scale: stepScale,
                }
          }
        >
          <span className="text-white font-bold text-lg">{index + 1}</span>
        </motion.div>
      </div>

      {/* Empty Side for alignment */}
      <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
    </div>
  );
}
