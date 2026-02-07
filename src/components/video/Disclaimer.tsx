'use client';

import { cn } from '@/lib/utils';
import { AlertTriangle, Info } from 'lucide-react';

interface DisclaimerProps {
  variant?: 'full' | 'compact' | 'inline';
  className?: string;
}

/**
 * Legal disclaimer component for video pages
 * Required on all video-related pages for liability protection
 */
export function Disclaimer({ variant = 'full', className }: DisclaimerProps) {
  if (variant === 'inline') {
    return (
      <p className={cn('text-sm text-gray-500 flex items-start gap-2', className)}>
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          Materiały mają charakter edukacyjny i nie zastępują konsultacji terapeutycznej.
        </span>
      </p>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800',
          className
        )}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
          <p>
            Ćwiczenia wykonujesz na własną odpowiedzialność. W razie bólu lub
            wątpliwości przerwij i skontaktuj się z terapeutą.
          </p>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        </div>
        <div className="space-y-3">
          <h3 className="font-semibold text-amber-900">Ważna informacja</h3>
          <div className="space-y-2 text-amber-800 text-sm">
            <p>
              <strong>Materiały mają charakter edukacyjny</strong> i nie zastępują
              konsultacji terapeutycznej ani diagnozy medycznej.
            </p>
            <p>
              Ćwiczenia wykonujesz na własną odpowiedzialność. W razie bólu,
              dyskomfortu lub jakichkolwiek wątpliwości przerwij ćwiczenie i
              skontaktuj się z terapeutą.
            </p>
            <p>
              Przed rozpoczęciem ćwiczeń upewnij się, że zostały one dobrane
              indywidualnie podczas wizyty terapeutycznej.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
