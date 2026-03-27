import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { buscarPostPorId } from "../services/posts"

export default function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")
  const [imagemAtiva, setImagemAtiva] = useState("")

  useEffect(() => {
    carregarPost()
  }, [id])

  async function carregarPost() {
    try {
      setCarregando(true)
      setErro("")

      const dados = await buscarPostPorId(id)
      setPost(dados)
      setImagemAtiva(dados.image_url || dados.gallery_urls?.[0] || "")
    } catch (error) {
      console.error(error)
      setErro("Não foi possível carregar a postagem.")
    } finally {
      setCarregando(false)
    }
  }

  function formatarData(data) {
    if (!data) return ""

    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  function compartilharPost() {
    const link = window.location.href

    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Link copiado com sucesso.")
      })
      .catch(() => {
        alert("Não foi possível copiar o link.")
      })
  }

  if (carregando) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-gray-600">Carregando postagem...</p>
      </div>
    )
  }

  if (erro || !post) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-red-600 font-medium">
          {erro || "Postagem não encontrada."}
        </p>

        <Link
          to="/"
          className="inline-block mt-6 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Voltar
        </Link>
      </div>
    )
  }

  const todasImagens = [
    ...(post.image_url ? [post.image_url] : []),
    ...(post.gallery_urls || []),
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-[#f4f8f4]">
      <header className="border-b border-green-100 bg-white/90">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo-leae.png"
              alt="Logo da liga"
              className="w-12 h-12 rounded-full object-cover border border-green-100"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-green-950">
                Liga Estudantil Ambiental EPEM
              </h1>
              <p className="text-sm text-gray-500">
                Sustentabilidade, ação e consciência ambiental
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="text-sm font-semibold text-green-700 hover:text-green-900 transition"
          >
            Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-green-100">
          {imagemAtiva && (
            <img
              src={imagemAtiva}
              alt={post.title}
              className="w-full h-[260px] md:h-[520px] object-cover"
            />
          )}

          <div className="p-6 md:p-10">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-gray-400 font-medium">
                {formatarData(post.created_at)}
              </p>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800">
                {post.category || "Geral"}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold text-green-950 mt-4 leading-tight">
              {post.title}
            </h2>

            <p className="text-sm text-gray-500 mt-4">
              Postado por{" "}
              <span className="font-semibold text-green-800">
                {post.author_name}
              </span>
            </p>

            <div className="mt-6 flex gap-3 flex-wrap">
              <button
                onClick={compartilharPost}
                className="border border-green-200 text-green-800 hover:bg-green-50 font-semibold px-5 py-3 rounded-xl transition"
              >
                Compartilhar
              </button>

              <Link
                to="/"
                className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-3 rounded-xl transition"
              >
                Voltar para as postagens
              </Link>
            </div>

            {todasImagens.length > 1 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-green-950 mb-4">
                  Mais imagens
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {todasImagens.map((imagem, index) => (
                    <button
                      key={index}
                      onClick={() => setImagemAtiva(imagem)}
                      className="overflow-hidden rounded-2xl border border-green-100 hover:opacity-90 transition"
                    >
                      <img
                        src={imagem}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-28 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 text-gray-700 leading-8 whitespace-pre-line text-base md:text-lg">
              {post.description}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}