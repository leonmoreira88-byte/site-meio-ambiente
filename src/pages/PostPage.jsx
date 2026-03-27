import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    carregarPost()
  }, [id])

  async function carregarPost() {
    try {
      setCarregando(true)
      setErro("")

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      const { data: urlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(data.image_path)

      setPost({
        ...data,
        image_url: urlData.publicUrl,
      })
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

  if (carregando) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-gray-600">Carregando postagem...</p>
      </div>
    )
  }

  if (erro || !post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-red-600 font-medium">{erro || "Postagem não encontrada."}</p>

        <Link
          to="/"
          className="inline-block mt-6 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Voltar para o início
        </Link>
      </div>
    )
  }

  return (
    <div>
      <header className="border-b border-green-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-green-950">
              Liga Estudantil Ambiental EPEM
            </h1>
            <p className="text-sm text-gray-500">
              Sustentabilidade, ação e consciência ambiental
            </p>
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
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-green-100">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-[260px] md:h-[480px] object-cover"
          />

          <div className="p-6 md:p-10">
            <p className="text-sm text-gray-400 font-medium">
              {formatarData(post.created_at)}
            </p>

            <h2 className="text-3xl md:text-5xl font-extrabold text-green-950 mt-3 leading-tight">
              {post.title}
            </h2>

            <p className="text-sm text-gray-500 mt-4">
              Postado por{" "}
              <span className="font-semibold text-green-800">
                {post.author_name}
              </span>
            </p>

            <div className="mt-8 text-gray-700 leading-8 whitespace-pre-line text-base md:text-lg">
              {post.description}
            </div>

            <div className="mt-10">
              <Link
                to="/"
                className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition"
              >
                Voltar para as postagens
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
