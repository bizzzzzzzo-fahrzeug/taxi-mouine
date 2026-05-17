export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-lg font-semibold text-white mb-2">Taxi Mouine</p>
        <p className="mb-1">Moenchengladbach & Umgebung</p>
        <p className="mb-4">
          <a href="tel:+491633315888" className="text-yellow-400 hover:text-yellow-300 font-semibold">
            +49 163 3315888
          </a>
        </p>
        <div className="border-t border-gray-700 pt-4 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Taxi Mouine. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  )
}
