# anatolmt.pl - kontekst projektu

Strona gabinetu Anatola Akhtemiichuka (M&T Anatol) - terapeuta manualny / masażysta, Warszawa. Stack: Next.js (App Router), Supabase, Resend, Stripe, Vercel. Repo: github.com/anatoliiakhtemiichuk/anatolmt-website.

## Workflow
- Zawsze nowa gałąź feature/... lub fix/... -> push -> Vercel preview -> merge do main dopiero po mojej akceptacji.
- Nigdy nie merguj do main bez wyraźnej prośby.
- Przed instalacją nowej zależności zapytaj.
- Tryb ponytail: YAGNI, wykorzystuj to, co już jest w projekcie, najkrótszy działający diff, bez upraszczania walidacji, bezpieczeństwa i dostępności.
- Po zmianach: npm run build bez błędów.
- Nie commituj package-lock.json, jeśli zmienił się tylko przez inną wersję npm.

## Dane firmy (jedno źródło prawdy)
- Adres: ul. gen. Bronisława Bohaterewicza 1A, 03-982 Warszawa (Gocław, Praga-Południe), w studiu Body Forge.
- Stary adres Plac Przymierza / Saska Kępa jest NIEAKTUALNY - nie używać.
- Telefon: 884 844 191. Rezerwacje: Booksy https://anatolmt.booksy.com
- Własny system rezerwacji i czat AI na stronie są wyłączone.

## Zasady prawne i językowe (nie jestem fizjoterapeutą, brak PWZ)
- Nigdy: fizjoterapia, fizjoterapeuta, leczenie, rehabilitacja, masaż leczniczy, pacjent.
- Zawsze: "klient", o sobie "terapeuta manualny / masażysta".
- Bez obietnic efektów zdrowotnych. Diagnozę stawia lekarz.
- Teksty dla klientów po polsku, tylko pojedynczy myślnik (-), nigdy długi myślnik.

## Blog
- Artykuły MDX w content/blog/ (frontmatter: title, description, date, slug, opcjonalnie image).
- Artykuły medyczne nie są publikowane bez sprawdzenia przez prawnika.

## Otwarte zadania
- SEO/GEO: audyt JSON-LD, llms.txt, spójność adresu.
- Supabase: RLS wyłączony na public.services i public.site_settings - do naprawy przez migrację SQL (najpierw sprawdzić, jak kod czyta te tabele).
- Google Search Console: weryfikacja domeny przez TXT w OVH, potem sitemap.
