export const metadata = {
  title: 'Regulamin | M&T ANATOL',
  description: 'Regulamin świadczenia usług M&T ANATOL - terapia manualna i masaż leczniczy',
};

export default function RegulaminPage() {
  return (
    <main className="bg-white min-h-screen">
      <article className="max-w-[800px] mx-auto px-6 py-16 lg:py-24">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#111111] mb-4">
            Regulamin świadczenia usług
          </h1>
          <p className="text-[#111111]/60">
            M&T ANATOL — obowiązuje od {new Date().toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {/* Content */}
        <div className="space-y-0 text-[#111111] leading-relaxed">

          {/* § 1 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 1. Postanowienia ogólne</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Niniejszy Regulamin określa zasady korzystania z usług świadczonych przez M&T ANATOL (dalej: „Usługodawca") w zakresie terapii manualnej, masażu leczniczego oraz materiałów edukacyjnych wideo.</li>
              <li>Usługodawca prowadzi działalność w zakresie fizjoterapii, terapii manualnej i masażu leczniczego, oferując usługi stacjonarne oraz cyfrowe materiały edukacyjne.</li>
              <li>Korzystanie z usług Usługodawcy oznacza akceptację niniejszego Regulaminu.</li>
            </ol>
          </section>

          {/* § 2 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 2. Rezerwacja wizyt</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Rezerwacji można dokonać poprzez formularz dostępny na stronie internetowej. Rezerwacja wymaga podania danych kontaktowych: imienia, nazwiska, numeru telefonu i adresu e-mail.</li>
              <li>Po dokonaniu rezerwacji Klient otrzymuje potwierdzenie na podany adres e-mail. Rezerwacja jest ważna po otrzymaniu potwierdzenia.</li>
              <li>Klient może bezpłatnie odwołać lub zmienić termin wizyty najpóźniej 24 godziny przed umówionym terminem. W przypadku odwołania w krótszym terminie lub niestawienia się na wizytę, Usługodawca zastrzega sobie prawo do pobrania opłaty w wysokości 50% ceny usługi.</li>
              <li>Usługodawca zastrzega sobie prawo do odwołania wizyty z przyczyn niezależnych, o czym Klient zostanie poinformowany niezwłocznie. W takim przypadku Klient ma prawo do ustalenia nowego terminu lub zwrotu wpłaconej zaliczki.</li>
              <li>W przypadku niestawienia się Klienta na umówioną wizytę bez wcześniejszego odwołania, Usługodawca zastrzega sobie prawo do odmowy przyjęcia kolejnej rezerwacji od tego Klienta bez uprzedniego uiszczenia przedpłaty w wysokości 100% ceny usługi.</li>
            </ol>
          </section>

          {/* § 3 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 3. Usługi stacjonarne</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Usługi terapii manualnej i masażu są świadczone przez wykwalifikowanych specjalistów w gabinecie Usługodawcy.</li>
              <li>Klient zobowiązany jest do poinformowania terapeuty o wszelkich przeciwwskazaniach zdrowotnych, urazach, chorobach przewlekłych oraz przyjmowanych lekach przed rozpoczęciem zabiegu.</li>
              <li>Usługodawca nie ponosi odpowiedzialności za skutki zatajenia informacji o stanie zdrowia przez Klienta. Klient ponosi pełną odpowiedzialność za zatajenie istotnych informacji o stanie zdrowia.</li>
              <li>Usługodawca zastrzega sobie prawo do odmowy wykonania usługi, jeżeli stwierdzi istnienie przeciwwskazań zdrowotnych lub innych okoliczności mogących zagrozić zdrowiu Klienta.</li>
              <li>Usługi świadczone przez Usługodawcę nie stanowią diagnozy medycznej ani leczenia. W przypadku poważnych dolegliwości zdrowotnych zalecana jest konsultacja z lekarzem.</li>
            </ol>
          </section>

          {/* § 4 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 4. Charakter usług i brak gwarancji rezultatu</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Usługi świadczone przez Usługodawcę mają charakter starannego działania i nie stanowią gwarancji osiągnięcia określonego rezultatu terapeutycznego.</li>
              <li>Usługodawca nie gwarantuje osiągnięcia konkretnych efektów zdrowotnych, estetycznych ani innych rezultatów.</li>
              <li>Usługodawca nie ponosi odpowiedzialności za decyzje zdrowotne podejmowane przez Klienta na podstawie usług lub materiałów edukacyjnych.</li>
            </ol>
          </section>

          {/* § 5 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 5. Materiały wideo (Wideo Pomoc)</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Materiały wideo dostępne w serwisie mają charakter wyłącznie edukacyjny i informacyjny. Nie stanowią one porady medycznej, diagnozy ani zaleceń terapeutycznych.</li>
              <li>Klient wykonuje ćwiczenia przedstawione w materiałach wideo na własną odpowiedzialność. Przed rozpoczęciem ćwiczeń zalecana jest konsultacja z lekarzem lub fizjoterapeutą.</li>
              <li>Po dokonaniu płatności Klient otrzymuje dostęp do zakupionych materiałów wideo. Dostęp jest aktywny przez okres wskazany w opisie produktu.</li>
              <li>Materiały wideo są udostępniane na licencji do użytku osobistego. Kopiowanie, rozpowszechnianie lub udostępnianie osobom trzecim jest zabronione.</li>
              <li>Wszystkie materiały wideo stanowią własność intelektualną Usługodawcy i są chronione przepisami prawa autorskiego.</li>
              <li>Zabrania się kopiowania, nagrywania, pobierania, rozpowszechniania, publicznego odtwarzania lub modyfikowania materiałów wideo. Naruszenie tego zakazu może skutkować odpowiedzialnością cywilną i karną.</li>
              <li>Zgodnie z art. 38 ust. 1 pkt 13 ustawy z dnia 30 maja 2014 r. o prawach konsumenta, Klientowi będącemu Konsumentem nie przysługuje prawo odstąpienia od umowy o dostarczanie treści cyfrowych, jeżeli spełnianie świadczenia rozpoczęło się za wyraźną i uprzednią zgodą Konsumenta, który został poinformowany przed rozpoczęciem świadczenia, że po jego spełnieniu utraci prawo odstąpienia od umowy.</li>
              <li>Dokonując zakupu materiałów wideo, Klient wyraża zgodę na rozpoczęcie świadczenia usługi przed upływem 14-dniowego terminu do odstąpienia od umowy i potwierdza, że został poinformowany o utracie prawa do odstąpienia od umowy z chwilą rozpoczęcia świadczenia.</li>
            </ol>
          </section>

          {/* § 6 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 6. Płatności</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Płatności za usługi można dokonać gotówką, kartą płatniczą lub przelewem bankowym. Płatności online są realizowane za pośrednictwem bezpiecznego systemu płatności.</li>
              <li>Ceny usług są podane w polskich złotych (PLN) i zawierają podatek VAT (jeśli dotyczy).</li>
              <li>Ze względu na cyfrowy charakter materiałów wideo, zwrot środków nie jest możliwy po uzyskaniu dostępu do treści, zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta.</li>
            </ol>
          </section>

          {/* § 7 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 7. Ochrona danych osobowych</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Administratorem danych osobowych jest M&T ANATOL. Dane osobowe są przetwarzane zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).</li>
              <li>Szczegółowe informacje dotyczące przetwarzania danych osobowych znajdują się w <a href="/polityka-prywatnosci" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Polityce Prywatności</a>.</li>
            </ol>
          </section>

          {/* § 8 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 8. Reklamacje</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Reklamacje dotyczące świadczonych usług można składać drogą elektroniczną na adres e-mail: kontakt@mt-anatol.pl lub pisemnie na adres siedziby Usługodawcy.</li>
              <li>Reklamacja powinna zawierać: dane kontaktowe Klienta, opis problemu oraz oczekiwany sposób rozwiązania.</li>
              <li>Usługodawca rozpatruje reklamacje w terminie 14 dni roboczych od dnia ich otrzymania.</li>
            </ol>
          </section>

          {/* § 9 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 9. Odpowiedzialność</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Całkowita odpowiedzialność Usługodawcy z tytułu niewykonania lub nienależytego wykonania umowy ograniczona jest do wysokości wynagrodzenia faktycznie zapłaconego przez Klienta za daną usługę.</li>
              <li>Usługodawca nie ponosi odpowiedzialności za szkody wynikłe z:
                <ul className="list-disc list-outside ml-6 mt-2 space-y-1">
                  <li>nieprawidłowego lub niezgodnego z Regulaminem korzystania z usług przez Klienta;</li>
                  <li>zatajenia przez Klienta informacji o stanie zdrowia, przeciwwskazaniach lub przyjmowanych lekach;</li>
                  <li>wykonywania ćwiczeń z materiałów wideo bez konsultacji z lekarzem lub fizjoterapeutą;</li>
                  <li>decyzji zdrowotnych podejmowanych przez Klienta na podstawie usług lub materiałów;</li>
                  <li>działania siły wyższej;</li>
                  <li>działań lub zaniechań osób trzecich.</li>
                </ul>
              </li>
              <li>Ograniczenia odpowiedzialności określone w niniejszym paragrafie nie dotyczą szkód wyrządzonych z winy umyślnej Usługodawcy oraz nie naruszają praw Konsumentów wynikających z bezwzględnie obowiązujących przepisów prawa.</li>
            </ol>
          </section>

          {/* § 10 */}
          <section className="py-8 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold mb-6">§ 10. Prawo odstąpienia od umowy</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Konsumentowi przysługuje prawo do odstąpienia od umowy zawartej na odległość w terminie 14 dni bez podania jakiejkolwiek przyczyny, z zastrzeżeniem wyjątków określonych w ustawie o prawach konsumenta.</li>
              <li>Prawo odstąpienia od umowy nie przysługuje w przypadku umów o świadczenie usług, za które Konsument jest zobowiązany do zapłaty ceny, jeżeli Usługodawca wykonał w pełni usługę za wyraźną i uprzednią zgodą Konsumenta.</li>
              <li>W przypadku treści cyfrowych (materiały wideo), prawo odstąpienia nie przysługuje zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta, jeżeli spełnianie świadczenia rozpoczęło się za wyraźną zgodą Konsumenta przed upływem terminu do odstąpienia od umowy.</li>
            </ol>
          </section>

          {/* § 11 */}
          <section className="py-8">
            <h2 className="text-xl font-bold mb-6">§ 11. Postanowienia końcowe</h2>
            <ol className="list-decimal list-outside ml-6 space-y-4">
              <li>Usługodawca zastrzega sobie prawo do zmiany niniejszego Regulaminu. O zmianach Klienci zostaną poinformowani poprzez publikację nowej wersji na stronie internetowej.</li>
              <li>W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy prawa polskiego, w szczególności Kodeksu Cywilnego oraz ustawy o prawach konsumenta.</li>
              <li>W przypadku sporów z Konsumentem właściwość sądu określają przepisy prawa powszechnie obowiązującego.</li>
              <li>Spory z Klientami niebędącymi Konsumentami będą rozstrzygane przez sąd właściwy dla siedziby Usługodawcy.</li>
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
