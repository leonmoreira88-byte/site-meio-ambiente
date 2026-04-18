import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  buscarPosts,
  uploadImagem,
  uploadMultiplasImagens,
  uploadVideo,
  criarPost,
  editarPostBanco,
  excluirPostBanco,
} from "../services/posts"

const CODIGOS_COMISSAO = {
  Leon: "LEON2026",
  Marllon: "MARLLON2026",
  Rayssa: "RAYSSA2026",
  Eduarda: "EDUARDA2026",
}

const INTEGRANTES = [
  "Marllon Kelvyn",
  "Leon Moreira",
  "Livia Karolinne",
  "Joana Victória",
  "Jamilly Jandira",
  "Emelly Vitória",
  "Douglas Eduardo",
  "Maiza Cássia",
  "Maria Eduarda Lins",
  "Emilly Gabrielly",
  "Vinicius Barbosa",
  "Bianca Maria",
  "Elaine da Silva",
  "Luan dos Santos",
  "Nayara Ruani",
  "Sirlaine Mendes",
  "Ingredi",
  "Rayssa Vieira",
  "Maria Eduarda da Silva",
  "Ana Beatriz",
]

const CATEGORIAS = [
  "Todos",
  "Geral",
  "Plantio",
  "Limpeza",
  "Projeto",
  "Evento",
  "Campanha",
]

export default function Home() {
  const [imagemSelecionada, setImagemSelecionada] = useState(null)

  const [comissaoAberta, setComissaoAberta] = useState(false)
  const [membroLogado, setMembroLogado] = useState("")
  const [codigoAcesso, setCodigoAcesso] = useState("")

  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [categoria, setCategoria] = useState("Geral")
  const [isFeatured, setIsFeatured] = useState(false)

  const [imagem, setImagem] = useState(null)
  const [imagemPreview, setImagemPreview] = useState("")
  const [nomeArquivo, setNomeArquivo] = useState("")

  const [imagensExtras, setImagensExtras] = useState([])
  const [imagensExtrasPreview, setImagensExtrasPreview] = useState([])

  const [video, setVideo] = useState(null)
  const [videoPreview, setVideoPreview] = useState("")

  const [busca, setBusca] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("Todos")

  const [mensagem, setMensagem] = useState("")
  const [posts, setPosts] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [publicando, setPublicando] = useState(false)

  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [postParaExcluir, setPostParaExcluir] = useState(null)
  const [codigoExcluir, setCodigoExcluir] = useState("")
  const [excluindo, setExcluindo] = useState(false)

  const [modalEditarAberto, setModalEditarAberto] = useState(false)
  const [postParaEditar, setPostParaEditar] = useState(null)
  const [tituloEdicao, setTituloEdicao] = useState("")
  const [descricaoEdicao, setDescricaoEdicao] = useState("")
  const [categoriaEdicao, setCategoriaEdicao] = useState("Geral")
  const [isFeaturedEdicao, setIsFeaturedEdicao] = useState(false)

  const [imagemEdicao, setImagemEdicao] = useState(null)
  const [imagemEdicaoPreview, setImagemEdicaoPreview] = useState("")

  const [imagensExtrasEdicao, setImagensExtrasEdicao] = useState([])
  const [imagensExtrasEdicaoPreview, setImagensExtrasEdicaoPreview] = useState([])

  const [videoEdicao, setVideoEdicao] = useState(null)
  const [videoEdicaoPreview, setVideoEdicaoPreview] = useState("")

  const [salvandoEdicao, setSalvandoEdicao] = useState(false)

  const [modalIntegrantesAberto, setModalIntegrantesAberto] = useState(false)

  const [cookiesAceitos, setCookiesAceitos] = useState(
    localStorage.getItem("liga-cookies-aceitos") === "true"
  )

  const fileInputRef = useRef(null)
  const fileInputEdicaoRef = useRef(null)

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

  const postsOrdenados = useMemo(() => {
    return [...posts].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
  }, [posts])

  const postDestaque = useMemo(() => {
    const destaqueMarcado = postsOrdenados.find((post) => post.is_featured)
    return destaqueMarcado || postsOrdenados[0] || null
  }, [postsOrdenados])

  const postsFiltrados = useMemo(() => {
    return postsOrdenados.filter((post) => {
      const bateBusca =
        post.title?.toLowerCase().includes(busca.toLowerCase()) ||
        post.description?.toLowerCase().includes(busca.toLowerCase())

      const bateCategoria =
        filtroCategoria === "Todos" ||
        (post.category || "Geral") === filtroCategoria

      return bateBusca && bateCategoria
    })
  }, [postsOrdenados, busca, filtroCategoria])

  const postsGrid = useMemo(() => {
    if (!postDestaque) return postsFiltrados
    return postsFiltrados.filter((post) => post.id !== postDestaque.id)
  }, [postsFiltrados, postDestaque])

  function aceitarCookies() {
    localStorage.setItem("liga-cookies-aceitos", "true")
    setCookiesAceitos(true)
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
    setCategoria("Geral")
    setIsFeatured(false)
    setImagem(null)
    setImagemPreview("")
    setNomeArquivo("")
    setImagensExtras([])
    setImagensExtrasPreview([])
    setVideo(null)
    setVideoPreview("")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function acessarAreaComissao(e) {
    e.preventDefault()

    if (!codigoAcesso.trim()) {
      setMensagem("Digite o código da comissão.")
      return
    }

    const autorEncontrado = obterAutorPeloCodigo(codigoAcesso)

    if (!autorEncontrado) {
      setMensagem("Código inválido.")
      return
    }

    setMembroLogado(autorEncontrado)
    setComissaoAberta(true)
    setCodigoAcesso("")
    setMensagem(`Acesso liberado para ${autorEncontrado}.`)
  }

  function fecharAreaComissao() {
    setComissaoAberta(false)
    setMembroLogado("")
    setCodigoAcesso("")
    limparFormulario()
  }

  function validarArquivoImagem(arquivo) {
    if (!arquivo.type.startsWith("image/")) {
      setMensagem("Selecione um arquivo de imagem válido.")
      return false
    }

    const limiteMB = 2
    const tamanhoMaximo = limiteMB * 1024 * 1024

    if (arquivo.size > tamanhoMaximo) {
      setMensagem(`A imagem é muito grande. Use uma imagem de até ${limiteMB}MB.`)
      return false
    }

    return true
  }

  function validarArquivoVideo(arquivo) {
    if (!arquivo.type.startsWith("video/")) {
      setMensagem("Selecione um vídeo válido.")
      return false
    }

    const limiteMB = 6
    const tamanhoMaximo = limiteMB * 1024 * 1024

    if (arquivo.size > tamanhoMaximo) {
      setMensagem("Vídeo muito grande. Use um vídeo de até 6MB.")
      return false
    }

    return true
  }

  function lidarComUploadImagem(e) {
    const arquivo = e.target.files?.[0]

    if (!arquivo) return
    if (!validarArquivoImagem(arquivo)) return

    setImagem(arquivo)
    setNomeArquivo(arquivo.name)
    setImagemPreview(URL.createObjectURL(arquivo))
    setMensagem("")
  }

  function lidarComUploadImagensExtras(e) {
    const arquivos = Array.from(e.target.files || [])

    if (arquivos.length === 0) return

    const arquivosValidos = arquivos.filter((arquivo) =>
      validarArquivoImagem(arquivo)
    )

    setImagensExtras(arquivosValidos)
    setImagensExtrasPreview(
      arquivosValidos.map((arquivo) => URL.createObjectURL(arquivo))
    )
    setMensagem("")
  }

  function lidarComVideo(e) {
    const arquivo = e.target.files?.[0]

    if (!arquivo) return
    if (!validarArquivoVideo(arquivo)) return

    setVideo(arquivo)
    setVideoPreview(URL.createObjectURL(arquivo))
    setMensagem("")
  }

  function lidarComUploadImagemEdicao(e) {
    const arquivo = e.target.files?.[0]

    if (!arquivo) return
    if (!validarArquivoImagem(arquivo)) return

    setImagemEdicao(arquivo)
    setImagemEdicaoPreview(URL.createObjectURL(arquivo))
    setMensagem("")
  }

  function lidarComUploadImagensExtrasEdicao(e) {
    const arquivos = Array.from(e.target.files || [])

    if (arquivos.length === 0) return

    const arquivosValidos = arquivos.filter((arquivo) =>
      validarArquivoImagem(arquivo)
    )

    setImagensExtrasEdicao(arquivosValidos)
    setImagensExtrasEdicaoPreview(
      arquivosValidos.map((arquivo) => URL.createObjectURL(arquivo))
    )
    setMensagem("")
  }

  function lidarComVideoEdicao(e) {
    const arquivo = e.target.files?.[0]

    if (!arquivo) return
    if (!validarArquivoVideo(arquivo)) return

    setVideoEdicao(arquivo)
    setVideoEdicaoPreview(URL.createObjectURL(arquivo))
    setMensagem("")
  }

  async function publicarPost(e) {
    e.preventDefault()

    if (!membroLogado) {
      setMensagem("Acesso não autorizado.")
      return
    }

    if (!titulo || !descricao || !imagem) {
      setMensagem("Preencha todos os campos e envie uma imagem principal.")
      return
    }

    try {
      setPublicando(true)

      const caminhoImagem = await uploadImagem(imagem)
      const caminhosExtras = await uploadMultiplasImagens(imagensExtras)
      const caminhoVideo = video ? await uploadVideo(video) : null

      await criarPost({
        title: titulo.trim(),
        description: descricao.trim(),
        imagePath: caminhoImagem,
        galleryPaths: caminhosExtras,
        videoPath: caminhoVideo,
        author: membroLogado,
        category: categoria,
        isFeatured,
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
      await excluirPostBanco(
        postParaExcluir.id,
        postParaExcluir.image_path,
        postParaExcluir.gallery_paths || []
      )
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

  function abrirModalEditar(post) {
    setPostParaEditar(post)
    setTituloEdicao(post.title)
    setDescricaoEdicao(post.description)
    setCategoriaEdicao(post.category || "Geral")
    setIsFeaturedEdicao(!!post.is_featured)
    setImagemEdicao(null)
    setImagemEdicaoPreview(post.image_url)
    setImagensExtrasEdicao([])
    setImagensExtrasEdicaoPreview(post.gallery_urls || [])
    setVideoEdicao(null)
    setVideoEdicaoPreview(post.video_url || "")
    setModalEditarAberto(true)
  }

  function fecharModalEditar() {
    setPostParaEditar(null)
    setTituloEdicao("")
    setDescricaoEdicao("")
    setCategoriaEdicao("Geral")
    setIsFeaturedEdicao(false)
    setImagemEdicao(null)
    setImagemEdicaoPreview("")
    setImagensExtrasEdicao([])
    setImagensExtrasEdicaoPreview([])
    setVideoEdicao(null)
    setVideoEdicaoPreview("")
    setModalEditarAberto(false)

    if (fileInputEdicaoRef.current) {
      fileInputEdicaoRef.current.value = ""
    }
  }

  async function salvarEdicao() {
    if (!postParaEditar) return

    try {
      setSalvandoEdicao(true)

      let novoCaminho = null
      let novosCaminhosExtras = null
      let novoVideo = null

      if (imagemEdicao) {
        novoCaminho = await uploadImagem(imagemEdicao)
      }

      if (imagensExtrasEdicao.length > 0) {
        novosCaminhosExtras = await uploadMultiplasImagens(imagensExtrasEdicao)
      }

      if (videoEdicao) {
        novoVideo = await uploadVideo(videoEdicao)
      }

      await editarPostBanco({
        id: postParaEditar.id,
        title: tituloEdicao.trim(),
        description: descricaoEdicao.trim(),
        imagePath: novoCaminho,
        galleryPaths: novosCaminhosExtras,
        videoPath: novoVideo,
        category: categoriaEdicao,
        isFeatured: isFeaturedEdicao,
      })

      setMensagem("Postagem editada com sucesso.")
      fecharModalEditar()
      await carregarPosts()
    } catch (error) {
      console.error(error)
      setMensagem("Erro ao editar a postagem.")
    } finally {
      setSalvandoEdicao(false)
    }
  }

  function compartilharPost(post) {
    const link = `${window.location.origin}/post/${post.id}`

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: link,
      })
    } else {
      navigator.clipboard
        .writeText(link)
        .then(() => setMensagem("Link da postagem copiado com sucesso."))
        .catch(() =>
          setMensagem("Não foi possível copiar o link da postagem.")
        )
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

  function resumirTexto(texto, limite = 140) {
    if (!texto) return ""
    if (texto.length <= limite) return texto
    return `${texto.slice(0, limite).trim()}...`
  }

  return (
    <div>
      <header className="sticky top-0 z-50 border-b border-green-100 bg-white/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo-leae.jpeg"
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
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-sm shadow-sm">
              🌱 Educação ambiental que transforma
            </span>

            <h2 className="text-4xl md:text-6xl font-extrabold text-green-950 leading-tight mt-6">
              Liga Estudantil Ambiental EPEM
            </h2>

            <p className="text-lg md:text-xl text-gray-700 mt-6 leading-9 max-w-2xl">
              Um espaço criado para inspirar, conscientizar e mobilizar jovens em
              prol do meio ambiente, da sustentabilidade e do cuidado com a nossa
              escola.
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

          <div className="flex justify-center">
            <div className="bg-white shadow-xl rounded-3xl p-4 w-full max-w-md">
              <img
                src="/logo-leae.jpeg"
                alt="Logo da Liga Estudantil Ambiental EPEM"
                className="w-full h-[430px] object-contain rounded-2xl p-6 bg-[#87a07c]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="atividades" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
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

        <div className="mt-10 grid lg:grid-cols-[1.3fr_0.7fr] gap-6 items-start">
          <div>
            {postDestaque && (
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-green-100">
                <div className="relative">
                  <img
                    src={postDestaque.image_url}
                    alt={postDestaque.title}
                    className="w-full h-[340px] md:h-[460px] object-cover"
                  />

                  <div className="absolute top-4 left-4">
                    <span className="bg-green-700 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                      Destaque
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-sm text-gray-400 font-medium">
                      {formatarData(postDestaque.created_at)}
                    </p>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800">
                      {postDestaque.category || "Geral"}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-5xl font-extrabold text-green-950 mt-4 leading-tight">
                    {postDestaque.title}
                  </h3>

                  <p className="text-gray-600 mt-5 leading-8 text-base md:text-lg">
                    {resumirTexto(postDestaque.description, 240)}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-sm text-gray-500">
                      Postado por{" "}
                      <span className="font-semibold text-green-800">
                        {postDestaque.author_name}
                      </span>
                    </p>

                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => compartilharPost(postDestaque)}
                        className="border border-green-200 text-green-800 hover:bg-green-50 font-semibold px-5 py-3 rounded-xl transition"
                      >
                        Compartilhar
                      </button>

                      <Link
                        to={`/post/${postDestaque.id}`}
                        className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-3 rounded-xl transition"
                      >
                        Ler matéria completa
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-5">
            <h3 className="text-xl font-bold text-green-950">
              Buscar e filtrar
            </h3>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  Buscar postagem
                </label>
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Digite o título ou texto"
                  className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  Categoria
                </label>
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 bg-white"
                >
                  {CATEGORIAS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
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
            {postsGrid.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-green-100 hover:-translate-y-2 hover:shadow-2xl transition duration-300"
              >
                <button
                  onClick={() => abrirImagem(post.image_url)}
                  className="block w-full text-left"
                >A
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-64 object-cover"
                  />
                </button>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-sm text-gray-400 font-medium">
                      {formatarData(post.created_at)}
                    </p>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800">
                      {post.category || "Geral"}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-green-900 mt-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 mt-4 leading-7">
                    {resumirTexto(post.description, 140)}
                  </p>

                  {post.video_url && (
                    <video
                      src={post.video_url}
                      controls
                      className="w-full mt-4 rounded-xl"
                    />
                  )}

                  <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                    <p className="text-sm text-gray-500">
                      Postado por{" "}
                      <span className="font-semibold text-green-800">
                        {post.author_name}
                      </span>
                    </p>

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <Link
                        to={`/post/${post.id}`}
                        className="text-sm font-semibold text-green-700 hover:text-green-900 transition"
                      >
                        Ler mais
                      </Link>

                      <div className="flex items-center gap-4 flex-wrap">
                        <button
                          onClick={() => abrirImagem(post.image_url)}
                          className="text-sm font-semibold text-green-700 hover:text-green-900 transition"
                        >
                          Ver imagem
                        </button>

                        <button
                          onClick={() => compartilharPost(post)}
                          className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition"
                        >
                          Compartilhar
                        </button>

                        {comissaoAberta && (
                          <>
                            <button
                              onClick={() => abrirModalEditar(post)}
                              className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                            >
                              Editar
                            </button>

                            <button
                              onClick={() => abrirModalExcluir(post)}
                              className="text-sm font-semibold text-red-600 hover:text-red-800 transition"
                            >
                              Excluir postagem
                            </button>
                          </>
                        )}
                      </div>
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
          <button
            type="button"
            onClick={() => setModalIntegrantesAberto(true)}
            className="bg-green-900 text-white rounded-3xl p-8 shadow-lg text-left hover:opacity-95 transition"
          >
            <p className="text-sm uppercase tracking-wider text-green-100">
              Membros ativos
            </p>
            <h4 className="text-4xl font-extrabold mt-3">20</h4>
            <p className="mt-3 text-sm text-green-100">
              Toque para ver os integrantes
            </p>
          </button>

          <div className="bg-white border border-green-100 rounded-3xl p-8 shadow-sm">
            <p className="text-sm uppercase tracking-wider text-gray-500">
              Projetos
            </p>
            <h4 className="text-4xl font-extrabold mt-3 text-green-900">2</h4>
          </div>
        </div>
      </section>

      <section id="contato" className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-green-900 to-emerald-800 rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <p className="uppercase tracking-[0.2em] text-sm text-green-100">
            Contato
          </p>

          <h3 className="text-3xl md:text-4xl font-bold mt-3">
            Quer acompanhar ou apoiar nossas ações?
          </h3>

          <p className="mt-4 text-green-50 max-w-2xl leading-8">
            Entre em contato com a Liga Estudantil Ambiental EPEM e acompanhe
            nossas atividades, projetos e iniciativas em defesa do meio ambiente.
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
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition"
              style={{
                background: "linear-gradient(45deg, #f58529, #dd2a7b, #8134af)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0120 7.75v8.5A3.75 3.75 0 0116.25 20h-8.5A3.75 3.75 0 014 16.25v-8.5A3.75 3.75 0 017.75 4zm8.25 1.5a.75.75 0 100 1.5.75.75 0 000-1.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
              </svg>
              Instagram da Liga
            </a>
          </div>
        </div>
      </section>

      <section id="comissao" className="max-w-7xl mx-auto px-6 pb-16">
        <div className="mt-2 max-w-md space-y-3">
          <p className="text-sm text-gray-500 font-medium">
            Área da comissão
          </p>

          {!comissaoAberta ? (
            <form
              onSubmit={acessarAreaComissao}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="password"
                value={codigoAcesso}
                onChange={(e) => setCodigoAcesso(e.target.value)}
                placeholder="Digite o código"
                className="flex-1 rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 bg-white"
              />

              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-3 rounded-xl transition"
              >
                Acessar
              </button>
            </form>
          ) : (
            <div className="bg-white rounded-3xl border border-green-100 shadow-sm p-6 md:p-8">
              <p className="text-gray-500 text-sm uppercase tracking-[0.2em]">
                Área restrita
              </p>

              <h3 className="text-2xl md:text-3xl font-bold text-green-950 mt-3">
                Painel da comissão
              </h3>

              <p className="text-gray-600 mt-4 leading-7 max-w-2xl">
                Acesso liberado. Você está usando o painel como{" "}
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
                    Categoria
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 bg-white"
                  >
                    {CATEGORIAS.filter((c) => c !== "Todos").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
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

                <label className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <span className="text-sm font-semibold text-green-900">
                    Marcar como postagem em destaque
                  </span>
                </label>

                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">
                    Imagem principal
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

                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">
                    Mais imagens (opcional)
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={lidarComUploadImagensExtras}
                    className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 bg-white"
                  />

                  {imagensExtrasPreview.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {imagensExtrasPreview.map((imagem, index) => (
                        <img
                          key={index}
                          src={imagem}
                          alt={`Prévia extra ${index + 1}`}
                          className="w-full h-24 object-cover rounded-xl border border-green-100"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-green-900 mb-2">
                    Vídeo curto (opcional)
                  </label>

                  <input
                    type="file"
                    accept="video/*"
                    onChange={lidarComVideo}
                    className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 bg-white"
                  />

                  <p className="text-sm text-gray-500 mt-2">
                    Envie um vídeo curto de até 6MB.
                  </p>

                  {videoPreview && (
                    <video
                      src={videoPreview}
                      controls
                      className="w-full max-h-72 object-cover rounded-2xl border border-green-100 mt-4"
                    />
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

              <div className="mt-10 pt-8 border-t border-green-100">
                <h4 className="text-xl font-bold text-green-950">
                  Gerenciar postagens
                </h4>

                <p className="text-gray-600 mt-2">
                  Edite ou exclua rapidamente as postagens já publicadas.
                </p>

                <div className="mt-6 space-y-4">
                  {postsOrdenados.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-2xl border border-green-100 bg-green-50/50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      <div>
                        <p className="text-sm text-gray-400">
                          {formatarData(post.created_at)}
                        </p>

                        <h5 className="text-lg font-bold text-green-950 mt-1">
                          {post.title}
                        </h5>

                        <p className="text-sm text-gray-600 mt-1">
                          Autor:{" "}
                          <span className="font-semibold text-green-800">
                            {post.author_name}
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        <button
                          onClick={() => abrirModalEditar(post)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => abrirModalExcluir(post)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl transition"
                        >
                          Excluir
                        </button>

                        <Link
                          to={`/post/${post.id}`}
                          className="border border-green-200 text-green-800 hover:bg-green-50 font-semibold px-4 py-2 rounded-xl transition"
                        >
                          Ver
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
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

      {!cookiesAceitos && (
        <div className="fixed bottom-4 left-4 right-4 z-[120] max-w-4xl mx-auto bg-white border border-green-100 shadow-2xl rounded-2xl p-4 md:p-5">
          <p className="text-sm text-gray-700 leading-6">
            Este site usa cookies e armazenamento local para melhorar a
            experiência, manter preferências e funcionamento básico.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={aceitarCookies}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2 rounded-xl transition"
            >
              Aceitar
            </button>
          </div>
        </div>
      )}

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

      {modalIntegrantesAberto && (
  <div
    className="fixed inset-0 z-[108] bg-black/60 flex items-center justify-center p-4"
    onClick={() => setModalIntegrantesAberto(false)}
  >
    <div
      className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-green-100 p-6 animate-scale-in max-h-[90vh] overflow-hidden flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-gray-500 text-sm uppercase tracking-[0.2em]">
        Integrantes
      </p>

      <h3 className="text-2xl font-bold text-green-950 mt-3">
        Membros da Liga
      </h3>

      <div className="mt-6 space-y-3 overflow-y-auto pr-2">
        {INTEGRANTES.map((nome, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-100 px-4 py-3"
          >
            <span className="font-bold text-green-800">{index + 1}.</span>
            <span className="text-green-900">{nome}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-green-100">
        <button
          type="button"
          onClick={() => setModalIntegrantesAberto(false)}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
)}

      {modalEditarAberto && postParaEditar && (
        <div className="fixed inset-0 z-[109] bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-green-100 p-6 md:p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <p className="text-gray-500 text-sm uppercase tracking-[0.2em]">
              Edição
            </p>

            <h3 className="text-2xl font-bold text-green-950 mt-3">
              Editar postagem
            </h3>

            <div className="space-y-5 mt-8">
              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={tituloEdicao}
                  onChange={(e) => setTituloEdicao(e.target.value)}
                  className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  Categoria
                </label>
                <select
                  value={categoriaEdicao}
                  onChange={(e) => setCategoriaEdicao(e.target.value)}
                  className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 bg-white"
                >
                  {CATEGORIAS.filter((c) => c !== "Todos").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  Descrição
                </label>
                <textarea
                  value={descricaoEdicao}
                  onChange={(e) => setDescricaoEdicao(e.target.value)}
                  rows="6"
                  className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 resize-none"
                />
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={isFeaturedEdicao}
                  onChange={(e) => setIsFeaturedEdicao(e.target.checked)}
                />
                <span className="text-sm font-semibold text-green-900">
                  Manter como postagem em destaque
                </span>
              </label>

              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  Nova imagem principal (opcional)
                </label>
                <input
                  ref={fileInputEdicaoRef}
                  type="file"
                  accept="image/*"
                  onChange={lidarComUploadImagemEdicao}
                  className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 bg-white"
                />

                {imagemEdicaoPreview && (
                  <div className="mt-4">
                    <img
                      src={imagemEdicaoPreview}
                      alt="Prévia da edição"
                      className="w-full max-h-72 object-cover rounded-2xl border border-green-100"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  Mais imagens (opcional)
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={lidarComUploadImagensExtrasEdicao}
                  className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 bg-white"
                />

                {imagensExtrasEdicaoPreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {imagensExtrasEdicaoPreview.map((imagem, index) => (
                      <img
                        key={index}
                        src={imagem}
                        alt={`Prévia extra ${index + 1}`}
                        className="w-full h-24 object-cover rounded-xl border border-green-100"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-900 mb-2">
                  Vídeo curto (opcional)
                </label>

                <input
                  type="file"
                  accept="video/*"
                  onChange={lidarComVideoEdicao}
                  className="w-full rounded-xl border border-green-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 bg-white"
                />

                {videoEdicaoPreview && (
                  <video
                    src={videoEdicaoPreview}
                    controls
                    className="w-full max-h-72 object-cover rounded-2xl border border-green-100 mt-4"
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={salvarEdicao}
                  disabled={salvandoEdicao}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition"
                >
                  {salvandoEdicao ? "Salvando..." : "Salvar alterações"}
                </button>

                <button
                  type="button"
                  onClick={fecharModalEditar}
                  className="border border-green-200 text-green-800 hover:bg-green-50 font-semibold px-6 py-3 rounded-xl transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
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
              Para excluir{" "}
              <span className="font-semibold">{postParaExcluir.title}</span>,
              digite o código de{" "}
              <span className="font-semibold text-green-800">
                {postParaExcluir.author_name}
              </span>.
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
                {excluindo ? "Excluindo..." : "Confirma"}
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