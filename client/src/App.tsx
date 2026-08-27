import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { Route, Routes } from "react-router-dom"
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/auth/login" element={ <LoginPage /> }/>
      <Route path="/auth/register" element={< SignupPage />} />
    </Routes>

  )
}

export default App
