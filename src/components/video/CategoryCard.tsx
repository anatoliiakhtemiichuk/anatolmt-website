'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Activity,
  Heart,
  Move,
  Hand,
  Footprints,
  CircleDot,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';
import { VideoCategory } from '@/types/video';

interface CategoryCardProps {
  category: VideoCategory;
  videoCount: number;
  className?: string;
}

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  activity: Activity,
  heart: Heart,
  move: Move,
  hand: Hand,
  footprints: Footprints,
  'circle-dot': CircleDot,
};

/**
 * Category card component for the main video landing page
 * Shows category name, description, video count, and links to category videos
 */
export function CategoryCard({ category, videoCount, className }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon || 'activity'] || Activity;

  return (
    <Link
      href={`/video-pomoc?kategoria=${category.slug}`}
      className={cn(
        'group block bg-white rounded-xl border border-gray-100 p-6',
        'shadow-sm hover:shadow-lg transition-all duration-300',
        'hover:-translate-y-1 hover:border-[#2563EB]/20',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center',
              'bg-[#2563EB]/10 text-[#2563EB]',
              'group-hover:bg-[#2563EB] group-hover:text-white',
              'transition-colors duration-300'
            )}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          {/* Content */}
          <div className="space-y-1">
            <h3 className="font-semibold text-[#0F172A] text-lg group-hover:text-[#2563EB] transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500">
              {videoCount} {videoCount === 1 ? 'film' : videoCount < 5 ? 'filmy' : 'filmów'}
            </p>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight
          className={cn(
            'w-5 h-5 text-gray-400 group-hover:text-[#2563EB]',
            'transform group-hover:translate-x-1 transition-all duration-300'
          )}
        />
      </div>

      {/* Description */}
      {category.description && (
        <p className="mt-4 text-sm text-gray-600 line-clamp-2">{category.description}</p>
      )}
    </Link>
  );
}
