"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import logoAlcaldia from "../assets/logoalcaldia.png"
import { Mail, Lock, LogIn } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Usar directamente Supabase para iniciar sesión
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        console.error("Error de autenticación:", error)
        throw error
      }

      console.log("Login exitoso:", data)

      // Navegar al dashboard
      navigate("/dashboard")
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setError("Credenciales inválidas. Por favor verifique su correo y contraseña.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        background: "linear-gradient(to bottom, #1e3a8a,rgb(199, 204, 223))",
      }}
    >
     

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flex: "1",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
            margin: "0 auto",
          }}
        >
          {/* Card Content */}
          <div style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* Logo en círculo */}
            <div
              style={{
                backgroundColor: "#eff6ff",
                borderRadius: "50%",
                padding: "1.5rem",
                marginBottom: "1.5rem",
                border: "4px solid #bfdbfe",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={logoAlcaldia || "/placeholder.svg"}
                alt="Logo Alcaldía"
                style={{ height: "80px", width: "auto" }}
              />
            </div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "0.5rem" }}>
              Iniciar Sesión
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", textAlign: "center", marginBottom: "1.5rem" }}>
              Ingrese sus credenciales para continuar
            </p>

            {error && (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  color: "#b91c1c",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1rem",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <p style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fee2e2",
                      color: "#ef4444",
                      borderRadius: "9999px",
                      height: "1.5rem",
                      width: "1.5rem",
                      marginRight: "0.5rem",
                    }}
                  >
                    !
                  </span>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  Correo Electrónico
                </label>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <Mail size={20} color="#9ca3af" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      paddingLeft: "2.5rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#f9fafb",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                    textAlign: "center",
                  }}
                >
                  Contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <Lock size={20} color="#9ca3af" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      paddingLeft: "2.5rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #d1d5db",
                      backgroundColor: "#f9fafb",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    style={{
                      height: "1rem",
                      width: "1rem",
                      borderRadius: "0.25rem",
                      borderColor: "#d1d5db",
                      color: "#2563eb",
                    }}
                  />
                  <label htmlFor="remember-me" style={{ marginLeft: "0.5rem", fontSize: "0.875rem", color: "#374151" }}>
                    Recordarme
                  </label>
                </div>
                <div style={{ fontSize: "0.875rem" }}>
                  <a href="#" style={{ color: "#2563eb", fontWeight: "500" }}>
                    ¿Olvidó su contraseña?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: "#1e40af",
                  color: "white",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  fontWeight: "500",
                  fontSize: "0.875rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  cursor: "pointer",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LogIn size={20} color="#93c5fd" />
                </span>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </form>

            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Sistema de Gestión de Contratos - Alcaldía Municipal
              </p>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}
