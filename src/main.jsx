import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ContractForm from "./pages/ContractForm"
import "./styles/main.css"

// Componente ProtectedRoute simplificado
function ProtectedRoute({ children }) {
  // Verificar si hay una sesión activa directamente con Supabase
  const isAuthenticated = localStorage.getItem("sb-rfuvekvictlomgrxlhzf-auth-token") !== null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>Sistema de Necesidades de Contratación</h1>
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contratos/:id"
              element={
                <ProtectedRoute>
                  <ContractForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contratos/nuevo"
              element={
                <ProtectedRoute>
                  <ContractForm />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} - Alcaldía Municipal</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
