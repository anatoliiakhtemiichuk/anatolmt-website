/**
 * Site Configuration - Single Source of Truth
 * All business data for SEO, JSON-LD, and UI
 */

export const siteConfig = {
  // Basic Info
  name: 'Anatol M&T',
  legalName: 'Anatol M&T',
  tagline: 'Masaż terapeutyczny i masaż powięziowy w Warszawie',
  description:
    'Profesjonalny masaż terapeutyczny i masaż powięziowy w Warszawie. Praca z napięciami mięśniowo-powięziowymi, bólem kręgosłupa, regeneracja. Gabinet w Saskiej Kępie.',
  url: 'https://anatolmt.pl',
  locale: 'pl_PL',
  language: 'pl',

  // Contact
  contact: {
    phone: '+48 884 844 191',
    phoneRaw: '+48884844191',
    email: 'anatolmt.kontakt@gmail.com',
  },

  // Location
  address: {
    street: 'Plac Przymierza 2/3',
    postalCode: '03-944',
    city: 'Warszawa',
    district: 'Saska Kępa',
    region: 'Praga Południe',
    country: 'Polska',
    countryCode: 'PL',
    full: 'Plac Przymierza 2/3, 03-944 Warszawa',
  },

  // Geo coordinates (Saska Kępa)
  geo: {
    latitude: 52.2394,
    longitude: 21.0648,
  },

  // Business Hours (ISO 8601 format for schema.org)
  hours: {
    display: [
      { days: 'Poniedziałek', hours: '13:00 - 21:00' },
      { days: 'Wtorek - Czwartek', hours: '11:00 - 22:00' },
      { days: 'Piątek', hours: '11:00 - 21:00' },
      { days: 'Sobota', hours: '10:00 - 16:00' },
      { days: 'Niedziela', hours: '12:00 - 15:00' },
    ],
    schema: [
      { dayOfWeek: 'Monday', opens: '13:00', closes: '21:00' },
      { dayOfWeek: 'Tuesday', opens: '11:00', closes: '22:00' },
      { dayOfWeek: 'Wednesday', opens: '11:00', closes: '22:00' },
      { dayOfWeek: 'Thursday', opens: '11:00', closes: '22:00' },
      { dayOfWeek: 'Friday', opens: '11:00', closes: '21:00' },
      { dayOfWeek: 'Saturday', opens: '10:00', closes: '16:00' },
      { dayOfWeek: 'Sunday', opens: '12:00', closes: '15:00' },
    ],
  },

  // External Links
  links: {
    booksy: 'https://anatolmt.booksy.com/a/',
    googleMaps:
      'https://www.google.com/maps/place/Plac+Przymierza+2%2F3,+03-944+Warszawa',
    instagram: 'https://www.instagram.com/anatolmt/',
  },

  // Services offered
  services: [
    {
      id: 'masaz-powieziowy',
      name: 'Masaż powięziowy',
      shortDescription: 'Praca z napięciami mięśniowymi i ograniczeniami ruchomości',
      description:
        'Profesjonalny masaż powięziowy obejmujący ocenę funkcjonalną, mobilizację tkanek miękkich i pracę z napięciami mięśniowo-powięziowymi. Wspiera przy bólach kręgosłupa, stawów i napięciach mięśniowych.',
      duration: '60-90 min',
      priceFrom: 200,
    },
    {
      id: 'masaz-terapeutyczny',
      name: 'Masaż Terapeutyczny',
      shortDescription: 'Głęboka praca z tkankami miękkimi',
      description:
        'Masaż terapeutyczny skupiony na redukcji napięć mięśniowych, poprawie krążenia i rozluźnieniu punktów spustowych. Wspiera przy przewlekłych dolegliwościach bólowych.',
      duration: '60 min',
      priceFrom: 180,
    },
    {
      id: 'terapia-czaszkowo-krzyzowa',
      name: 'Terapia Czaszkowo-Krzyżowa',
      shortDescription: 'Delikatna praca wspierająca odprężenie',
      description:
        'Subtelna technika wspierająca odprężenie układu nerwowego. Pomaga przy napięciowych bólach głowy, stresie, napięciu emocjonalnym i trudnościach ze snem.',
      duration: '60 min',
      priceFrom: 200,
    },
    {
      id: 'praca-z-twarza',
      name: 'Praca z Twarzą / SSŻ',
      shortDescription: 'Praca z napięciami twarzy i bruksizmem',
      description:
        'Praca z napięciami stawu skroniowo-żuchwowego (SSŻ). Wspiera przy bruksizmie, zgrzytaniu zębami, napięciowych bólach głowy i napięciach mięśni żucia.',
      duration: '45-60 min',
      priceFrom: 180,
    },
    {
      id: 'masaz-liftingujacy',
      name: 'Masaż Liftingujący',
      shortDescription: 'Naturalny lifting twarzy',
      description:
        'Masaż modelujący twarz, poprawiający napięcie skóry i relaksujący mięśnie mimiczne. Efekt odświeżenia i redukcji napięć.',
      duration: '45 min',
      priceFrom: 150,
    },
    {
      id: 'wsparcie-po-urazach',
      name: 'Wsparcie po urazach',
      shortDescription: 'Bezpieczna praca wspierająca powrót do komfortu',
      description:
        'Bezpieczna praca wspierająca powrót do komfortu po kontuzjach sportowych i przeciążeniach. Indywidualne podejście dostosowane do potrzeb.',
      duration: '60-90 min',
      priceFrom: 200,
    },
    {
      id: 'praca-ze-sportowcami',
      name: 'Praca ze Sportowcami',
      shortDescription: 'Wsparcie regeneracji dla aktywnych fizycznie',
      description:
        'Masaż i terapia wspierająca regenerację dla sportowców. Prewencja przeciążeń, poprawa wydolności, szybsza regeneracja po treningach i zawodach.',
      duration: '60-90 min',
      priceFrom: 200,
    },
  ],

  // Conditions we work with (for SEO) - using safe, non-medical terms
  conditions: [
    'Ból kręgosłupa',
    'Ból szyi i karku',
    'Napięcia barku',
    'Dolegliwości towarzyszące rwie kulszowej',
    'Napięcia mięśniowe',
    'Bruksizm',
    'Napięciowe bóle głowy',
    'Przeciążenia sportowe',
    'Ból pleców',
    'Dyskomfort od pracy siedzącej',
  ],

  // Target areas
  areas: [
    'Warszawa',
    'Saska Kępa',
    'Praga Południe',
    'Praga Północ',
    'Gocław',
    'Grochów',
    'Kamionek',
  ],

  // Social proof
  social: {
    rating: 5.0,
    reviewCount: 50,
    platform: 'Google',
  },

  // Owner/Therapist info
  owner: {
    name: 'Anatol',
    title: 'Terapeuta manualny',
    credentials: ['Terapeuta manualny', 'Masażysta'],
  },

  // FAQ for homepage and schema
  faqs: [
    {
      question: 'Jak wygląda pierwsza wizyta?',
      answer:
        'Pierwsza wizyta trwa ok. 60-90 minut. Zaczynamy od dokładnego wywiadu i oceny funkcjonalnej, aby zrozumieć przyczyny dolegliwości. Następnie dobieramy techniki do Twoich potrzeb i wykonujemy zabieg. Na koniec omawiamy zalecenia i ewentualne ćwiczenia do wykonania w domu.',
    },
    {
      question: 'Czy terapia jest bolesna?',
      answer:
        'Praca jest dostosowana do Twojej tolerancji. Niektóre techniki mogą być intensywne, ale zawsze pracujemy w granicach komfortu. Komunikacja jest kluczowa - informuj o swoich odczuciach, a dostosuję intensywność zabiegu.',
    },
    {
      question: 'Ile wizyt potrzebuję?',
      answer:
        'To zależy od problemu. Niektóre dolegliwości ustępują po 1-2 wizytach, przewlekłe napięcia wymagają serii 4-6 spotkań. Po pierwszej wizycie omówimy plan i przewidywaną liczbę sesji.',
    },
    {
      question: 'Jak mogę zarezerwować wizytę?',
      answer:
        'Najwygodniej przez platformę Booksy - możesz wybrać termin 24/7. Możesz też zadzwonić pod numer +48 884 844 191 lub napisać na anatolmt.kontakt@gmail.com.',
    },
    {
      question: 'Czy wystawiacie faktury?',
      answer:
        'Tak, wystawiamy faktury na życzenie. Poinformuj o tym przed wizytą lub przy płatności.',
    },
    {
      question: 'Co zabrać na wizytę?',
      answer:
        'Wygodny strój (np. szorty i t-shirt lub bieliznę). Jeśli masz wyniki badań (RTG, MRI, USG) związane z dolegliwością, weź je ze sobą - mogą pomóc w ocenie.',
    },
  ],
} as const;

// Type exports
export type SiteConfig = typeof siteConfig;
export type Service = (typeof siteConfig.services)[number];
