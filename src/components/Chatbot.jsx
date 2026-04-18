import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Olá! Sou o Robschat, o assistente da Liga Ambiental EPEM 🌿. Como posso ajudar você hoje?",
    },
  ]);

  const messagesEndRef = useRef(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  async function enviarMensagem(e) {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const textoUsuario = input.trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", text: textoUsuario }
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const resposta = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textoUsuario
        })
      });

      let data = {};

      try {
        data = await resposta.json();
      } catch {
        data = {};
      }

      if (!resposta.ok) {
        console.error("Erro da API:", resposta.status, data);
        throw new Error(data?.error || "Erro ao chamar a API");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "Sem resposta."
        }
      ]);
    } catch (error) {
      console.error("Erro no chatbot:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Ops! Tive um problema de conexão. Tente de novo! 🌱"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[150]">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-700 hover:bg-green-800 text-white rounded-full p-4 shadow-2xl flex items-center justify-center transition-transform hover:scale-105"
          aria-label="Abrir chatbot"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-[90vw] sm:w-96 h-[500px] max-h-[80vh] rounded-2xl shadow-2xl border border-green-100 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-green-800 to-green-700 text-white p-4 flex justify-between items-center shrink-0">
            <h3 className="font-bold flex items-center gap-2">
              <span>🤖</span>
              <span>Robschat</span>
            </h3>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition"
              aria-label="Fechar chatbot"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-[#f4f8f4] space-y-3 scroll-smooth">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-green-700 text-white rounded-br-none"
                      : "bg-white border border-green-200 text-gray-700 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-green-200 text-gray-500 rounded-xl rounded-bl-none p-3 text-sm shadow-sm animate-pulse">
                  Pensando...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={enviarMensagem}
            className="p-3 border-t border-green-100 bg-white flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Fale com o Robschat..."
              className="flex-1 rounded-xl border border-green-200 px-4 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-green-700 text-white px-4 py-2 rounded-xl disabled:opacity-50 hover:bg-green-800 transition font-medium"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}