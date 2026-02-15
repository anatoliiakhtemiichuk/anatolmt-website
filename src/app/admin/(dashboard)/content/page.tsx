'use client';

import { useState, useEffect } from 'react';
import { PageText } from '@/types/video';
import {
  FileText,
  Save,
  Loader2,
  Check,
  Edit2,
  X,
} from 'lucide-react';

export default function ContentPage() {
  const [pageTexts, setPageTexts] = useState<PageText[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '', content: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchPageTexts();
  }, []);

  const fetchPageTexts = async () => {
    try {
      const response = await fetch('/api/admin/content');
      const result = await response.json();

      if (result.success) {
        setPageTexts(result.data);
      }
    } catch (error) {
      console.error('Error fetching page texts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (pageText: PageText) => {
    setEditingKey(pageText.key);
    setEditData({ title: pageText.title, content: pageText.content });
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setEditData({ title: '', content: '' });
  };

  const saveChanges = async () => {
    if (!editingKey) return;

    setIsSaving(true);
    setSaveSuccess(null);

    try {
      const response = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: editingKey,
          ...editData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPageTexts(pageTexts.map(pt =>
          pt.key === editingKey ? { ...pt, ...editData, updatedAt: result.data.updatedAt } : pt
        ));
        setSaveSuccess(editingKey);
        setEditingKey(null);
        setEditData({ title: '', content: '' });
        setTimeout(() => setSaveSuccess(null), 3000);
      } else {
        alert(result.error || 'Wystąpił błąd podczas zapisywania');
      }
    } catch (error) {
      console.error('Error saving page text:', error);
      alert('Wystąpił błąd podczas zapisywania');
    } finally {
      setIsSaving(false);
    }
  };

  const getKeyLabel = (key: string): string => {
    const labels: Record<string, string> = {
      'video_help_intro': 'Wprowadzenie',
      'video_help_disclaimer': 'Zastrzeżenie',
      'video_help_package': 'Pakiet Wideo',
    };
    return labels[key] || key;
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
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Treści strony</h1>
        <p className="text-gray-500 mt-1">Zarządzaj tekstami wyświetlanymi na stronie Wideo Pomoc</p>
      </div>

      {/* Page texts list */}
      <div className="space-y-4">
        {pageTexts.map((pageText) => (
          <div
            key={pageText.key}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-[#0F172A]">{getKeyLabel(pageText.key)}</h3>
                  <p className="text-xs text-gray-500">Klucz: {pageText.key}</p>
                </div>
              </div>
              {editingKey !== pageText.key && (
                <button
                  onClick={() => startEditing(pageText)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edytuj
                </button>
              )}
              {saveSuccess === pageText.key && (
                <span className="inline-flex items-center gap-1.5 text-green-600 text-sm">
                  <Check className="w-4 h-4" />
                  Zapisano
                </span>
              )}
            </div>

            <div className="p-6">
              {editingKey === pageText.key ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tytuł
                    </label>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Treść
                    </label>
                    <textarea
                      value={editData.content}
                      onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={cancelEditing}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
                    >
                      <X className="w-4 h-4" />
                      Anuluj
                    </button>
                    <button
                      onClick={saveChanges}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Zapisywanie...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Zapisz
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium text-[#0F172A] mb-2">{pageText.title}</h4>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{pageText.content}</p>
                  <p className="text-xs text-gray-400 mt-4">
                    Ostatnia aktualizacja: {new Date(pageText.updatedAt).toLocaleString('pl-PL')}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h4 className="font-medium text-[#0F172A] mb-2">Informacja</h4>
        <p className="text-sm text-gray-600">
          Zmiany wprowadzone w tekstach zostaną natychmiast wyświetlone na stronie Wideo Pomoc.
          Upewnij się, że treść jest poprawna przed zapisaniem.
        </p>
      </div>
    </div>
  );
}
