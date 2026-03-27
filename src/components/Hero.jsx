export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-white to-green-50"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-sm">
            🌱 Educação ambiental que transforma
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-green-950 leading-tight mt-6">
            Bem-vindo à Liga Estudantil Ambiental EPEM!
          </h2>

          <p className="text-lg text-gray-700 mt-6 leading-8">
            Aqui acreditamos que pequenas atitudes podem gerar grandes
            transformações. Nosso espaço é dedicado a inspirar, conscientizar e
            mobilizar jovens em prol do meio ambiente e da sustentabilidade.
            Junte-se a nós nessa missão de cuidar do planeta e construir um
            futuro mais verde e responsável. 🌎💚
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <button className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition">
              Conhecer atividades
            </button>

            <button className="border border-green-700 text-green-800 hover:bg-green-50 font-semibold px-6 py-3 rounded-xl transition">
              Ver projetos
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-white shadow-xl rounded-3xl p-4 w-full max-w-md">
            <img
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80"
              alt="Natureza e sustentabilidade"
              className="w-full h-[420px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}