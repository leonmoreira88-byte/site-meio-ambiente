import { useState } from 'react';

const Chatbot = () => {
  // Definição dos estados que o ESLint disse que estavam faltando
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou o Robschat. Como posso ajudar você hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    
    // Atualiza a tela com a mensagem do usuário
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Faz a chamada para a sua Cloudflare Function
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) throw new Error('Erro na resposta da API');

      const data = await response.json();
      
      // Adiciona a resposta do Robschat à conversa
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: data.choices[0].message.content 
      }]);
    } catch (error) {
      console.error('Erro no Chatbot:', error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, estou com dificuldades técnicas no momento.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Botão para abrir/fechar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
      >
        {isOpen ? 'Fechar Chat' : 'Conversar com Robschat'}
      </button>

      {/* Janela do Chat */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-2xl flex flex-col">
          <div className="p-3 bg-green-600 text-white rounded-t-lg font-bold">
            Robschat - Assistente Ambiental
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded-lg ${msg.role === 'user' ? 'bg-green-100 text-green-900' : 'bg-gray-100 text-gray-900'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-gray-400 text-sm">Robschat está digitando...</div>}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;