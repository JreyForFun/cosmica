import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'

import { Route, Routes } from "react-router-dom"
import './App.css'
import Layout from './components/layout/layout'
import { SOTDPage } from './pages/SOTDPage'
import { PaliaAndromi } from './pages/PaliaAndromiPage'
import { ElcovekPage } from './pages/ElcovekPage'
import { VibteoPage } from './pages/VibteoPage'

function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={ <LoginPage /> }/>
      <Route path="/auth/register" element={< SignupPage />} />

      <Route element={<Layout />} >
        <Route path="/" element={<SOTDPage />} />
        <Route path="/SOTD" element={<SOTDPage />} />
        <Route path="/palia-andromi" element={<PaliaAndromi />} />
        <Route path="/elcovek" element={<ElcovekPage />} />
        <Route path="/vibteo" element={<VibteoPage />} />
        <Route path="/galeri" element={<h1>Settings</h1>} />
      </Route>
    </Routes>

  )
}

export default App
