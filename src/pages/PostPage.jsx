import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { buscarPostPorId } from "../services/posts";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [imagemAtiva, setImagemAtiva] = useState("");

  useEffect(() => {
    carregarPost();
  }, [id]);

  async function carregarPost() {
    try {
      setCarregando(true);
      setErro("");

      const dados = await buscarPostPorId(id);
      setPost(dados);
      // Define a primeira imagem visível (principal ou primeira da galeria)
      setImagemAtiva(dados.image_url || dados.gallery_urls?.[0] || "");
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar a postagem.");
    } finally {
      setCarregando(false);
    }
  }

  function formatarData(data) {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function compartilharPost() {
    const link = window.location.href;
    navigator.clipboard
      .writeText(link)
      .then(() => alert("Link copiado com sucesso!"))
      .catch(() => alert("Não foi possível copiar o link."));
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-green-700 animate-pulse font-medium text-lg">Carregando postagem...</p>
      </div>
    );
  }

  if (erro || !post) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-red-600 font-medium text-xl">
          {erro || "Postagem não encontrada."}
        </p>
        <Link
          to="/"
          className="inline-block mt-6 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Voltar para o Início
        </Link>
      </div>
    );
  }

  // Junta a imagem principal com a galeria para mostrar tudo embaixo
  const todasImagens = [
    ...(post.image_url ? [post.image_url] : []),
    ...(post.gallery_urls || []),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f4f8f4]">
      {/* Cabeçalho do Post */}
      <header className="border-b border-green-100 bg-white/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo-leae.jpeg" // Caminho correto para sua logo
              alt="Logo LEAE"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-green-100"
            />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-green-950 leading-tight">
                LEAE - Ernani Mero
              </h1>
              <p className="hidden md:block text-xs text-gray-500">
                Laboratório de Estudos Ambientais e Ecológicos
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-100 transition"
          >
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 md:py-12">
        <article className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-green-50">
          
          {/* Imagem em Destaque */}
          {imagemAtiva && (
            <div className="relative group">
              <img
                src={imagemAtiva}
                alt={post.title}
                className="w-full h-[300px] md:h-[500px] object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          <div className="p-6 md:p-12">
            {/* Metadados */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {post.category || "Meio Ambiente"}
                </span>
                <span className="text-gray-400 text-sm">{formatarData(post.created_at)}</span>
              </div>
              <button 
                onClick={compartilharPost}
                className="text-green-700 hover:text-green-900 text-sm font-bold flex items-center gap-1"
              >
                🔗 Copiar Link
              </button>
            </div>

            {/* Título e Autor */}
            <h2 className="text-3xl md:text-5xl font-black text-green-950 mb-4 leading-tight">
              {post.title}
            </h2>
            
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-100">
              <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold">
                {post.author_name?.charAt(0) || "L"}
              </div>
              <div>
                <p className="text-sm text-gray-500">Publicado por</p>
                <p className="text-green-900 font-bold">{post.author_name || "Equipe LEAE"}</p>
              </div>
            </div>

            {/* Galeria de Miniaturas */}
            {todasImagens.length > 1 && (
              <div className="mb-10">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Galeria do Projeto
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {todasImagens.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImagemAtiva(img)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                        imagemAtiva === img ? 'border-green-600 scale-105' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conteúdo do Texto */}
            <div className="prose prose-green max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-lg md:text-xl">
                {post.description}
              </div>
            </div>

            {/* Rodapé do Post */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
              <p className="text-gray-500 text-sm text-center md:text-left">
                Gostou desse projeto? Compartilhe com seus amigos para espalhar a consciência ambiental!
              </p>
              <Link
                to="/"
                className="w-full md:w-auto text-center bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg shadow-green-200"
              >
                Voltar ao Início
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}