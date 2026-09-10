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
import { GaleriPage } from './pages/GaleriPage'

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
          <Route path="/galeri" element={<GaleriPage />} />
          <Route path="/u/profile" element={<div>Profile Page</div>} />
          <Route path="/u/forum" element={<div>Forum Page</div>} />
          <Route path="/u/chat" element={<div>About Page</div>} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
