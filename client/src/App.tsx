import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'

import { Route, Routes } from "react-router-dom"
import './App.css'
import Layout from './components/layout/layout'

function App() {
  return (
    <Routes>
      <Route path="/auth/login" element={ <LoginPage /> }/>
      <Route path="/auth/register" element={< SignupPage />} />

      <Route element={<Layout />} >
        <Route path="/" element={<h1>Dashboard</h1>} />
        <Route path="/profile" element={<h1>Profile</h1>} />
        <Route path="/settings" element={<h1>Settings</h1>} />
      </Route>
    </Routes>

  )
}

export default App
