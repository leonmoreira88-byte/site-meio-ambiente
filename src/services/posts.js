import { supabase } from "../lib/supabase"

// 🔽 buscar posts do banco
export async function buscarPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  // gera URL da imagem
  return data.map((post) => {
    const { data: urlData } = supabase
      .storage
      .from("post-images")
      .getPublicUrl(post.image_path)

    return {
      ...post,
      image_url: urlData.publicUrl,
    }
  })
}

// 🔽 upload da imagem
export async function uploadImagem(file) {
  const nome = `${Date.now()}-${file.name}`
  const caminho = `posts/${nome}`

  const { error } = await supabase.storage
    .from("post-images")
    .upload(caminho, file)

  if (error) {
    console.error(error)
    throw new Error("Erro ao enviar imagem")
  }

  return caminho
}

// 🔽 criar post
export async function criarPost({ title, description, imagePath, author }) {
  const { error } = await supabase.from("posts").insert([
    {
      title,
      description,
      image_path: imagePath,
      author_name: author,
    },
  ])

  if (error) {
    console.error(error)
    throw new Error("Erro ao criar post")
  }
}

// 🔽 excluir post
export async function excluirPostBanco(id, imagePath) {
  // apaga imagem
  await supabase.storage.from("post-images").remove([imagePath])

  // apaga do banco
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)

  if (error) {
    console.error(error)
    throw new Error("Erro ao excluir")
  }
}
