"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"
import { loginAction } from "@/lib/actions/auth"

export type UserRole = "superadmin" | "admin" | "team" | "client"

type Session = {
  id: string
  email: string
  role: UserRole
  name: string
  loginTime: string
}

type AuthContextType = {
  session: Session | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = "gem_session"

/**
 * ⚡ Bolt Optimization: AuthProvider
 *
 * Uses useMemo to stabilize the context value, preventing cascading re-renders
 * across the entire application whenever the session state is hydrated or updated.
 * Also ensures stable references for login/logout callbacks.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setSession(JSON.parse(stored))
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
    setHydrated(true)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginAction(email, password)
    if (!result.ok) return { ok: false, error: result.error }

    const newSession: Session = {
      id:        result.user.id,
      email:     result.user.email,
      role:      result.user.role as UserRole,
      name:      result.user.name,
      loginTime: new Date().toISOString(),
    }
    setSession(newSession)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession))
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const isLoading = !hydrated

  const value = useMemo(
    () => ({
      session,
      login,
      logout,
      isAuthenticated: !!session,
      isLoading,
    }),
    [session, login, logout, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
