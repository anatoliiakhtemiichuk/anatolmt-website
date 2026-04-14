import { Metadata } from 'next';
import { Calendar, Clock, ExternalLink } from 'lucide-react';
import { Container, Card, CardContent } from '@/components/ui';

const BOOKSY_URL = 'https://anatolmt.booksy.com/a/';

export const metadata: Metadata = {
  title: 'Cennik',
  description: 'Usługi terapii manualnej i masażu. Sprawdź ofertę i zarezerwuj wizytę przez Booksy.',
};

// Service descriptions (prices managed in Booksy)
const services = [
  {
    id: 'consultation',
    name: 'Konsultacja',
    description: 'Wstępna ocena stanu zdrowia, wywiad i plan terapii.',
  },
  {
    id: 'visit_60',
    name: 'Wizyta standardowa',
    duration: '60 min',
    description: 'Pełna sesja terapii manualnej dostosowana do Twoich potrzeb.',
  },
  {
    id: 'visit_90',
    name: 'Wizyta rozszerzona',
    duration: '90 min',
    description: 'Rozszerzona sesja dla złożonych przypadków wymagających więcej czasu.',
  },
];

export default function PricesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-16 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Usługi</h1>
            <p className="text-lg text-gray-300">
              Profesjonalna terapia manualna dostosowana do Twoich potrzeb.
            </p>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Services List */}
            <div className="space-y-4 mb-12">
              {services.map((service) => (
                <Card key={service.id} variant="bordered">
                  <CardContent>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-[#0F172A]">{service.name}</h3>
                      {service.duration && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full text-[#2563EB] bg-[#2563EB]/10">
                          {service.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Booksy Message */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-[#2563EB]" />
              </div>
              <p className="text-lg text-gray-700 mb-6">
                Aktualny cennik oraz dostępne terminy znajdziesz w Booksy.
              </p>
              <a
                href={BOOKSY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-xl hover:shadow-blue-500/20"
              >
                <Calendar className="w-5 h-5" />
                Zarezerwuj wizytę przez Booksy
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
