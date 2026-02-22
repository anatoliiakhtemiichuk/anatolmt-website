'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { VideoItem, BODY_PARTS, BodyPart } from '@/types/video';
import {
  ArrowLeft,
  Save,
  Loader2,
  Video,
  FileText,
  Euro,
  Clock,
  Image,
  Link as LinkIcon,
} from 'lucide-react';

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    bodyPart: BodyPart;
    durationMin: string;
    priceEur: string;
    includedInPackage: boolean;
    videoUrl: string;
    thumbnailUrl: string;
    isPublished: boolean;
  }>({
    title: '',
    description: '',
    bodyPart: BODY_PARTS[0],
    durationMin: '',
    priceEur: '',
    includedInPackage: false,
    videoUrl: '',
    thumbnailUrl: '',
    isPublished: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      const response = await fetch(`/api/admin/videos/${videoId}`);
      const result = await response.json();

      if (result.success && result.data) {
        const video: VideoItem = result.data;
        setFormData({
          title: video.title,
          description: video.description,
          bodyPart: video.bodyPart as BodyPart,
          durationMin: video.durationMin?.toString() || '',
          priceEur: video.priceEur.toString(),
          includedInPackage: video.includedInPackage,
          videoUrl: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl || '',
          isPublished: video.isPublished,
        });
      } else {
        router.push('/admin/videos');
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      router.push('/admin/videos');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tytuł jest wymagany';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Opis jest wymagany';
    }
    if (!formData.priceEur || parseFloat(formData.priceEur) < 0) {
      newErrors.priceEur = 'Podaj prawidłową cenę';
    }
    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'URL filmu jest wymagany';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          priceEur: parseFloat(formData.priceEur),
          durationMin: formData.durationMin ? parseInt(formData.durationMin) : undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/admin/videos');
      } else {
        alert(result.error || 'Wystąpił błąd podczas zapisywania');
      }
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Wystąpił błąd podczas zapisywania');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/videos"
          className="p-2 text-gray-400 hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Edytuj film</h1>
          <p className="text-gray-500 mt-1">Zmień dane materiału wideo</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Tytuł
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="np. Ćwiczenia na kark - poziom podstawowy"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none ${
                errors.title ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Opis
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Szczegółowy opis materiału wideo..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Body Part */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Video className="w-4 h-4" />
              Część ciała
            </label>
            <select
              value={formData.bodyPart}
              onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value as BodyPart })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none appearance-none bg-white"
            >
              {BODY_PARTS.map(part => (
                <option key={part} value={part}>{part}</option>
              ))}
            </select>
          </div>

          {/* Duration and Price row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                Czas trwania (minuty)
              </label>
              <input
                type="number"
                value={formData.durationMin}
                onChange={(e) => setFormData({ ...formData, durationMin: e.target.value })}
                placeholder="np. 15"
                min="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Euro className="w-4 h-4" />
                Cena (EUR)
              </label>
              <input
                type="number"
                value={formData.priceEur}
                onChange={(e) => setFormData({ ...formData, priceEur: e.target.value })}
                placeholder="np. 9.99"
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none ${
                  errors.priceEur ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.priceEur && (
                <p className="text-red-500 text-sm mt-1">{errors.priceEur}</p>
              )}
            </div>
          </div>

          {/* Video URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <LinkIcon className="w-4 h-4" />
              URL filmu
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none ${
                errors.videoUrl ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errors.videoUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.videoUrl}</p>
            )}
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Image className="w-4 h-4" />
              URL miniaturki (opcjonalnie)
            </label>
            <input
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.includedInPackage}
                onChange={(e) => setFormData({ ...formData, includedInPackage: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
              />
              <span className="text-sm text-gray-700">Dostępny w pakiecie</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
              />
              <span className="text-sm text-gray-700">Opublikowany</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/videos"
            className="px-6 py-2.5 text-gray-600 hover:text-gray-800 transition-colors font-medium"
          >
            Anuluj
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Zapisywanie...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Zapisz zmiany
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
