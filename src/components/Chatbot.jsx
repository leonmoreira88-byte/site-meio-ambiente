import { useState } from 'react';

const Chatbot = () => {
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
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      const data = await response.json();

      // CORREÇÃO AQUI: Verifica se a estrutura data.choices[0] existe antes de ler
      if (response.ok && data.choices && data.choices[0] && data.choices[0].message) {
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: data.choices[0].message.content 
        }]);
      } else {
        // Se a API retornar erro, mostramos a mensagem de erro que vem dela
        const errorMsg = data.error?.message || data.error || 'Resposta inválida da API.';
        throw new Error(errorMsg);
      }

    } catch (error) {
      console.error('Erro no Chatbot:', error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: `Erro: ${error.message}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all active:scale-95"
      >
        {isOpen ? '✖ Fechar' : '💬 Robschat'}
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <div className="p-3 bg-green-600 text-white font-bold flex justify-between">
            <span>Robschat</span>
            {isLoading && <span className="animate-pulse text-xs">Digitando...</span>}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none' 
                    : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo..."
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;