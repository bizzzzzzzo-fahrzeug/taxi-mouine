import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Tracking from './pages/Tracking'
import Login from './pages/Login'
import Register from './pages/Register'
import History from './pages/History'

export default function App() {
  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buchen" element={<Booking />} />
          <Route path="/tracking/:id" element={<Tracking />} />
          <Route path="/anmelden" element={<Login />} />
          <Route path="/registrieren" element={<Register />} />
          <Route path="/verlauf" element={<History />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
