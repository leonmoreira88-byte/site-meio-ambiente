export async function onRequestPost(context) {
  const { request, env } = context;

  // Pega a Secret que você acabou de configurar no painel
  const apiKey = env.GROQ_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "GROQ_API_KEY não encontrada no servidor." }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { messages } = await request.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: messages,
      }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}