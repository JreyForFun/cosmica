import { useContext } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom"
import './App.css'
import Layout from './components/layout/layout'
import { AuthContext } from './context/auth-context'
import { CosmicaDetailPage } from './pages/CosmicaDetailPage'
import { ElcovekPage } from './pages/ElcovekPage'
import { LoginPage } from './pages/LoginPage'
import { PaliaAndromi } from './pages/PaliaAndromiPage'
import { SignupPage } from './pages/SignupPage'
import { SOTDPage } from './pages/SOTDPage'
import { VibteoPage } from './pages/VibteoPage'

function ProtectedRoute() {
  const auth = useContext(AuthContext)
  const location = useLocation()

  if (!auth?.user) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<SOTDPage />} />
          <Route path="/SOTD" element={<SOTDPage />} />
          <Route path="/palia-andromi" element={<PaliaAndromi />} />
          <Route path="/cosmica/:date" element={<CosmicaDetailPage />} />
          <Route path="/elcovek" element={<ElcovekPage />} />
          <Route path="/vibteo" element={<VibteoPage />} />
          <Route path="/galeri" element={<h1>Settings</h1>} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
