/**
 * Video Data
 * Static video data for development and fallback
 * In production, this data comes from Supabase
 */

import { Video, VideoCategory } from '@/types/video';

// ============================================
// VIDEO CATEGORIES
// ============================================

export const VIDEO_CATEGORIES: VideoCategory[] = [
  {
    id: '1',
    name: 'Kręgosłup szyjny',
    slug: 'kregoslup-szyjny',
    description: 'Ćwiczenia na odcinek szyjny kręgosłupa - mobilizacja, rozciąganie, wzmacnianie',
    icon: 'activity',
    sort_order: 1,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Odcinek piersiowy',
    slug: 'odcinek-piersiowy',
    description: 'Ćwiczenia na odcinek piersiowy kręgosłupa - poprawa postawy i oddychania',
    icon: 'heart',
    sort_order: 2,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Odcinek lędźwiowy',
    slug: 'odcinek-ledźwiowy',
    description: 'Ćwiczenia na odcinek lędźwiowy - stabilizacja i redukcja bólu',
    icon: 'move',
    sort_order: 3,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Bark',
    slug: 'bark',
    description: 'Ćwiczenia na staw barkowy - mobilność i stabilizacja',
    icon: 'hand',
    sort_order: 4,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Biodro',
    slug: 'biodro',
    description: 'Ćwiczenia na staw biodrowy - rozciąganie i wzmacnianie',
    icon: 'footprints',
    sort_order: 5,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Kolano',
    slug: 'kolano',
    description: 'Ćwiczenia na staw kolanowy - wsparcie i profilaktyka',
    icon: 'circle-dot',
    sort_order: 6,
    active: true,
    created_at: new Date().toISOString(),
  },
];

// ============================================
// VIDEOS
// ============================================

export const VIDEOS: Video[] = [
  // Kręgosłup szyjny
  {
    id: 'v1',
    title: 'Mobilizacja odcinka szyjnego',
    slug: 'mobilizacja-szyjnego',
    category: 'kregoslup-szyjny',
    description: 'Delikatne ćwiczenie mobilizujące kręgosłup szyjny, idealne na początek dnia. Pomaga zmniejszyć napięcie i poprawić zakres ruchu.',
    when_to_do: 'Wykonuj rano po przebudzeniu lub po długim siedzeniu przy komputerze. Najlepiej 2-3 razy dziennie po 5 powtórzeń.',
    when_not_to_do: 'Nie wykonuj przy ostrym bólu, zawrotach głowy, po urazie głowy lub szyi, przy podejrzeniu uszkodzenia kręgosłupa.',
    embed_url: 'https://player.vimeo.com/video/placeholder1',
    thumbnail_url: null,
    duration_seconds: 180,
    sort_order: 1,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'v2',
    title: 'Rozciąganie mięśni karku',
    slug: 'rozciaganie-karku',
    category: 'kregoslup-szyjny',
    description: 'Rozciąganie bocznych mięśni szyi dla redukcji napięcia. Idealne dla osób pracujących przy komputerze.',
    when_to_do: 'Po długiej pracy przy biurku, przed snem dla rozluźnienia. Utrzymuj rozciąganie przez 30 sekund na każdą stronę.',
    when_not_to_do: 'Przy zawrotach głowy, ostrym bólu promieniującym do ramion, drętwienie rąk.',
    embed_url: 'https://player.vimeo.com/video/placeholder2',
    thumbnail_url: null,
    duration_seconds: 150,
    sort_order: 2,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Odcinek piersiowy
  {
    id: 'v3',
    title: 'Mobilizacja klatki piersiowej',
    slug: 'mobilizacja-klatki',
    category: 'odcinek-piersiowy',
    description: 'Ćwiczenie poprawiające ruchomość odcinka piersiowego. Pomaga w utrzymaniu prawidłowej postawy.',
    when_to_do: 'Rano lub po długim siedzeniu. Świetne przed ćwiczeniami siłowymi.',
    when_not_to_do: 'Przy świeżych urazach żeber, silnym bólu w klatce piersiowej, problemach z sercem.',
    embed_url: 'https://player.vimeo.com/video/placeholder3',
    thumbnail_url: null,
    duration_seconds: 200,
    sort_order: 1,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'v4',
    title: 'Rozciąganie mięśni międzyżebrowych',
    slug: 'rozciaganie-miedzyzebrowych',
    category: 'odcinek-piersiowy',
    description: 'Głębokie rozciąganie poprawiające oddychanie. Pomaga przy uczuciu "ciasnej" klatki piersiowej.',
    when_to_do: 'Po przebudzeniu, przy uczuciu sztywności w klatce piersiowej, przed medytacją.',
    when_not_to_do: 'Przy ostrym bólu przy oddychaniu, świeżych urazach, problemach z przepukliną.',
    embed_url: 'https://player.vimeo.com/video/placeholder4',
    thumbnail_url: null,
    duration_seconds: 180,
    sort_order: 2,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Odcinek lędźwiowy
  {
    id: 'v5',
    title: 'Stabilizacja lędźwiowa',
    slug: 'stabilizacja-ledźwiowa',
    category: 'odcinek-ledźwiowy',
    description: 'Podstawowe ćwiczenie stabilizujące dolny odcinek kręgosłupa. Fundament zdrowych pleców.',
    when_to_do: 'Codziennie rano i wieczorem. Kluczowe przy pracy siedzącej. 10-15 powtórzeń.',
    when_not_to_do: 'Przy ostrym bólu rwy kulszowej, wypadnięciu dysku, bezpośrednio po zabiegu.',
    embed_url: 'https://player.vimeo.com/video/placeholder5',
    thumbnail_url: null,
    duration_seconds: 240,
    sort_order: 1,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'v6',
    title: 'Rozciąganie mięśni biodrowo-lędźwiowych',
    slug: 'rozciaganie-biodrowo-ledźwiowych',
    category: 'odcinek-ledźwiowy',
    description: 'Ćwiczenie na skrócone zginacze biodra. Kluczowe dla osób siedzących przez wiele godzin.',
    when_to_do: 'Po długim siedzeniu, przed i po aktywności fizycznej. Utrzymuj 30-60 sekund.',
    when_not_to_do: 'Przy ostrym bólu biodra lub pachwiny, po endoprotezie.',
    embed_url: 'https://player.vimeo.com/video/placeholder6',
    thumbnail_url: null,
    duration_seconds: 200,
    sort_order: 2,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Bark
  {
    id: 'v7',
    title: 'Mobilizacja stawu barkowego',
    slug: 'mobilizacja-barku',
    category: 'bark',
    description: 'Ćwiczenie przywracające pełen zakres ruchu w barku. Idealne przy sztywności stawu.',
    when_to_do: 'Rano, przed treningiem, po długim siedzeniu. 10 powtórzeń w każdym kierunku.',
    when_not_to_do: 'Przy świeżym urazie barku, zwichnięciu, silnym bólu, zapaleniu.',
    embed_url: 'https://player.vimeo.com/video/placeholder7',
    thumbnail_url: null,
    duration_seconds: 210,
    sort_order: 1,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'v8',
    title: 'Wzmacnianie rotatorów barku',
    slug: 'wzmacnianie-rotatorow',
    category: 'bark',
    description: 'Ćwiczenie wzmacniające mięśnie stabilizujące bark. Profilaktyka urazów.',
    when_to_do: 'Co drugi dzień, jako część rutyny ćwiczeniowej. Użyj lekkiej gumy oporowej.',
    when_not_to_do: 'Przy zapaleniu ścięgien, bezpośrednio po urazie, przy bólu podczas ruchu.',
    embed_url: 'https://player.vimeo.com/video/placeholder8',
    thumbnail_url: null,
    duration_seconds: 300,
    sort_order: 2,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Biodro
  {
    id: 'v9',
    title: 'Mobilizacja stawu biodrowego',
    slug: 'mobilizacja-biodra',
    category: 'biodro',
    description: 'Ćwiczenie poprawiające ruchomość w stawie biodrowym. Podstawa zdrowego chodu.',
    when_to_do: 'Codziennie, szczególnie przy siedzącym trybie życia. 10-15 powtórzeń na nogę.',
    when_not_to_do: 'Przy ostrym bólu w pachwinie, po endoprotezie (bez konsultacji), przy zapaleniu.',
    embed_url: 'https://player.vimeo.com/video/placeholder9',
    thumbnail_url: null,
    duration_seconds: 220,
    sort_order: 1,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'v10',
    title: 'Rozciąganie mięśni pośladkowych',
    slug: 'rozciaganie-posladkow',
    category: 'biodro',
    description: 'Ćwiczenie na napięte mięśnie pośladkowe. Pomaga przy bólu dolnych pleców.',
    when_to_do: 'Po długim siedzeniu, przed i po bieganiu. Utrzymuj 30-60 sekund.',
    when_not_to_do: 'Przy ostrym bólu rwy kulszowej, drętwieniu nogi.',
    embed_url: 'https://player.vimeo.com/video/placeholder10',
    thumbnail_url: null,
    duration_seconds: 180,
    sort_order: 2,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Kolano
  {
    id: 'v11',
    title: 'Mobilizacja rzepki',
    slug: 'mobilizacja-rzepki',
    category: 'kolano',
    description: 'Delikatna mobilizacja poprawiająca ruch rzepki. Pomaga przy "chrupaniu" w kolanie.',
    when_to_do: 'Przed aktywnością fizyczną, przy sztywności kolana. 2-3 minuty na kolano.',
    when_not_to_do: 'Przy świeżym urazie kolana, obrzęku, niestabilności, po operacji.',
    embed_url: 'https://player.vimeo.com/video/placeholder11',
    thumbnail_url: null,
    duration_seconds: 150,
    sort_order: 1,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'v12',
    title: 'Wzmacnianie mięśnia czworogłowego',
    slug: 'wzmacnianie-czworoglowego',
    category: 'kolano',
    description: 'Ćwiczenie wzmacniające przednią część uda. Kluczowe dla stabilności kolana.',
    when_to_do: 'Co drugi dzień, jako wsparcie w powrocie do sprawności kolana. 3 serie po 15 powtórzeń.',
    when_not_to_do: 'Przy ostrym bólu kolana, bezpośrednio po urazie, przy zapaleniu.',
    embed_url: 'https://player.vimeo.com/video/placeholder12',
    thumbnail_url: null,
    duration_seconds: 280,
    sort_order: 2,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get videos by category slug
 */
export function getVideosByCategory(categorySlug: string): Video[] {
  return VIDEOS.filter(v => v.category === categorySlug && v.active);
}

/**
 * Get video by slug
 */
export function getVideoBySlug(slug: string): Video | undefined {
  return VIDEOS.find(v => v.slug === slug && v.active);
}

/**
 * Get category by slug
 */
export function getCategoryBySlug(slug: string): VideoCategory | undefined {
  return VIDEO_CATEGORIES.find(c => c.slug === slug && c.active);
}

/**
 * Get video count per category
 */
export function getVideoCountByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const category of VIDEO_CATEGORIES) {
    counts[category.slug] = VIDEOS.filter(
      v => v.category === category.slug && v.active
    ).length;
  }
  return counts;
}

/**
 * Get all active videos
 */
export function getAllActiveVideos(): Video[] {
  return VIDEOS.filter(v => v.active);
}

/**
 * Get total video count
 */
export function getTotalVideoCount(): number {
  return VIDEOS.filter(v => v.active).length;
}

/**
 * Format duration in mm:ss
 */
export function formatDuration(seconds: number | null): string {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
