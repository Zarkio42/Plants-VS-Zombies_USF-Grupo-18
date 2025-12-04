import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx'
import TelaLogin from './pages/TelaLogin.tsx'
import Deck from './pages/Deck.tsx';

function App() {
  return (
<BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaLogin />} />
        <Route path="/login" element={<TelaLogin />} />
        <Route path="/batalha" element={<Home />} />
        <Route path="/deck" element={<Deck />} />
      </Routes>
    </BrowserRouter>
  )
}


export default App
