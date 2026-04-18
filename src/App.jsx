import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import Chatbot from "./components/Chatbot"; 

function App() {
  return (
    <div className="min-h-screen bg-[#f4f8f4] text-gray-800 relative">
      
      {/* Aqui ficam as páginas do seu site */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
      
      {/* O Chatbot fica fora das rotas para aparecer em todas as páginas */}
      <Chatbot />
      
    </div>
  );
}

export default App;