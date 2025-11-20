import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import AdminSignup from './pages/AdminSignup'
import PilotSignup from './pages/PilotSignup'
import Login from './pages/Login'
import AuthVerify from './pages/AuthVerify'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin-signup" element={<AdminSignup />} />
      <Route path="/pilot-signup" element={<PilotSignup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<AuthVerify />} />
    </Routes>
  )
}

export default App