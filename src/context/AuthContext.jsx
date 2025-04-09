"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          setUser(session.user)

          // Fetch user role
          const { data, error } = await supabase
            .from("profiles")
            .select("role_id, user_roles(name)")
            .eq("id", session.user.id)
            .single()

          if (!error && data) {
            setUserRole(data.user_roles?.name || "solicitante")
          }
        }
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setUser(session?.user ?? null)

        if (session?.user) {
          // Fetch user role
          const { data, error } = await supabase
            .from("profiles")
            .select("role_id, user_roles(name)")
            .eq("id", session.user.id)
            .single()

          if (!error && data) {
            setUserRole(data.user_roles?.name || "solicitante")
          }
        } else {
          setUserRole(null)
        }
      } catch (error) {
        console.error("Error in auth state change:", error)
      } finally {
        setLoading(false)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Login with email and password - Simplificado
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error("Error en login:", error)
      throw error
    }
  }

  // Logout - Simplificado
  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error en logout:", error)
      throw error
    }
  }

  const value = {
    user,
    userRole,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
