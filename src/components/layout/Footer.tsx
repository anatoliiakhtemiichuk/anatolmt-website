import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Container } from '@/components/ui';

const navigation = {
  main: [
    { name: 'Strona główna', href: '/' },
    { name: 'Rezerwacja', href: '/booking' },
    { name: 'AI Konsultacja', href: '/ai' },
    { name: 'Cennik', href: '/prices' },
    { name: 'Kontakt', href: '/contact' },
  ],
};

const openingHours = [
  { day: 'Poniedziałek', hours: 'Zamknięte' },
  { day: 'Wtorek - Piątek', hours: '11:00 - 22:00' },
  { day: 'Sobota', hours: '10:00 - 18:00' },
  { day: 'Niedziela', hours: '11:00 - 15:00' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F172A] text-white">
      <Container>
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M&T</span>
                </div>
                <span className="font-semibold text-lg">M&T ANATOL</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Profesjonalna terapia manualna i masaż leczniczy.
                Indywidualne podejście do każdego pacjenta.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
                Nawigacja
              </h3>
              <ul className="space-y-3">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opening Hours */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                Godziny otwarcia
              </h3>
              <ul className="space-y-2">
                {openingHours.map((item) => (
                  <li key={item.day} className="text-sm">
                    <span className="text-gray-400">{item.day}:</span>
                    <span
                      className={`ml-2 ${
                        item.hours === 'Zamknięte'
                          ? 'text-red-400'
                          : 'text-white'
                      }`}
                    >
                      {item.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
                Kontakt
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:+48123456789"
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    <Phone className="w-4 h-4 text-[#2563EB]" />
                    +48 123 456 789
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:kontakt@mt-anatol.pl"
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    <Mail className="w-4 h-4 text-[#2563EB]" />
                    kontakt@mt-anatol.pl
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-3 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 text-[#2563EB] mt-0.5" />
                    <span>
                      ul. Przykładowa 123<br />
                      00-000 Warszawa
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} M&T ANATOL. Wszelkie prawa zastrzeżone.
            </p>
            <div className="flex gap-6">
              <Link
                href="/polityka-prywatnosci"
                className="text-gray-500 hover:text-white transition-colors duration-200 text-sm"
              >
                Polityka prywatności
              </Link>
              <Link
                href="/regulamin"
                className="text-gray-500 hover:text-white transition-colors duration-200 text-sm"
              >
                Regulamin
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
