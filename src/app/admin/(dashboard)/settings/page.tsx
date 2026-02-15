'use client';

import { useState, useEffect } from 'react';
import { ClinicSettings, DAY_NAMES, DAY_ORDER } from '@/types/settings';
import {
  Settings,
  Clock,
  DollarSign,
  MapPin,
  Save,
  Loader2,
  Check,
  X,
  Phone,
  Mail,
} from 'lucide-react';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'hours' | 'pricing' | 'contact'>('hours');
  const [settings, setSettings] = useState<ClinicSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const result = await response.json();

      if (result.success) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const result = await response.json();

      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(result.error || 'Wystąpił błąd podczas zapisywania');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Wystąpił błąd podczas zapisywania');
    } finally {
      setIsSaving(false);
    }
  };

  const updateOpeningHours = (day: string, field: 'open' | 'close' | 'isClosed', value: string | boolean) => {
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

  const updatePricing = (field: keyof ClinicSettings['pricing'], value: number) => {
    if (!settings) return;

    setSettings({
      ...settings,
      pricing: {
        ...settings.pricing,
        [field]: value,
      },
    });
  };

  const updateContact = (field: keyof ClinicSettings['contact'], value: string) => {
    if (!settings) return;

    setSettings({
      ...settings,
      contact: {
        ...settings.contact,
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
        <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">Nie udało się załadować ustawień</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Ustawienia</h1>
          <p className="text-gray-500 mt-1">Zarządzaj godzinami otwarcia, cenami i kontaktem</p>
        </div>
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

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('hours')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'hours'
                ? 'text-[#2563EB] border-b-2 border-[#2563EB] bg-blue-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-5 h-5" />
            Godziny otwarcia
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'pricing'
                ? 'text-[#2563EB] border-b-2 border-[#2563EB] bg-blue-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            Cennik
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'contact'
                ? 'text-[#2563EB] border-b-2 border-[#2563EB] bg-blue-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-5 h-5" />
            Kontakt
          </button>
        </div>

        <div className="p-6">
          {/* Opening Hours Tab */}
          {activeTab === 'hours' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-6">
                Ustaw godziny otwarcia dla każdego dnia tygodnia. Możesz też oznaczyć dni jako zamknięte.
              </p>

              {DAY_ORDER.map((day) => {
                const daySettings = settings.openingHours[day];
                return (
                  <div
                    key={day}
                    className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border ${
                      daySettings.isClosed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="w-32 font-medium text-[#0F172A]">{DAY_NAMES[day]}</div>

                    <div className="flex items-center gap-4 flex-1">
                      <button
                        onClick={() => updateOpeningHours(day, 'isClosed', !daySettings.isClosed)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          daySettings.isClosed
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {daySettings.isClosed ? (
                          <>
                            <X className="w-4 h-4" />
                            Zamknięte
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Otwarte
                          </>
                        )}
                      </button>

                      {!daySettings.isClosed && (
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
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-8">
              <p className="text-sm text-gray-500 mb-6">
                Ustaw ceny usług w PLN. Konsultacja ma stałą cenę, wizyty mają różne ceny w dni robocze i weekendy.
              </p>

              {/* Consultation */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#0F172A]">Konsultacja</h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="number"
                      value={settings.pricing.consultation}
                      onChange={(e) => updatePricing('consultation', parseInt(e.target.value) || 0)}
                      className="w-32 px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">zł</span>
                  </div>
                  <span className="text-sm text-gray-500">stała cena</span>
                </div>
              </div>

              {/* 1h visit pricing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#0F172A]">Wizyta 1h</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">Dni robocze (Wt-Pt)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={settings.pricing.visit1hWeekday}
                        onChange={(e) => updatePricing('visit1hWeekday', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">zł</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">Weekend (So-Nd)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={settings.pricing.visit1hWeekend}
                        onChange={(e) => updatePricing('visit1hWeekend', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">zł</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1.5h visit pricing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#0F172A]">Wizyta 1.5h</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">Dni robocze (Wt-Pt)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={settings.pricing.visit15hWeekday}
                        onChange={(e) => updatePricing('visit15hWeekday', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">zł</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">Weekend (So-Nd)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={settings.pricing.visit15hWeekend}
                        onChange={(e) => updatePricing('visit15hWeekend', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">zł</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-medium text-[#0F172A] mb-4">Podgląd cennika</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Konsultacja</span>
                    <span className="font-medium">{settings.pricing.consultation} zł</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <p className="text-gray-500 mb-2">Wizyta 1h:</p>
                    <div className="flex justify-between">
                      <span className="text-gray-600 pl-4">Dni robocze</span>
                      <span className="font-medium">{settings.pricing.visit1hWeekday} zł</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 pl-4">Weekend</span>
                      <span className="font-medium">{settings.pricing.visit1hWeekend} zł</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <p className="text-gray-500 mb-2">Wizyta 1.5h:</p>
                    <div className="flex justify-between">
                      <span className="text-gray-600 pl-4">Dni robocze</span>
                      <span className="font-medium">{settings.pricing.visit15hWeekday} zł</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 pl-4">Weekend</span>
                      <span className="font-medium">{settings.pricing.visit15hWeekend} zł</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 mb-6">
                Dane kontaktowe wyświetlane na stronie.
              </p>

              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adres
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={settings.contact.address}
                      onChange={(e) => updateContact('address', e.target.value)}
                      placeholder="ul. Przykładowa 123"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Miasto
                  </label>
                  <input
                    type="text"
                    value={settings.contact.city}
                    onChange={(e) => updateContact('city', e.target.value)}
                    placeholder="Warszawa"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={settings.contact.phone}
                      onChange={(e) => updateContact('phone', e.target.value)}
                      placeholder="+48 123 456 789"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={settings.contact.email}
                      onChange={(e) => updateContact('email', e.target.value)}
                      placeholder="kontakt@example.com"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-xl p-6 mt-8">
                <h4 className="font-medium text-[#0F172A] mb-4">Podgląd</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#0F172A]">{settings.contact.address}</p>
                      <p className="text-gray-500">{settings.contact.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#2563EB]" />
                    <p className="text-[#0F172A]">{settings.contact.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#2563EB]" />
                    <p className="text-[#0F172A]">{settings.contact.email}</p>
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
