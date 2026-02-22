import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Instagram } from 'lucide-react';
import { Container } from '@/components/ui';
import { getSiteSettings } from '@/lib/site-settings';
import { DAY_NAMES_PL, DAY_ORDER } from '@/types/site-settings';

// Facebook icon component
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const navigation = {
  main: [
    { name: 'Strona główna', href: '/' },
    { name: 'Rezerwacja', href: '/booking' },
    { name: 'Wideo Pomoc', href: '/video-pomoc' },
    { name: 'Cennik', href: '/prices' },
    { name: 'Kontakt', href: '/contact' },
  ],
};

export async function Footer() {
  const settings = await getSiteSettings();
  const currentYear = new Date().getFullYear();

  // Format opening hours for display
  const formattedHours = DAY_ORDER.map(day => {
    const daySettings = settings.openingHours[day];
    const dayName = DAY_NAMES_PL[day];

    if (daySettings.closed) {
      return { day: dayName, hours: 'Zamknięte', isClosed: true };
    }
    return {
      day: dayName,
      hours: `${daySettings.open} - ${daySettings.close}`,
      isClosed: false,
    };
  });

  // Group similar hours for cleaner display
  interface HoursGroup {
    days: string[];
    hours: string;
    isClosed: boolean;
  }

  const groupedHours: { day: string; hours: string; isClosed: boolean }[] = [];
  let currentGroup: HoursGroup | null = null;

  formattedHours.forEach(({ day, hours, isClosed }) => {
    if (currentGroup && currentGroup.hours === hours) {
      currentGroup.days.push(day);
    } else {
      if (currentGroup) {
        const group = currentGroup;
        groupedHours.push({
          day: group.days.length > 1
            ? `${group.days[0]} - ${group.days[group.days.length - 1]}`
            : group.days[0],
          hours: group.hours,
          isClosed: group.isClosed,
        });
      }
      currentGroup = { days: [day], hours, isClosed };
    }
  });

  // Add the last group
  if (currentGroup) {
    const group = currentGroup as HoursGroup;
    groupedHours.push({
      day: group.days.length > 1
        ? `${group.days[0]} - ${group.days[group.days.length - 1]}`
        : group.days[0],
      hours: group.hours,
      isClosed: group.isClosed,
    });
  }

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
                <span className="font-semibold text-lg">{settings.texts.footerText || 'M&T ANATOL'}</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                {settings.texts.aboutText || 'Profesjonalna terapia manualna i masaż. Indywidualne podejście do każdego pacjenta.'}
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
                {groupedHours.map((item, index) => (
                  <li key={index} className="text-sm">
                    <span className="text-gray-400">{item.day}:</span>
                    <span
                      className={`ml-2 ${
                        item.isClosed
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
                    href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    <Phone className="w-4 h-4 text-[#2563EB]" />
                    {settings.contact.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${settings.contact.email}`}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    <Mail className="w-4 h-4 text-[#2563EB]" />
                    {settings.contact.email}
                  </a>
                </li>
                <li>
                  {settings.contact.googleMapsUrl ? (
                    <a
                      href={settings.contact.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      <MapPin className="w-4 h-4 text-[#2563EB] mt-0.5" />
                      <span>
                        {settings.contact.addressLine1}
                        {settings.contact.addressLine2 && (
                          <>
                            <br />
                            {settings.contact.addressLine2}
                          </>
                        )}
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-start gap-3 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 text-[#2563EB] mt-0.5" />
                      <span>
                        {settings.contact.addressLine1}
                        {settings.contact.addressLine2 && (
                          <>
                            <br />
                            {settings.contact.addressLine2}
                          </>
                        )}
                      </span>
                    </div>
                  )}
                </li>
              </ul>

              {/* Social Media Links */}
              {(settings.contact.instagramUrl || settings.contact.facebookUrl) && (
                <div className="flex gap-3 mt-6">
                  {settings.contact.instagramUrl && (
                    <a
                      href={settings.contact.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-200"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {settings.contact.facebookUrl && (
                    <a
                      href={settings.contact.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[#1877F2] hover:text-white transition-all duration-200"
                      aria-label="Facebook"
                    >
                      <FacebookIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} {settings.texts.footerText || 'M&T ANATOL'}. Wszelkie prawa zastrzeżone.
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
