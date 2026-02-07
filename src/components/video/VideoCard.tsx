'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Play, Lock, Clock } from 'lucide-react';
import { Video, VIDEO_PRICES } from '@/types/video';
import { formatDuration } from '@/data/videos';

interface VideoCardProps {
  video: Video;
  locked?: boolean;
  showCategory?: boolean;
  className?: string;
}

/**
 * Video card component for displaying video previews
 * Shows thumbnail, title, duration, and lock state
 */
export function VideoCard({
  video,
  locked = true,
  showCategory = false,
  className,
}: VideoCardProps) {
  const priceFormatted = (VIDEO_PRICES.single / 100).toFixed(0);

  return (
    <Link
      href={`/video-pomoc/${video.slug}`}
      className={cn(
        'group block bg-white rounded-xl border border-gray-100 overflow-hidden',
        'shadow-sm hover:shadow-lg transition-all duration-300',
        'hover:-translate-y-1 hover:border-[#2563EB]/20',
        className
      )}
    >
      {/* Video thumbnail / preview */}
      <div className="relative aspect-video bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
        {/* Placeholder pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px]" />
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center',
              'transition-all duration-300',
              locked
                ? 'bg-white/10 backdrop-blur-sm'
                : 'bg-[#2563EB] group-hover:scale-110'
            )}
          >
            {locked ? (
              <Lock className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </div>
        </div>

        {/* Duration badge */}
        {video.duration_seconds && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(video.duration_seconds)}
          </div>
        )}

        {/* Price badge for locked videos */}
        {locked && (
          <div className="absolute top-3 right-3 bg-[#2563EB] text-white text-sm font-semibold px-3 py-1 rounded-full">
            {priceFormatted}€
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category badge */}
        {showCategory && (
          <span className="inline-block text-xs font-medium text-[#2563EB] bg-[#2563EB]/10 px-2 py-1 rounded mb-2">
            {video.category.replace('-', ' ')}
          </span>
        )}

        {/* Title */}
        <h3 className="font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-2">
          {video.title}
        </h3>

        {/* Description */}
        {video.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{video.description}</p>
        )}

        {/* CTA hint */}
        {locked && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">Kup dostęp</span>
            <span className="text-[#2563EB] font-medium group-hover:underline">
              Zobacz szczegóły →
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
