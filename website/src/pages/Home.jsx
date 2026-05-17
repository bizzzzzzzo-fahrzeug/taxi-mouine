import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <section className="relative bg-gradient-to-br from-yellow-400 via-yellow-300 to-orange-200 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-7xl mb-6">🚕</div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Taxi Mouine
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 mb-8">
            Ihr zuverlässiges Taxi in Mönchengladbach und Umgebung
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/buchen" className="btn-primary text-xl">
              Jetzt buchen
            </Link>
            <a
              href="https://wa.me/491633315888"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              WhatsApp
            </a>
          </div>
          <div className="mt-6">
            <a
              href="tel:+491633315888"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold text-lg"
            >
              <span>📞</span> +49 163 3315888
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Warum Taxi Mouine?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Schnell & Zuverlässig',
                desc: 'Kurze Wartezeiten, pünktliche Abholung – immer wenn Sie uns brauchen.',
              },
              {
                icon: '💰',
                title: 'Faire Preise',
                desc: 'Transparente Preisgestaltung ohne versteckte Kosten. Nur Barzahlung.',
              },
              {
                icon: '📍',
                title: 'Ganz Mönchengladbach',
                desc: 'Wir fahren Sie überall hin – ob Innenstadt, Rheydt oder die umliegenden Orte.',
              },
            ].map((item) => (
              <div key={item.title} className="card text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-yellow-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Bereit zu fahren?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Buchen Sie jetzt Ihre Fahrt online oder rufen Sie uns direkt an.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/buchen" className="btn-primary">
              Online buchen
            </Link>
            <a href="tel:+491633315888" className="btn-secondary">
              +49 163 3315888 anrufen
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
