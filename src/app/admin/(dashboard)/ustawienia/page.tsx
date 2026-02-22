'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  Clock,
  FileText,
  CreditCard,
  Save,
  Loader2,
  Check,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Instagram,
  Facebook,
  Link as LinkIcon,
} from 'lucide-react';
import type { SiteSettings, Service, OpeningHoursMap } from '@/types/site-settings';
import { DAY_NAMES_PL, DAY_ORDER, DEFAULT_SITE_SETTINGS } from '@/types/site-settings';

type TabId = 'cennik' | 'teksty' | 'godziny' | 'zaliczka';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'cennik', label: 'Cennik', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'teksty', label: 'Teksty strony', icon: <FileText className="w-5 h-5" /> },
  { id: 'godziny', label: 'Godziny i Kontakt', icon: <Clock className="w-5 h-5" /> },
  { id: 'zaliczka', label: 'Zaliczka', icon: <CreditCard className="w-5 h-5" /> },
];

export default function UstawieniaPage() {
  const [activeTab, setActiveTab] = useState<TabId>('cennik');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/site-settings');
      const result = await response.json();
      if (result.success) {
        setSettings(result.data);
      } else {
        setError(result.error || 'Błąd pobierania ustawień');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Nie udało się pobrać ustawień');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (result.success) {
        setSettings(result.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(result.error || 'Błąd zapisywania');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Nie udało się zapisać ustawień');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Czy na pewno chcesz przywrócić domyślne ustawienia? Wszystkie zmiany zostaną utracone.')) {
      setSettings(DEFAULT_SITE_SETTINGS);
    }
  };

  const updateService = (serviceId: string, field: keyof Service, value: unknown) => {
    if (!settings) return;

    setSettings({
      ...settings,
      services: settings.services.map((s) =>
        s.id === serviceId ? { ...s, [field]: value } : s
      ),
    });
  };

  const updateOpeningHours = (day: keyof OpeningHoursMap, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    if (!settings) return;

    setSettings({
      ...settings,
      openingHours: {
        ...settings.openingHours,
        [day]: {
          ...settings.openingHours[day],
          [field]: value,
        },
      },
    });
  };

  const updateContact = (field: keyof SiteSettings['contact'], value: string) => {
    if (!settings) return;

    setSettings({
      ...settings,
      contact: {
        ...settings.contact,
        [field]: value,
      },
    });
  };

  const updateTexts = (field: keyof SiteSettings['texts'], value: string) => {
    if (!settings) return;

    setSettings({
      ...settings,
      texts: {
        ...settings.texts,
        [field]: value,
      },
    });
  };

  const updateBooking = (field: keyof SiteSettings['booking'], value: number) => {
    if (!settings) return;

    setSettings({
      ...settings,
      booking: {
        ...settings.booking,
        [field]: value,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error || 'Nie udało się załadować ustawień'}</p>
        <button
          onClick={fetchSettings}
          className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8]"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Ustawienia strony</h1>
          <p className="text-gray-500 mt-1">Zarządzaj cennikiem, tekstami, godzinami i kontaktem</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Resetuj
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Zapisywanie...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-5 h-5" />
                Zapisano!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Zapisz zmiany
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-[#2563EB] border-b-2 border-[#2563EB] bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Cennik Tab */}
          {activeTab === 'cennik' && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500">
                Edytuj ceny i nazwy usług. Konsultacja ma stałą cenę (brak weekendu).
              </p>

              <div className="space-y-4">
                {settings.services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-5 rounded-xl border ${
                      service.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Service info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={service.name}
                            onChange={(e) => updateService(service.id, 'name', e.target.value)}
                            className="text-lg font-semibold text-[#0F172A] bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#2563EB] focus:outline-none px-1 py-0.5 -ml-1"
                          />
                          {service.id === 'consultation' && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Konsultacja
                            </span>
                          )}
                        </div>
                        <textarea
                          value={service.description}
                          onChange={(e) => updateService(service.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full text-sm text-gray-600 bg-transparent border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
                          placeholder="Opis usługi..."
                        />
                      </div>

                      {/* Pricing */}
                      <div className="flex flex-wrap items-start gap-4">
                        {/* Duration - disabled for consultation */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Czas (min)</label>
                          <input
                            type="number"
                            value={service.durationMinutes}
                            onChange={(e) => updateService(service.id, 'durationMinutes', parseInt(e.target.value) || 0)}
                            disabled={service.id === 'consultation'}
                            className={`w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none ${
                              service.id === 'consultation' ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                          />
                        </div>

                        {/* Weekday price */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Cena (dni rob.)</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={service.priceWeekday}
                              onChange={(e) => updateService(service.id, 'priceWeekday', parseInt(e.target.value) || 0)}
                              className="w-24 px-3 py-2 pr-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">zł</span>
                          </div>
                        </div>

                        {/* Weekend price - disabled for consultation */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Cena (weekend)</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={service.priceWeekend ?? ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateService(service.id, 'priceWeekend', val === '' ? null : parseInt(val) || 0);
                              }}
                              disabled={service.id === 'consultation'}
                              placeholder="—"
                              className={`w-24 px-3 py-2 pr-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none ${
                                service.id === 'consultation' ? 'bg-gray-100 cursor-not-allowed' : ''
                              }`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">zł</span>
                          </div>
                        </div>

                        {/* Active toggle */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Aktywna</label>
                          <button
                            onClick={() => updateService(service.id, 'isActive', !service.isActive)}
                            className={`w-12 h-8 rounded-full transition-colors ${
                              service.isActive ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <div
                              className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                                service.isActive ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-6 mt-8">
                <h4 className="font-medium text-[#0F172A] mb-4">Podgląd cennika</h4>
                <div className="space-y-3 text-sm">
                  {settings.services.filter(s => s.isActive).map((service) => (
                    <div key={service.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                      <div>
                        <span className="font-medium text-[#0F172A]">{service.name}</span>
                        {service.showDuration && (
                          <span className="ml-2 text-gray-500">({service.durationMinutes} min)</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{service.priceWeekday} zł</span>
                        {service.priceWeekend !== null && (
                          <span className="ml-2 text-gray-500">(weekend: {service.priceWeekend} zł)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Teksty Tab */}
          {activeTab === 'teksty' && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500">
                Edytuj teksty wyświetlane na stronie głównej i innych podstronach.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tytuł Hero
                  </label>
                  <input
                    type="text"
                    value={settings.texts.heroTitle}
                    onChange={(e) => updateTexts('heroTitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    placeholder="M&T ANATOL - Profesjonalna Terapia Manualna"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Podtytuł Hero
                  </label>
                  <textarea
                    value={settings.texts.heroSubtitle}
                    onChange={(e) => updateTexts('heroSubtitle', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
                    placeholder="Opis główny strony..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tytuł sekcji "O nas"
                    </label>
                    <input
                      type="text"
                      value={settings.texts.aboutTitle}
                      onChange={(e) => updateTexts('aboutTitle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tekst stopki
                    </label>
                    <input
                      type="text"
                      value={settings.texts.footerText}
                      onChange={(e) => updateTexts('footerText', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tekst sekcji "O nas"
                  </label>
                  <textarea
                    value={settings.texts.aboutText}
                    onChange={(e) => updateTexts('aboutText', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tekst informacyjny przy rezerwacji
                  </label>
                  <textarea
                    value={settings.texts.bookingInfoText}
                    onChange={(e) => updateTexts('bookingInfoText', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Godziny i Kontakt Tab */}
          {activeTab === 'godziny' && (
            <div className="space-y-8">
              {/* Opening Hours */}
              <div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Godziny otwarcia</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Ustaw godziny otwarcia dla każdego dnia tygodnia.
                </p>

                <div className="space-y-3">
                  {DAY_ORDER.map((day) => {
                    const daySettings = settings.openingHours[day];
                    return (
                      <div
                        key={day}
                        className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border ${
                          daySettings.closed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'
                        }`}
                      >
                        <div className="w-28 font-medium text-[#0F172A]">
                          {DAY_NAMES_PL[day]}
                        </div>

                        <div className="flex items-center gap-4 flex-1">
                          <button
                            onClick={() => updateOpeningHours(day, 'closed', !daySettings.closed)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              daySettings.closed
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {daySettings.closed ? 'Zamknięte' : 'Otwarte'}
                          </button>

                          {!daySettings.closed && (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={daySettings.open}
                                onChange={(e) => updateOpeningHours(day, 'open', e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                              />
                              <span className="text-gray-400">—</span>
                              <input
                                type="time"
                                value={daySettings.close}
                                onChange={(e) => updateOpeningHours(day, 'close', e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Dane kontaktowe</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Dane wyświetlane na stronie i w stopce.
                </p>

                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={settings.contact.phone}
                      onChange={(e) => updateContact('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      placeholder="+48 123 456 789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.contact.email}
                      onChange={(e) => updateContact('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      placeholder="kontakt@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Adres - linia 1
                    </label>
                    <input
                      type="text"
                      value={settings.contact.addressLine1}
                      onChange={(e) => updateContact('addressLine1', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      placeholder="ul. Przykładowa 123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adres - linia 2 (miasto/kod)
                    </label>
                    <input
                      type="text"
                      value={settings.contact.addressLine2}
                      onChange={(e) => updateContact('addressLine2', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      placeholder="00-000 Warszawa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <LinkIcon className="w-4 h-4 inline mr-2" />
                      Link do Google Maps (opcjonalnie)
                    </label>
                    <input
                      type="url"
                      value={settings.contact.googleMapsUrl}
                      onChange={(e) => updateContact('googleMapsUrl', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Media społecznościowe</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Linki do profili społecznościowych (opcjonalnie). Gdy podasz link, ikona pojawi się w stopce strony.
                </p>

                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Instagram className="w-4 h-4 inline mr-2" />
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={settings.contact.instagramUrl || ''}
                      onChange={(e) => updateContact('instagramUrl', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      placeholder="https://instagram.com/twoj-profil"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Facebook className="w-4 h-4 inline mr-2" />
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={settings.contact.facebookUrl || ''}
                      onChange={(e) => updateContact('facebookUrl', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      placeholder="https://facebook.com/twoj-profil"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Zaliczka Tab */}
          {activeTab === 'zaliczka' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-amber-800 text-sm">
                  <strong>W przygotowaniu:</strong> System zaliczek i płatności online będzie dostępny wkrótce.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-4">Ustawienia rezerwacji</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Czas przerwy między wizytami (minuty)
                    </label>
                    <p className="text-sm text-gray-500 mb-3">
                      Automatycznie dodawany bufor po każdej wizycie. Nie jest widoczny dla klientów.
                    </p>
                    <div className="relative w-32">
                      <input
                        type="number"
                        value={settings.booking.bufferMinutes}
                        onChange={(e) => updateBooking('bufferMinutes', parseInt(e.target.value) || 0)}
                        min={0}
                        max={60}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">min</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-medium text-[#0F172A] mb-3">Planowane funkcje zaliczki:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        Wymaganie zaliczki przy rezerwacji online
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        Kwota zaliczki (stała lub % ceny)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        Integracja z systemem płatności
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        Automatyczne przypomnienia
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
