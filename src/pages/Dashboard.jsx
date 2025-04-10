"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import logoAlcaldia from "../assets/logoalcaldia.png"
import { LogOut, Plus, FileText, User } from "lucide-react"

export default function Dashboard() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState("solicitante")
  const navigate = useNavigate()

  // Verificar autenticación y cargar datos
  useEffect(() => {
    async function loadUserAndContracts() {
      try {
        // Verificar si hay sesión
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          navigate("/login")
          return
        }

        // Guardar información del usuario
        setUser(sessionData.session.user)

        // Obtener rol del usuario
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role_id, user_roles(name)")
          .eq("id", sessionData.session.user.id)
          .single()

        if (profileData?.user_roles?.name) {
          setUserRole(profileData.user_roles.name)
        }

        // Cargar contratos según el rol
        let query = supabase.from("contracts").select(`
          *,
          profiles:created_by(full_name, email)
        `)

        if (profileData?.user_roles?.name === "solicitante") {
          query = query.eq("created_by", sessionData.session.user.id)
        }

        if (profileData?.user_roles?.name === "revisor") {
          query = query.eq("current_phase", 1)
        }

        query = query.order("created_at", { ascending: false })

        const { data: contractsData } = await query
        setContracts(contractsData || [])
      } catch (error) {
        console.error("Error cargando datos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserAndContracts()
  }, [navigate])

  // Función para cerrar sesión
  const logout = async () => {
    await supabase.auth.signOut()
    navigate("/login")
  }

  // Función para obtener texto de fase
  const getPhaseText = (phase) => {
    switch (phase) {
      case 1:
        return "Pendiente de revisión"
      case 2:
        return "Revisado"
      default:
        return "Desconocido"
    }
  }

  // Función para obtener clase de estado
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "en_proceso":
        return {
          backgroundColor: "#fef9c3",
          color: "#854d0e",
        }
      case "aprobado":
        return {
          backgroundColor: "#dcfce7",
          color: "#166534",
        }
      case "rechazado":
        return {
          backgroundColor: "#fee2e2",
          color: "#b91c1c",
        }
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#374151",
        }
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to bottom,rgb(180, 194, 230),rgb(199, 204, 223))",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          Cargando...
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #1e3a8a, #1e40af)",
      }}
    >
      

      {/* Main Content */}
      <div
        style={{
          flex: "1",
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            width: "100%",
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
          }}
        >
          {/* User Info and Actions */}
          <div
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            {/* Logo y título en círculo */}
            <div
              style={{
                backgroundColor: "#eff6ff",
                borderRadius: "50%",
                padding: "1rem",
                marginBottom: "1rem",
                border: "4px solid #bfdbfe",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100px",
                height: "100px",
              }}
            >
              <img
                src={logoAlcaldia || "/placeholder.svg"}
                alt="Logo Alcaldía"
                style={{ height: "60px", width: "auto" }}
              />
            </div>

            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
                color: "#1e3a8a",
              }}
            >
              Contratos
            </h2>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#eff6ff",
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  marginRight: "1rem",
                }}
              >
                <User size={16} style={{ marginRight: "0.5rem", color: "#1e40af" }} />
                <span style={{ fontSize: "0.875rem", color: "#1e40af" }}>
                  {user?.email} ({userRole})
                </span>
              </div>

              <button
                onClick={logout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#ef4444",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "9999px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                <LogOut size={16} style={{ marginRight: "0.5rem" }} />
                Cerrar sesión
              </button>
            </div>

            {userRole === "solicitante" && (
              <Link
                to="/contratos/nuevo"
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#1e40af",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "9999px",
                  textDecoration: "none",
                  fontWeight: "500",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  marginBottom: "1rem",
                }}
              >
                <Plus size={18} style={{ marginRight: "0.5rem" }} />
                Nuevo Contrato
              </Link>
            )}
          </div>

          {/* Contracts Table */}
          <div style={{ padding: "1.5rem" }}>
            {contracts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "#6b7280",
                  backgroundColor: "#f9fafb",
                  borderRadius: "0.5rem",
                }}
              >
                <FileText size={48} style={{ margin: "0 auto 1rem", color: "#9ca3af" }} />
                <p>No hay contratos disponibles</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: "0",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#1e40af", color: "white" }}>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        Fecha
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        Secretaría
                      </th>
                      {(userRole === "revisor" || userRole === "aprobador") && (
                        <th
                          style={{
                            padding: "0.75rem 1rem",
                            textAlign: "left",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            textTransform: "uppercase",
                          }}
                        >
                          Solicitante
                        </th>
                      )}
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        Radicado
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        Nombre del Contratista
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        Estado
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        Fase
                      </th>
                      <th
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                        }}
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract, index) => (
                      <tr key={contract.id} style={{ backgroundColor: index % 2 === 0 ? "white" : "#f9fafb" }}>
                        <td
                          style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", borderBottom: "1px solid #e5e7eb" }}
                        >
                          {new Date(contract.created_at).toLocaleDateString()}
                        </td>
                        <td
                          style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", borderBottom: "1px solid #e5e7eb" }}
                        >
                          {contract.secretaria || "No especificada"}
                        </td>
                        {(userRole === "revisor" || userRole === "aprobador") && (
                          <td
                            style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", borderBottom: "1px solid #e5e7eb" }}
                          >
                            {contract.profiles?.full_name || contract.profiles?.email || "N/A"}
                          </td>
                        )}
                        <td
                          style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", borderBottom: "1px solid #e5e7eb" }}
                        >
                          {contract.radicado || "Sin radicado"}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            fontSize: "0.875rem",
                            borderBottom: "1px solid #e5e7eb",
                            maxWidth: "200px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {contract.nombre_contratista || "Por definir"}
                        </td>
                        <td
                          style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", borderBottom: "1px solid #e5e7eb" }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              ...getStatusBadgeStyle(contract.status),
                            }}
                          >
                            {contract.status === "en_proceso"
                              ? "En proceso"
                              : contract.status === "aprobado"
                                ? "Aprobado"
                                : "Rechazado"}
                          </span>
                        </td>
                        <td
                          style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", borderBottom: "1px solid #e5e7eb" }}
                        >
                          {getPhaseText(contract.current_phase)}
                        </td>
                        <td
                          style={{ padding: "0.75rem 1rem", fontSize: "0.875rem", borderBottom: "1px solid #e5e7eb" }}
                        >
                          <Link
                            to={`/contratos/${contract.id}`}
                            style={{
                              display: "inline-block",
                              backgroundColor: "#1e40af",
                              color: "white",
                              padding: "0.5rem 0.75rem",
                              borderRadius: "0.375rem",
                              textDecoration: "none",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                            }}
                          >
                            Ver detalles
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      
    </div>
  )
}
