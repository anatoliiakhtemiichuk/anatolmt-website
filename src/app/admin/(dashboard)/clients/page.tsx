'use client';

import { useState, useEffect } from 'react';
import { Client, Booking } from '@/types/admin';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  Users,
  Search,
  Phone,
  Mail,
  ChevronRight,
  X,
  Loader2,
  User,
  TrendingUp,
} from 'lucide-react';

export default function ClientsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientBookings, setClientBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClients(
        clients.filter(
          (client) =>
            client.first_name.toLowerCase().includes(query) ||
            client.last_name.toLowerCase().includes(query) ||
            client.email.toLowerCase().includes(query) ||
            client.phone.includes(query)
        )
      );
    }
  }, [searchQuery, clients]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      const result = await response.json();

      if (result.success) {
        // Sort by visit count
        const sorted = result.data.sort((a: Client, b: Client) => b.visit_count - a.visit_count);
        setClients(sorted);
        setFilteredClients(sorted);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openClientDetails = async (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
    setIsLoadingBookings(true);

    try {
      const response = await fetch(`/api/admin/clients/${encodeURIComponent(client.email)}/bookings`);
      const result = await response.json();

      if (result.success) {
        setClientBookings(result.data);
      }
    } catch (error) {
      console.error('Error fetching client bookings:', error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Price is stored in PLN (not grosze) - standardized across all admin pages
  const formatPrice = (pricePln: number) => `${pricePln} zł`;
  const formatTime = (time: string) => time.substring(0, 5);

  const totalClients = clients.length;
  const returningClients = clients.filter((c) => c.visit_count > 1).length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.total_spent, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">Klienci</h1>
        <p className="text-gray-500 mt-1">Lista wszystkich klientów z historią wizyt</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Wszyscy klienci</p>
              <p className="text-2xl font-bold text-[#0F172A]">{totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Powracający</p>
              <p className="text-2xl font-bold text-[#0F172A]">{returningClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Łączny przychód</p>
              <p className="text-2xl font-bold text-[#0F172A]">{formatPrice(totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj klienta..."
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Clients list */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Brak klientów</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Klient</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Kontakt</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Wizyty</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Ostatnia wizyta</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Łącznie</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredClients.map((client) => (
                  <tr key={client.email} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2563EB]/10 rounded-full flex items-center justify-center">
                          <span className="text-[#2563EB] font-medium text-sm">
                            {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-[#0F172A]">
                          {client.first_name} {client.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{client.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{client.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        client.visit_count > 3
                          ? 'bg-green-100 text-green-700'
                          : client.visit_count > 1
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {client.visit_count} {client.visit_count === 1 ? 'wizyta' : client.visit_count < 5 ? 'wizyty' : 'wizyt'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {format(new Date(client.last_visit), 'd MMM yyyy', { locale: pl })}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-[#0F172A]">
                        {formatPrice(client.total_spent)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => openClientDetails(client)}
                        className="flex items-center gap-1 text-[#2563EB] hover:underline text-sm font-medium"
                      >
                        Szczegóły
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-gray-500 text-center">
          Wyświetlono {filteredClients.length} z {clients.length} klientów
        </p>
      )}

      {/* Client details modal */}
      {isModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#0F172A]">Profil klienta</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Client info */}
            <div className="p-6 space-y-6">
              {/* Client header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#2563EB] font-bold text-xl">
                    {selectedClient.first_name.charAt(0)}{selectedClient.last_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A]">
                    {selectedClient.first_name} {selectedClient.last_name}
                  </h3>
                  <p className="text-gray-500">
                    Ostatnia wizyta: {format(new Date(selectedClient.last_visit), 'd MMMM yyyy', { locale: pl })}
                  </p>
                </div>
              </div>

              {/* Contact info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a href={`tel:${selectedClient.phone}`} className="text-[#2563EB] hover:underline">
                    {selectedClient.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${selectedClient.email}`} className="text-[#2563EB] hover:underline">
                    {selectedClient.email}
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-700">{selectedClient.visit_count}</p>
                  <p className="text-sm text-blue-600">wizyt</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-700">{formatPrice(selectedClient.total_spent)}</p>
                  <p className="text-sm text-green-600">łącznie</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-2xl font-bold text-purple-700">{formatPrice(Math.round(selectedClient.total_spent / selectedClient.visit_count))}</p>
                  <p className="text-sm text-purple-600">średnia</p>
                </div>
              </div>

              {/* Visit history */}
              <div>
                <h4 className="font-semibold text-[#0F172A] mb-4">Historia wizyt</h4>

                {isLoadingBookings ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
                  </div>
                ) : clientBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Brak historii wizyt</p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {clientBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className={`p-4 rounded-lg border ${
                          booking.status === 'cancelled'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-white border-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-[#0F172A]">{booking.service_type}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(booking.date), 'd MMMM yyyy', { locale: pl })} o {formatTime(booking.time)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-[#0F172A]">{formatPrice(booking.price_pln)}</p>
                            <p className={`text-sm ${
                              booking.status === 'cancelled' ? 'text-red-600' :
                              booking.status === 'completed' ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {booking.status === 'cancelled' ? 'Anulowana' :
                               booking.status === 'completed' ? 'Zakończona' : 'Potwierdzona'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
