export default function Header() {
  return (
    <header className="w-full border-b border-green-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-green-900">
            Liga Estudantil Ambiental EPEM
          </h1>
          <p className="text-sm text-gray-500">
            Sustentabilidade, ação e consciência ambiental
          </p>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <a href="#" className="hover:text-green-700 transition">
            Início
          </a>
          <a href="#" className="hover:text-green-700 transition">
            Atividades
          </a>
          <a href="#" className="hover:text-green-700 transition">
            Projetos
          </a>
          <a href="#" className="hover:text-green-700 transition">
            Galeria
          </a>
          <a href="#" className="hover:text-green-700 transition">
            Contato
          </a>
        </nav>
      </div>
    </header>
  )
}