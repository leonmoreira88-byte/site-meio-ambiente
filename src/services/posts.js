import { supabase } from "../lib/supabase"

function montarUrlPublica(caminho) {
  const { data } = supabase.storage.from("post-images").getPublicUrl(caminho)
  return data.publicUrl
}

export async function buscarPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("ERRO AO BUSCAR POSTS:", error)
    throw new Error(error.message)
  }

  return data.map((post) => ({
    ...post,
    image_url: post.image_path ? montarUrlPublica(post.image_path) : "",
    video_url: post.video_path ? montarUrlPublica(post.video_path) : "",
    gallery_urls: Array.isArray(post.gallery_paths)
      ? post.gallery_paths.map((path) => montarUrlPublica(path))
      : [],
  }))
}

export async function buscarPostPorId(id) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("ERRO AO BUSCAR POST:", error)
    throw new Error(error.message)
  }

  return {
    ...data,
    image_url: data.image_path ? montarUrlPublica(data.image_path) : "",
    video_url: data.video_path ? montarUrlPublica(data.video_path) : "",
    gallery_urls: Array.isArray(data.gallery_paths)
      ? data.gallery_paths.map((path) => montarUrlPublica(path))
      : [],
  }
}

// NOVA FUNÇÃO: Conta a quantidade total de postagens na tabela
export async function contarProjetos() {
  try {
    const { count, error } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("ERRO AO CONTAR PROJETOS:", error);
    return 0;
  }
}

export async function uploadImagem(file) {
  const nome = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`
  const caminho = `posts/${nome}`

  const { error } = await supabase.storage
    .from("post-images")
    .upload(caminho, file)

  if (error) {
    console.error("ERRO NO UPLOAD DA IMAGEM:", error)
    throw new Error(error.message)
  }

  return caminho
}

export async function uploadMultiplasImagens(files) {
  const caminhos = []

  for (const file of files) {
    const caminho = await uploadImagem(file)
    caminhos.push(caminho)
  }

  return caminhos
}

export async function uploadVideo(file) {
  const nome = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`
  const caminho = `videos/${nome}`

  const { error } = await supabase.storage
    .from("post-images")
    .upload(caminho, file)

  if (error) {
    console.error("ERRO NO UPLOAD DO VÍDEO:", error)
    throw new Error(error.message)
  }

  return caminho
}

export async function criarPost({
  title,
  description,
  imagePath,
  galleryPaths,
  videoPath,
  author,
  category,
  isFeatured,
}) {
  const { error } = await supabase.from("posts").insert([
    {
      title,
      description,
      image_path: imagePath,
      gallery_paths: galleryPaths,
      video_path: videoPath,
      author_name: author,
      category,
      is_featured: isFeatured,
    },
  ])

  if (error) {
    console.error("ERRO AO CRIAR POST:", error)
    throw new Error(error.message)
  }
}

export async function editarPostBanco({
  id,
  title,
  description,
  imagePath,
  galleryPaths,
  videoPath,
  category,
  isFeatured,
}) {
  const updateData = {
    title,
    description,
    category,
    is_featured: isFeatured,
    updated_at: new Date().toISOString(),
  }

  if (imagePath) updateData.image_path = imagePath
  if (galleryPaths) updateData.gallery_paths = galleryPaths
  if (videoPath) updateData.video_path = videoPath

  const { error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", id)

  if (error) {
    console.error("ERRO AO EDITAR POST:", error)
    throw new Error(error.message)
  }
}

export async function excluirPostBanco(id, imagePath, galleryPaths = []) {
  const arquivos = []

  if (imagePath) arquivos.push(imagePath)
  if (Array.isArray(galleryPaths)) arquivos.push(...galleryPaths)

  if (arquivos.length > 0) {
    const { error: erroImagem } = await supabase.storage
      .from("post-images")
      .remove(arquivos)

    if (erroImagem) {
      console.error("ERRO AO APAGAR IMAGENS:", erroImagem)
      throw new Error(erroImagem.message)
    }
  }

  const { error: erroBanco } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)

  if (erroBanco) {
    console.error("ERRO AO APAGAR POST:", erroBanco)
    throw new Error(erroBanco.message)
  }
}