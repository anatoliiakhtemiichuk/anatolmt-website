export const metadata = {
  title: 'Polityka Prywatności | M&T ANATOL',
  description: 'Polityka prywatności M&T ANATOL - informacje o przetwarzaniu danych osobowych zgodnie z RODO',
};

export default function PolitykaPrywatnosciPage() {
  return (
    <main className="bg-white min-h-screen">
      <article className="max-w-[800px] mx-auto px-6 py-16 lg:py-24">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#111111] mb-4">
            Polityka Prywatności
          </h1>
          <p className="text-[#111111]/60">
            M&T ANATOL — obowiązuje od {new Date().toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* Content */}
        <div className="space-y-0 text-[#111111] leading-relaxed">

          {/* § 1 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 1. Administrator danych</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Administratorem danych osobowych jest M&T ANATOL z siedzibą w Warszawie.</li>
              <li>Kontakt w sprawach ochrony danych: kontakt@mt-anatol.pl</li>
            </ol>
          </section>

          {/* § 2 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 2. Zakres zbieranych danych</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Dane podawane przez użytkownika:
                <ul className="list-disc list-outside ml-6 mt-2 space-y-1">
                  <li>imię i nazwisko</li>
                  <li>adres e-mail</li>
                  <li>numer telefonu</li>
                  <li>uwagi do rezerwacji</li>
                </ul>
              </li>
              <li>Dane zbierane automatycznie:
                <ul className="list-disc list-outside ml-6 mt-2 space-y-1">
                  <li>adres IP</li>
                  <li>typ przeglądarki i urządzenia</li>
                  <li>pliki cookies</li>
                </ul>
              </li>
              <li>Nie zbieramy danych wrażliwych (medycznych) przez stronę internetową.</li>
            </ol>
          </section>

          {/* § 3 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 3. Cele i podstawy prawne przetwarzania</h2>
            <div className="space-y-6">
              <div>
                <p className="font-bold mb-2">Realizacja usług</p>
                <p>Rezerwacja wizyt, świadczenie usług, obsługa zakupów.</p>
                <p className="text-[#111111]/60 text-sm mt-1">Podstawa: art. 6 ust. 1 lit. b RODO (wykonanie umowy)</p>
              </div>
              <div>
                <p className="font-bold mb-2">Obowiązki prawne</p>
                <p>Dokumentacja księgowa, rozliczenia podatkowe.</p>
                <p className="text-[#111111]/60 text-sm mt-1">Podstawa: art. 6 ust. 1 lit. c RODO (obowiązek prawny)</p>
              </div>
              <div>
                <p className="font-bold mb-2">Kontakt i komunikacja</p>
                <p>Potwierdzenia rezerwacji, przypomnienia, odpowiedzi na zapytania.</p>
                <p className="text-[#111111]/60 text-sm mt-1">Podstawa: art. 6 ust. 1 lit. b RODO (wykonanie umowy)</p>
              </div>
              <div>
                <p className="font-bold mb-2">Analiza i ulepszanie usług</p>
                <p>Analiza korzystania ze strony, poprawa jakości.</p>
                <p className="text-[#111111]/60 text-sm mt-1">Podstawa: art. 6 ust. 1 lit. f RODO (uzasadniony interes administratora)</p>
              </div>
            </div>
          </section>

          {/* § 4 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 4. Odbiorcy danych</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Dostawcy usług IT (hosting, poczta, systemy rezerwacji)</li>
              <li>Operatorzy płatności (Stripe)</li>
              <li>Organy publiczne (w przypadkach przewidzianych prawem)</li>
              <li>Nie sprzedajemy danych osobowych podmiotom trzecim.</li>
            </ol>
          </section>

          {/* § 5 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 5. Okres przechowywania</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Dane rezerwacyjne: przez okres realizacji usługi + 5 lat (wymogi podatkowe)</li>
              <li>Dane kontaktowe: do wycofania zgody lub zakończenia współpracy</li>
              <li>Dane analityczne: 26 miesięcy</li>
            </ol>
          </section>

          {/* § 6 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 6. Prawa użytkownika</h2>
            <p className="mb-4">Zgodnie z RODO przysługują Ci następujące prawa:</p>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li><strong>Prawo dostępu</strong> — uzyskanie informacji o przetwarzanych danych</li>
              <li><strong>Prawo do sprostowania</strong> — poprawienie nieprawidłowych danych</li>
              <li><strong>Prawo do usunięcia</strong> — żądanie usunięcia danych</li>
              <li><strong>Prawo do ograniczenia</strong> — ograniczenie przetwarzania</li>
              <li><strong>Prawo do przenoszenia</strong> — otrzymanie danych w ustrukturyzowanym formacie</li>
              <li><strong>Prawo do sprzeciwu</strong> — sprzeciw wobec przetwarzania</li>
            </ol>
            <p className="mt-6">Kontakt: kontakt@mt-anatol.pl</p>
            <p className="mt-2">Prawo wniesienia skargi do PUODO (Prezes Urzędu Ochrony Danych Osobowych).</p>
          </section>

          {/* § 7 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 7. Pliki cookies</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Strona wykorzystuje pliki cookies do prawidłowego działania i analizy ruchu.</li>
              <li>Rodzaje cookies:
                <ul className="list-disc list-outside ml-6 mt-2 space-y-1">
                  <li>Niezbędne — wymagane do działania strony</li>
                  <li>Analityczne — analiza sposobu korzystania ze strony</li>
                </ul>
              </li>
              <li>Zarządzanie cookies możliwe w ustawieniach przeglądarki.</li>
            </ol>
          </section>

          {/* § 8 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 8. Bezpieczeństwo</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Stosujemy środki techniczne i organizacyjne chroniące dane:
                <ul className="list-disc list-outside ml-6 mt-2 space-y-1">
                  <li>szyfrowanie połączenia (SSL/TLS)</li>
                  <li>bezpieczne przechowywanie danych</li>
                  <li>ograniczony dostęp dla upoważnionych osób</li>
                </ul>
              </li>
            </ol>
          </section>

          {/* § 9 */}
          <section className="py-8">
            <h2 className="text-xl font-bold mb-6">§ 9. Zmiany polityki</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Zastrzegamy prawo do aktualizacji Polityki Prywatności.</li>
              <li>O zmianach informujemy poprzez publikację nowej wersji na stronie.</li>
            </ol>
          </section>

        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[#e5e5e5] text-[#111111]/50 text-sm">
          <p>M&T ANATOL</p>
          <p>Kontakt: kontakt@mt-anatol.pl</p>
        </footer>
      </article>
    </main>
  );
}
