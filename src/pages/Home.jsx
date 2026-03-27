import { useEffect, useRef, useState } from "react"
import {
  buscarPosts,
  uploadImagem,
  criarPost,
  excluirPostBanco,
} from "../services/posts"

const CODIGOS_COMISSAO = {
  Leon: "LEON2026",
  Marllon: "MARLLON2026",
  Rayssa: "RAYSSA2026",
  Eduarda: "EDUARDA2026",
}

export default function Home() {
  const [imagemSelecionada, setImagemSelecionada] = useState(null)
  const [comissaoAberta, setComissaoAberta] = useState(false)
  const [membroLogado, setMembroLogado] = useState("")

  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [imagem, setImagem] = useState(null)
  const [imagemPreview, setImagemPreview] = useState("")
  const [nomeArquivo, setNomeArquivo] = useState("")

  const [mensagem, setMensagem] = useState("")
  const [posts, setPosts] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [publicando, setPublicando] = useState(false)

  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [postParaExcluir, setPostParaExcluir] = useState(null)
  const [codigoExcluir, setCodigoExcluir] = useState("")
  const [excluindo, setExcluindo] = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => {
    carregarPosts()
  }, [])

  async function carregarPosts() {
    try {
      setCarregando(true)
      const dados = await buscarPosts()
      setPosts(dados)
    } catch (error) {
      console.error(error)
      setMensagem("Erro ao carregar as postagens.")
    } finally {
      setCarregando(false)
    }
  }

  function abrirImagem(url) {
    setImagemSelecionada(url)
  }

  function fecharImagem() {
    setImagemSelecionada(null)
  }

  function obterAutorPeloCodigo(codigoDigitado) {
    const codigoLimpo = codigoDigitado.trim()

    for (const [nome, codigo] of Object.entries(CODIGOS_COMISSAO)) {
      if (codigo === codigoLimpo) {
        return nome
      }
    }

    return null
  }

  function limparFormulario() {
    setTitulo("")
    setDescricao("")
    setImagem(null)
    setImagemPreview("")
    setNomeArquivo("")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function abrirAreaComissao() {
    const codigoDigitado = prompt("Digite o código da comissão para acessar:")

    if (!codigoDigitado) return

    const autorEncontrado = obterAutorPeloCodigo(codigoDigitado)

    if (!autorEncontrado) {
      setMensagem("Código inválido.")
      return
    }

    setMembroLogado(autorEncontrado)
    setComissaoAberta(true)
    setMensagem(`Acesso liberado para ${autorEncontrado}.`)
  }

  function fecharAreaComissao() {
    setComissaoAberta(false)
    setMembroLogado("")
    limparFormulario()
  }

  function lidarComUploadImagem(e) {
    const arquivo = e.target.files?.[0]

    if (!arquivo) return

    if (!arquivo.type.startsWith("image/")) {
      setMensagem("Selecione um arquivo de imagem válido.")
      return
    }

    const limiteMB = 2
    const tamanhoMaximo = limiteMB * 1024 * 1024

    if (arquivo.size > tamanhoMaximo) {
      setMensagem(`A imagem é muito grande. Use uma imagem de até ${limiteMB}MB.`)
      return
    }

    setImagem(arquivo)
    setNomeArquivo(arquivo.name)
    setImagemPreview(URL.createObjectURL(arquivo))
    setMensagem("")
  }

  async function publicarPost(e) {
    e.preventDefault()

    if (!membroLogado) {
      setMensagem("Acesso não autorizado.")
      return
    }

    if (!titulo || !descricao || !imagem) {
      setMensagem("Preencha todos os campos e envie uma imagem.")
      return
    }

    try {
      setPublicando(true)

      const caminhoImagem = await uploadImagem(imagem)

      await criarPost({
        title: titulo.trim(),
        description: descricao.trim(),
        imagePath: caminhoImagem,
        author: membroLogado,
      })

      setMensagem(`Postagem publicada com sucesso por ${membroLogado}.`)
      limparFormulario()
      setComissaoAberta(false)
      setMembroLogado("")
      await carregarPosts()
    } catch (error) {
      console.error("ERRO AO PUBLICAR:", error)
      setMensagem(error.message || "Erro ao publicar a postagem.")
    } finally {
      setPublicando(false)
    }
  }

  function abrirModalExcluir(post) {
    setPostParaExcluir(post)
    setCodigoExcluir("")
    setModalExcluirAberto(true)
  }

  function fecharModalExcluir() {
    setModalExcluirAberto(false)
    setPostParaExcluir(null)
    setCodigoExcluir("")
  }

  async function confirmarExclusao() {
    if (!postParaExcluir) return

    const autorPeloCodigo = obterAutorPeloCodigo(codigoExcluir)

    if (!autorPeloCodigo || autorPeloCodigo !== postParaExcluir.author_name) {
      setMensagem("Código inválido. Você não pode excluir esta postagem.")
      return
    }

    try {
      setExcluindo(true)
      await excluirPostBanco(postParaExcluir.id, postParaExcluir.image_path)
      setMensagem("Postagem excluída com sucesso.")
      fecharModalExcluir()
      await carregarPosts()
    } catch (error) {
      console.error(error)
      setMensagem("Erro ao excluir a postagem.")
    } finally {
      setExcluindo(false)
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

  return (
    <div>
      <header className="sticky top-0 z-50 border-b border-green-100 bg-white/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="animate-fade-up">
            <h1 className="text-xl md:text-2xl font-bold text-green-950">
              Liga Estudantil Ambiental EPEM
            </h1>
            <p className="text-sm text-gray-500">
              Sustentabilidade, ação e consciência ambiental
            </p>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <a href="#inicio" className="hover:text-green-700 transition">
              Início
            </a>
            <a href="#atividades" className="hover:text-green-700 transition">
              Atividades
            </a>
            <a href="#estatisticas" className="hover:text-green-700 transition">
              Dados
            </a>
            <a href="#contato" className="hover:text-green-700 transition">
              Contato
            </a>
          </nav>
        </div>
      </header>

      <section id="inicio" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-white to-green-50"></div>
        <div className="absolute -top-10 -left-10 h-52 w-52 rounded-full bg-green-200/40 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-emerald-200/40 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-sm shadow-sm">
              🌱 Educação ambiental que transforma
            </span>

            <h2 className="text-4xl md:text-6xl font-extrabold text-green-950 leading-tight mt-6">
              Bem-vindo à Liga Estudantil Ambiental EPEM!
            </h2>

            <p className="text-lg md:text-xl text-gray-700 mt-6 leading-9 max-w-2xl">
              Aqui acreditamos que pequenas atitudes podem gerar grandes
              transformações. Nosso espaço é dedicado a inspirar, conscientizar
              e mobilizar jovens em prol do meio ambiente e da sustentabilidade.
              Junte-se a nós nessa missão de cuidar do planeta e construir um
              futuro mais verde e responsável. 🌎💚
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="#atividades"
                className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md hover:shadow-lg"
              >
                Conhecer atividades
              </a>
            </div>
          </div>

          <div className="flex justify-center animate-fade-up delay-200">
            <div className="bg-white shadow-xl rounded-3xl p-4 w-full max-w-md hover:-translate-y-1 transition duration-300">
              <img
                src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80"
                alt="Natureza e sustentabilidade"
                className="w-full h-[430px] object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="atividades" className="max-w-7xl mx-auto px-6 py-20">
        <div className="animate-fade-up text-center">
          <p className="text-green-700 font-semibold uppercase tracking-[0.3em] text-sm">
            Atividades do clube
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-green-950 mt-4">
            Nossas ações e projetos 🌱
          </h2>

          <p className="text-gray-600 mt-6 leading-8 max-w-2xl mx-auto">
            Veja tudo que estamos fazendo na prática para cuidar do meio ambiente
            dentro e fora da escola.
          </p>
        </div>

        {mensagem && (
          <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-800 font-medium">
            {mensagem}
          </div>
        )}

        {carregando ? (
          <div className="mt-10 text-gray-600 text-center">
            Carregando postagens...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-12">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-green-100 hover:-translate-y-2 hover:shadow-2xl transition duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => abrirImagem(post.image_url)}
                  className="block w-full text-left"
                >
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-64 object-cover"
                  />
                </button>

                <div className="p-6">
                  <p className="text-sm text-gray-400 font-medium">
                    {formatarData(post.created_at)}
                  </p>

                  <h3 className="text-2xl font-bold text-green-900 mt-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mt-4 leading-7">
                    {post.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                    <p className="text-sm text-gray-500">
                      Postado por{" "}
                      <span className="font-semibold text-green-800">
                        {post.author_name}
                      </span>
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() => abrirImagem(post.image_url)}
                        className="text-sm font-semibold text-green-700 hover:text-green-900 transition"
                      >
                        Ver imagem
                      </button>

                      <button
                        onClick={() => abrirModalExcluir(post)}
                        className="text-sm font-semibold text-red-600 hover:text-red-800 transition"
                      >
                        Excluir postagem
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="estatisticas" className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-green-900 text-white rounded-3xl p-8 shadow-lg animate-fade-up">
            <p className="text-sm uppercase tracking-wider text-green-100">
              Membros ativos
            </p>
            <h4 className="text-4xl font-extrabold mt-3">20</h4>
          </div>

          <div className="bg-white border border-green-100 rounded-3xl p-8 shadow-sm animate-fade-up delay-100">
            <p className="text-sm uppercase tracking-wider text-gray-500">
              Projetos Feitos
            </p>
            <h4 className="text-4xl font-extrabold mt-3 text-green-900">2</h4>
          </div>
        </div>
      </section>

     <section id="contato" className="max-w-7xl mx-auto px-6 pb-16">
  <div className="bg-gradient-to-r from-green-900 to-emerald-800 rounded-3xl p-8 md:p-12 text-white shadow-xl animate-fade-up">
    <p className="uppercase tracking-[0.2em] text-sm text-green-100">
      Contato
    </p>

    <h3 className="text-3xl md:text-4xl font-bold mt-3">
      Quer acompanhar ou apoiar nossas ações?
    </h3>

    <p className="mt-4 text-green-50 max-w-2xl leading-8">
      Entre em contato com a Liga Estudantil Ambiental EPEM e acompanhe
      nossas atividades, projetos e iniciativas em defesa do meio
      ambiente.
    </p>

    <div className="mt-8 flex flex-wrap gap-4">
      <a
        href="#inicio"
        className="bg-white text-green-900 font-semibold px-6 py-3 rounded-xl hover:bg-green-50 transition"
      >
        Voltar ao topo
      </a>

      <a
        href="#atividades"
        className="border border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition"
      >
        Ver atividades
      </a>

      <a
        href="https://www.instagram.com/liga.ambientalepem?utm_source=qr"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-xl transition"
      >
        Instagram da Liga
      </a>
    </div>
  </div>
</section>

      <section id="comissao" className="max-w-7xl mx-auto px-6 pb-16">
        <div className="animate-fade-up">
          <button
            type="button"
            onClick={abrirAreaComissao}
            className="text-sm text-gray-500 hover:text-green-700 transition font-medium"
          >
            Área da comissão
          </button>
        </div>

        {comissaoAberta && (
          <div className="mt-4 bg-white rounded-3xl border border-green-100 shadow-sm p-6 md:p-8 animate-fade-up">
            <p className="text-gray-500 text-sm uppercase tracking-[0.2em]">
              Área restrita
            </p>

            <h3 className="text-2xl md:text-3xl font-bold text-green-950 mt-3">
              Novo post
            </h3>

            <p className="text-gray-600 mt-4 leading-7 max-w-2xl">
              Publicando como{" "}
              <span className="font-semibold text-green-800">
                {membroLogado}
              </span>
              .
            </p>

            <form onSubmit={publicarPost} className="space-y-5 mt-8">
              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  Título da postagem
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Digite o título"
                  className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  Descrição 
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Escreva a descrição da atividade"
                  rows="5"
                  className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  Imagem
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={lidarComUploadImagem}
                  className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 bg-white"
                />

                <p className="text-sm text-gray-500 mt-2">
                  Envie uma imagem de até 2MB.
                </p>

                {nomeArquivo && (
                  <p className="text-sm text-green-700 font-medium mt-2">
                    Arquivo selecionado: {nomeArquivo}
                  </p>
                )}

                {imagemPreview && (
                  <div className="mt-4">
                    <img
                      src={imagemPreview}
                      alt="Pré-visualização"
                      className="w-full max-h-72 object-cover rounded-2xl border border-green-100"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={publicando}
                  className="bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md hover:shadow-lg"
                >
                  {publicando ? "Publicando..." : "Publicar postagem"}
                </button>

                <button
                  type="button"
                  onClick={fecharAreaComissao}
                  className="border border-green-200 text-green-800 hover:bg-green-50 font-semibold px-6 py-3 rounded-xl transition"
                >
                  Fechar
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      <footer className="bg-green-950 text-green-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h3 className="text-2xl font-bold">
            Liga Estudantil Ambiental EPEM
          </h3>

          <p className="mt-3 text-green-100 max-w-2xl leading-7">
            Um espaço dedicado à conscientização, à ação e ao compromisso com um
            futuro mais sustentável dentro e fora da escola.
          </p>

          <div className="mt-6 text-sm text-green-200">
            © 2026 Liga Estudantil Ambiental EPEM
          </div>
        </div>
      </footer>

      {imagemSelecionada && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6"
          onClick={fecharImagem}
        >
          <div className="max-w-4xl w-full animate-scale-in">
            <img
              src={imagemSelecionada}
              alt="Imagem ampliada"
              className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {modalExcluirAberto && postParaExcluir && (
        <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-green-100 p-6 animate-scale-in">
            <p className="text-gray-500 text-sm uppercase tracking-[0.2em]">
              Confirmação
            </p>

            <h3 className="text-2xl font-bold text-green-950 mt-3">
              Excluir postagem
            </h3>

            <p className="text-gray-600 mt-4 leading-7">
              Para excluir <span className="font-semibold">{postParaExcluir.title}</span>,
              digite o código de <span className="font-semibold text-green-800">{postParaExcluir.author_name}</span>.
            </p>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-green-900 mb-2">
                Código
              </label>
              <input
                type="password"
                value={codigoExcluir}
                onChange={(e) => setCodigoExcluir(e.target.value)}
                placeholder="Digite o código"
                className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                type="button"
                onClick={confirmarExclusao}
                disabled={excluindo}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition"
              >
                {excluindo ? "Excluindo..." : "Confirmar exclusão"}
              </button>

              <button
                type="button"
                onClick={fecharModalExcluir}
                className="border border-green-200 text-green-800 hover:bg-green-50 font-semibold px-6 py-3 rounded-xl transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}