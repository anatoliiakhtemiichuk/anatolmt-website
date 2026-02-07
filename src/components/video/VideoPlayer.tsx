'use client';

import { cn } from '@/lib/utils';
import { Video } from '@/types/video';

interface VideoPlayerProps {
  video: Video;
  autoplay?: boolean;
  className?: string;
}

/**
 * Video player component for embedded videos
 * Supports Vimeo and Cloudflare Stream embeds
 */
export function VideoPlayer({ video, autoplay = false, className }: VideoPlayerProps) {
  if (!video.embed_url) {
    return (
      <div
        className={cn(
          'aspect-video bg-gray-100 rounded-xl flex items-center justify-center',
          className
        )}
      >
        <p className="text-gray-500">Film niedostępny</p>
      </div>
    );
  }

  // Construct embed URL with parameters
  let embedUrl = video.embed_url;

  // Handle Vimeo URLs
  if (embedUrl.includes('vimeo.com')) {
    const separator = embedUrl.includes('?') ? '&' : '?';
    embedUrl += `${separator}title=0&byline=0&portrait=0&dnt=1`;
    if (autoplay) {
      embedUrl += '&autoplay=1&muted=1';
    }
  }

  // Handle Cloudflare Stream URLs
  if (embedUrl.includes('cloudflarestream.com') || embedUrl.includes('videodelivery.net')) {
    const separator = embedUrl.includes('?') ? '&' : '?';
    if (autoplay) {
      embedUrl += `${separator}autoplay=true&muted=true`;
    }
  }

  return (
    <div className={cn('aspect-video rounded-xl overflow-hidden bg-black', className)}>
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={video.title}
        loading="lazy"
      />
    </div>
  );
}

/**
 * Locked video preview component
 * Shows a blurred/darkened preview with purchase CTA
 */
interface LockedVideoPreviewProps {
  video: Video;
  className?: string;
}

export function LockedVideoPreview({ video, className }: LockedVideoPreviewProps) {
  return (
    <div
      className={cn(
        'relative aspect-video rounded-xl overflow-hidden',
        'bg-gradient-to-br from-[#0F172A] to-[#1E293B]',
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:40px_40px]" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
        {/* Lock icon */}
        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-semibold mb-2">Materiał zablokowany</h3>
        <p className="text-white/70 text-sm max-w-xs">
          Kup dostęp, aby odblokować ten film i oglądać go przez 30 dni
        </p>
      </div>

      {/* Video title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white font-medium truncate">{video.title}</p>
      </div>
    </div>
  );
}
