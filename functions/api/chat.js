export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    // 🔹 Pega o corpo da requisição
    const body = await request.json();
    const message = body?.message?.trim();

    if (!message) {
      return Response.json(
        { error: "Mensagem inválida." },
        { status: 400 }
      );
    }

    // 🔹 Verifica se a chave existe
    if (!env.GROQ_API_KEY) {
      return Response.json(
        { error: "GROQ_API_KEY não configurada no Cloudflare." },
        { status: 500 }
      );
    }

    // 🔹 Chamada para a API da Groq
    const respostaGroq = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "Você é o Robschat, assistente da Liga Estudantil Ambiental EPEM. Ajude sobre reciclagem, lixo e meio ambiente. A liga é exclusiva para alunos da escola e não há vagas. Responda de forma curta e direta (máx 2-3 frases).",
            },
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: 150,
        }),
      }
    );

    const data = await respostaGroq.json();

    // 🔹 Se a Groq retornar erro
    if (!respostaGroq.ok) {
      console.error("Erro Groq:", data);

      return Response.json(
        {
          error: "Erro ao consultar a Groq.",
          details: data,
        },
        { status: 500 }
      );
    }

    // 🔹 Extrai resposta da IA
    const reply =
      data?.choices?.[0]?.message?.content || "Sem resposta.";

    return Response.json({ reply });
  } catch (error) {
    console.error("Erro interno:", error);

    return Response.json(
      {
        error: "Erro interno no servidor.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}