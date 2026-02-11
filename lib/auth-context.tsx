"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { USERS, type UserRole } from "./data"

type Session = {
  email: string
  role: UserRole
  name: string
  loginTime: string
}

type AuthContextType = {
  session: Session | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("gem_session")
    if (stored) {
      try {
        setSession(JSON.parse(stored))
      } catch {
        localStorage.removeItem("gem_session")
      }
    }
    setMounted(true)
  }, [])

  const login = useCallback((email: string, password: string): boolean => {
    const user = USERS[email]
    if (user && user.password === password) {
      const newSession: Session = {
        email,
        role: user.role,
        name: user.name,
        loginTime: new Date().toISOString(),
      }
      localStorage.setItem("gem_session", JSON.stringify(newSession))
      setSession(newSession)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("gem_session")
    setSession(null)
  }, [])

  if (!mounted) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100dvh",
          background: "#0a0e14",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "3px solid rgba(0,255,159,0.15)",
            borderTopColor: "#00ff9f",
            animation: "spin 0.6s linear infinite",
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ session, login, logout, isAuthenticated: !!session }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
