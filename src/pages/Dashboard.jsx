"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

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
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "en_proceso":
        return "bg-yellow-100 text-yellow-800"
      case "aprobado":
        return "bg-green-100 text-green-800"
      case "rechazado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Cargando...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel de Contratos</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user?.email} ({userRole})
          </span>
          <button onClick={logout} className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300">
            Cerrar sesión
          </button>
        </div>
      </div>

      {userRole === "solicitante" && (
        <div className="mb-6">
          <Link
            to="/contratos/nuevo"
            className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
          >
            Nuevo Contrato
          </Link>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fecha</th>
              {(userRole === "revisor" || userRole === "aprobador") && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Solicitante
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Radicado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Objeto Contractual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fase</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {contracts.length === 0 ? (
              <tr>
                <td
                  colSpan={userRole === "solicitante" ? 6 : 7}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No hay contratos disponibles
                </td>
              </tr>
            ) : (
              contracts.map((contract) => (
                <tr key={contract.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(contract.created_at).toLocaleDateString()}
                  </td>
                  {(userRole === "revisor" || userRole === "aprobador") && (
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {contract.profiles?.full_name || contract.profiles?.email || "N/A"}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {contract.radicado || "Sin radicado"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {contract.objeto_contractual || "Sin objeto"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeClass(contract.status)}`}
                    >
                      {contract.status === "en_proceso"
                        ? "En proceso"
                        : contract.status === "aprobado"
                          ? "Aprobado"
                          : "Rechazado"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {getPhaseText(contract.current_phase)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <Link to={`/contratos/${contract.id}`} className="text-blue-600 hover:text-blue-900">
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
