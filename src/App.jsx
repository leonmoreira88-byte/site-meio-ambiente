import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import PostPage from "./pages/PostPage"

function App() {
  return (
    <div className="min-h-screen bg-[#f4f8f4] text-gray-800">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
    </div>
  )
}

export default App