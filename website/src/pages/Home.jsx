import { Link } from 'react-router-dom'

const highlights = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '24/7 Service',
    desc: 'Rund um die Uhr für Sie da',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Festpreis',
    desc: 'Keine bösen Überraschungen',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Lizenzierter Fahrer',
    desc: 'Sicher & versichert',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Lokal in MG',
    desc: 'Mönchengladbach & Umgebung',
  },
]

const steps = [
  { num: '01', title: 'Adresse eingeben', desc: 'Geben Sie Abhol- und Zielort ein. Die Karte zeigt Ihre Route.' },
  { num: '02', title: 'Festpreis sehen', desc: 'Sie sehen sofort den geschätzten Fahrpreis — keine versteckten Kosten.' },
  { num: '03', title: 'Einsteigen', desc: 'Wir bestätigen die Fahrt und sind in wenigen Minuten bei Ihnen.' },
]

export default function Home() {
  return (
    <div className="fade-in">
      <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, oklch(0.84 0.17 88 / 0.5) 0, transparent 40%), radial-gradient(circle at 80% 20%, oklch(0.84 0.17 88 / 0.3) 0, transparent 40%)',
        }} />
        <div className="relative page-container py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="badge-pill">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              24/7 verfügbar
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
              Ihr Taxi in <span style={{ color: 'var(--color-primary)' }}>Mönchengladbach</span>.<br />
              Schnell. Zuverlässig.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Buchen Sie in 30 Sekunden online — mit Festpreis und transparenter Route. Oder rufen Sie direkt an.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/buchen" className="btn btn-primary btn-lg text-base" style={{ boxShadow: 'var(--shadow-glow)' }}>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Jetzt buchen
              </Link>
              <a href="tel:+491633315888" className="btn btn-lg text-base border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white" style={{ borderColor: 'rgb(255 255 255 / 0.3)' }}>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +49 163 3315888
              </a>
              <a href="https://wa.me/491633315888" target="_blank" rel="noopener noreferrer" className="btn btn-lg border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white" style={{ borderColor: 'rgb(255 255 255 / 0.3)' }}>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container -mt-12">
        <div className="grid gap-4 rounded-2xl bg-card p-6 md:grid-cols-4" style={{ boxShadow: 'var(--shadow-card)' }}>
          {highlights.map((h) => (
            <div key={h.title} className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: 'color-mix(in oklab, var(--color-primary) 15%, transparent)', color: 'var(--color-primary)' }}>
                {h.icon}
              </div>
              <div>
                <div className="font-semibold text-sm">{h.title}</div>
                <div className="text-sm text-muted-foreground">{h.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-container py-20">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold md:text-4xl">So funktioniert's</h2>
          <p className="mt-3 text-muted-foreground">Drei Schritte — und Sie sind unterwegs.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.num} className="rounded-xl border border-border bg-card p-6">
              <div className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{s.num}</div>
              <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-20">
        <div className="page-container">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Faire, transparente Preise</h2>
              <p className="mt-3 text-muted-foreground">
                Wir berechnen klare Tarife — orientiert an den ortsüblichen Taxipreisen in Mönchengladbach.
                Sie sehen den Festpreis, bevor Sie buchen.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  { label: 'Grundpreis', value: '4,00 €' },
                  { label: 'Pro Kilometer', value: '2,00 €' },
                  { label: 'Mindestfahrpreis', value: '6,00 €' },
                ].map((item) => (
                  <div key={item.label} className="flex items-baseline justify-between border-b border-border pb-3">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-lg font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
              <Link to="/buchen" className="btn btn-primary btn-lg mt-8 inline-flex">
                Preis jetzt berechnen
              </Link>
            </div>
            <div className="rounded-2xl bg-card p-8" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-4 text-lg leading-relaxed">
                „Mouine ist immer pünktlich und super freundlich. Ich rufe für meine Fahrten zum Bahnhof nur noch ihn."
              </blockquote>
              <div className="mt-4 text-sm text-muted-foreground">— Stammkundin aus Rheydt</div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container py-20">
        <div className="rounded-3xl p-10 text-center text-white md:p-16" style={{ background: 'var(--gradient-hero)' }}>
          <h2 className="text-3xl font-bold md:text-4xl">Bereit für Ihre Fahrt?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/80">
            Buchen Sie jetzt online oder rufen Sie direkt an — wir holen Sie ab.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/buchen" className="btn btn-primary btn-lg">Online buchen</Link>
            <a href="tel:+491633315888" className="btn btn-lg border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white" style={{ borderColor: 'rgb(255 255 255 / 0.3)' }}>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Anrufen
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
