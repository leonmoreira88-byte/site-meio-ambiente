export default function PostCard({ titulo, descricao, imagem, autor }) {
  return (
    <article className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 border border-green-100">
      <img
        src={imagem}
        alt={titulo}
        className="w-full h-60 object-cover"
      />

      <div className="p-6">
        <h3 className="text-2xl font-bold text-green-900 leading-snug">
          {titulo}
        </h3>

        <p className="text-gray-600 mt-4 leading-7">
          {descricao}
        </p>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-500">
            Postado por <span className="text-green-800 font-semibold">{autor}</span>
          </p>
        </div>
      </div>
    </article>
  )
}