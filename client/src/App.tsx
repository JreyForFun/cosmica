import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'

import { Route, Routes } from "react-router-dom"
import './App.css'
import Layout from './components/layout/layout'
import { SOTDPage } from './pages/SOTDPage'

function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={ <LoginPage /> }/>
      <Route path="/auth/register" element={< SignupPage />} />

      <Route element={<Layout />} >
        <Route path="/SOTD" element={<SOTDPage />} />
        <Route path="/palia-andromi" element={<h1>Profile</h1>} />
        <Route path="/elcover" element={<h1>Settings</h1>} />
        <Route path="/vibteo" element={<h1>Profile</h1>} />
        <Route path="/galeri" element={<h1>Settings</h1>} />
      </Route>
    </Routes>

  )
}

export default App
