export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const message = body?.message?.trim();

    if (!message) {
      return Response.json(
        { error: "Mensagem inválida." },
        { status: 400 }
      );
    }

    const respostaGroq = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
              "Você é o Robschat, o assistente virtual oficial da Liga Estudantil Ambiental EPEM. Sua missão é ajudar sobre reciclagem, descarte de lixo e meio ambiente. A Liga é exclusiva para alunos da escola e não há vagas para novos membros. Seja extremamente resumido e direto. Responda em no máximo 2 ou 3 frases curtas.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 150,
      }),
    });

    if (!respostaGroq.ok) {
      const erroTexto = await respostaGroq.text();

      return Response.json(
        {
          error: "Erro ao consultar a Groq.",
          details: erroTexto,
        },
        { status: 500 }
      );
    }

    const data = await respostaGroq.json();
    const reply =
      data?.choices?.[0]?.message?.content || "Sem resposta.";

    return Response.json({ reply });
  } catch (error) {
    return Response.json(
      {
        error: "Erro interno no servidor.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}