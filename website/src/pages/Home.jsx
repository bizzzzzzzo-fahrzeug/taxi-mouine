import { Link } from 'react-router-dom'

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Schnell & Zuverlässig',
    desc: 'Kurze Wartezeiten, pünktliche Abholung – immer wenn Sie uns brauchen.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Faire Preise',
    desc: 'Transparente Preisgestaltung ohne versteckte Kosten. Nur Barzahlung.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Ganz Mönchengladbach',
    desc: 'Wir fahren Sie überall hin – ob Innenstadt, Rheydt oder die umliegenden Orte.',
  },
]

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(251,191,36,0.2),transparent_50%)]" />
        <div className="page-container relative py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="text-6xl sm:text-7xl mb-6 animate-bounce-in">🚕</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text tracking-tight mb-4">
              Taxi <span className="text-brand-600">Mouine</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
              Ihr zuverlässiges Taxi in Mönchengladbach und Umgebung.
              Schnell buchen, fair bezahlen, entspannt fahren.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/buchen" className="btn-primary text-lg !py-4 !px-10 shadow-lg shadow-brand-400/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Jetzt buchen
              </Link>
              <a
                href="https://wa.me/491633315888"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-lg !py-4 !px-10"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
            <div className="mt-8">
              <a
                href="tel:+491633315888"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-text font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +49 163 3315888
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent" />
      </section>

      <section className="py-20 sm:py-28">
        <div className="page-container">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="section-title mb-4">Warum Taxi Mouine?</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Einfach, transparent und persönlich – das zeichnet uns aus.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((item, i) => (
              <div
                key={item.title}
                className="card-hover group"
                style={{ animationDelay: `${i * 150}ms`, animation: 'slide-up 0.5s ease-out forwards', opacity: 0 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mb-5 group-hover:bg-brand-200 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-text mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-white border-y border-border">
        <div className="page-container text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="section-title mb-4">Bereit zu fahren?</h2>
            <p className="section-subtitle mb-10">
              Buchen Sie jetzt Ihre Fahrt online oder rufen Sie uns direkt an.
              Wir sind für Sie da.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/buchen" className="btn-primary text-lg !py-4 !px-10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Online buchen
              </Link>
              <a href="tel:+491633315888" className="btn-secondary text-lg !py-4 !px-10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +49 163 3315888 anrufen
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
