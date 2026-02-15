'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VideoItem, BODY_PARTS } from '@/types/video';
import {
  Video,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
} from 'lucide-react';

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bodyPartFilter, setBodyPartFilter] = useState<string>('');
  const [publishedFilter, setPublishedFilter] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, [searchQuery, bodyPartFilter, publishedFilter]);

  const fetchVideos = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (bodyPartFilter) params.set('bodyPart', bodyPartFilter);
      if (publishedFilter) params.set('isPublished', publishedFilter);

      const response = await fetch(`/api/admin/videos?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setVideos(result.data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten film?')) return;

    setDeleteId(id);
    try {
      const response = await fetch(`/api/admin/videos/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        setVideos(videos.filter(v => v.id !== id));
      } else {
        alert(result.error || 'Wystąpił błąd podczas usuwania');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Wystąpił błąd podczas usuwania');
    } finally {
      setDeleteId(null);
    }
  };

  const togglePublished = async (video: VideoItem) => {
    try {
      const response = await fetch(`/api/admin/videos/${video.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !video.isPublished }),
      });
      const result = await response.json();

      if (result.success) {
        setVideos(videos.map(v =>
          v.id === video.id ? { ...v, isPublished: !v.isPublished } : v
        ));
      }
    } catch (error) {
      console.error('Error toggling published:', error);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Filmy</h1>
          <p className="text-gray-500 mt-1">Zarządzaj materiałami wideo</p>
        </div>
        <Link
          href="/admin/videos/new"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Dodaj film
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj filmów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
            />
          </div>

          {/* Body part filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={bodyPartFilter}
              onChange={(e) => setBodyPartFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none appearance-none bg-white min-w-[150px]"
            >
              <option value="">Wszystkie części</option>
              {BODY_PARTS.map(part => (
                <option key={part} value={part}>{part}</option>
              ))}
            </select>
          </div>

          {/* Published filter */}
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none appearance-none bg-white min-w-[150px]"
          >
            <option value="">Wszystkie statusy</option>
            <option value="true">Opublikowane</option>
            <option value="false">Nieopublikowane</option>
          </select>
        </div>
      </div>

      {/* Videos list */}
      {videos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-[#0F172A] mb-2">Brak filmów</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || bodyPartFilter || publishedFilter
              ? 'Nie znaleziono filmów spełniających kryteria wyszukiwania'
              : 'Dodaj pierwszy film, aby rozpocząć'}
          </p>
          {!searchQuery && !bodyPartFilter && !publishedFilter && (
            <Link
              href="/admin/videos/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Dodaj film
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tytuł</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Część ciała</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Cena</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {videos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-[#0F172A]">{video.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {video.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {video.bodyPart}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#0F172A] font-medium">
                        {video.priceEur.toFixed(2)} EUR
                      </span>
                      {video.includedInPackage && (
                        <span className="ml-2 text-xs text-green-600">w pakiecie</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublished(video)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          video.isPublished
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {video.isPublished ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            Opublikowany
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            Ukryty
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-[#2563EB] transition-colors"
                          title="Otwórz film"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                        <Link
                          href={`/admin/videos/${video.id}/edit`}
                          className="p-2 text-gray-400 hover:text-[#2563EB] transition-colors"
                          title="Edytuj"
                        >
                          <Edit2 className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(video.id)}
                          disabled={deleteId === video.id}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Usuń"
                        >
                          {deleteId === video.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-2xl font-bold text-[#0F172A]">{videos.length}</div>
          <div className="text-sm text-gray-500">Wszystkich filmów</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-2xl font-bold text-green-600">
            {videos.filter(v => v.isPublished).length}
          </div>
          <div className="text-sm text-gray-500">Opublikowanych</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-2xl font-bold text-gray-400">
            {videos.filter(v => !v.isPublished).length}
          </div>
          <div className="text-sm text-gray-500">Ukrytych</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {videos.filter(v => v.includedInPackage).length}
          </div>
          <div className="text-sm text-gray-500">W pakiecie</div>
        </div>
      </div>
    </div>
  );
}
