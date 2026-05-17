import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="fade-in">
      <section className="page-container py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span>24/7 verfügbar</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight mb-4">
            Ihr Taxi in Mönchengladbach.
            <br />
            <span className="text-brand-600">Schnell. Zuverlässig.</span>
          </h1>
          <p className="text-lg text-stone-600 max-w-xl mx-auto mb-10 leading-relaxed">
            Buchen Sie in 30 Sekunden online — mit Festpreis und transparenter Route. Oder rufen Sie direkt an.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/buchen" className="btn-primary text-base !py-3.5 !px-8">
              Jetzt buchen
            </Link>
            <a href="tel:+491633315888" className="btn-secondary text-base !py-3.5 !px-8">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +49 163 3315888
            </a>
            <a
              href="https://wa.me/491633315888"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-base !py-3.5 !px-6"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="page-container pb-16">
        <div className="flex flex-wrap justify-center gap-3">
          <div className="badge">
            <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            24/7 Service
          </div>
          <div className="badge">
            <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Festpreis
          </div>
          <div className="badge">
            <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Lizenzierter Fahrer
          </div>
          <div className="badge">
            <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Lokal in MG
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-stone-200 py-20">
        <div className="page-container">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 text-center mb-14">
            So funktioniert's
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { num: '01', title: 'Adresse eingeben', desc: 'Geben Sie Abhol- und Zielort ein. Die Karte zeigt Ihre Route.' },
              { num: '02', title: 'Festpreis sehen', desc: 'Sie sehen sofort den geschätzten Fahrpreis — keine versteckten Kosten.' },
              { num: '03', title: 'Einsteigen', desc: 'Wir bestätigen die Fahrt und sind in wenigen Minuten bei Ihnen.' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 font-bold text-xl flex items-center justify-center mx-auto mb-5">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="page-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
              Faire, transparente Preise
            </h2>
            <p className="text-stone-600 mb-10">
              Wir berechnen klare Tarife — orientiert an den ortsüblichen Taxipreisen in Mönchengladbach.
              Sie sehen den Festpreis, bevor Sie buchen.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {[
                { label: 'Grundpreis', value: '4,00 €' },
                { label: 'Pro Kilometer', value: '2,00 €' },
                { label: 'Mindestfahrpreis', value: '6,00 €' },
              ].map((item) => (
                <div key={item.label} className="card text-center">
                  <p className="text-sm text-stone-500 mb-1">{item.label}</p>
                  <p className="text-2xl font-bold text-stone-900">{item.value}</p>
                </div>
              ))}
            </div>
            <Link to="/buchen" className="btn-primary">
              Preis jetzt berechnen
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white border-y border-stone-200 py-20">
        <div className="page-container">
          <div className="max-w-2xl mx-auto text-center">
            <svg className="w-8 h-8 mx-auto mb-4 text-brand-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.655-2.917-1.179zm10 0c-1.03-1.094-1.583-2.321-1.583-4.31 0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.166 21 15c0 1.933-1.567 3.5-3.5 3.5-1.271 0-2.404-.655-2.917-1.179z" />
            </svg>
            <blockquote className="text-lg text-stone-700 italic leading-relaxed mb-4">
              „Mouine ist immer pünktlich und super freundlich. Ich rufe für meine Fahrten zum Bahnhof nur noch ihn."
            </blockquote>
            <p className="text-sm font-medium text-stone-500">— Stammkundin aus Rheydt</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="page-container text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
            Bereit für Ihre Fahrt?
          </h2>
          <p className="text-stone-600 mb-8">
            Buchen Sie jetzt online oder rufen Sie direkt an — wir holen Sie ab.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/buchen" className="btn-primary text-base !py-3.5 !px-8">
              Online buchen
            </Link>
            <a href="tel:+491633315888" className="btn-secondary text-base !py-3.5 !px-8">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +49 163 3315888
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
