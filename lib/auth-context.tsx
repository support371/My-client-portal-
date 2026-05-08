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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // ⚡ Bolt Optimization: Cross-tab synchronization via storage event listener.
  useEffect(() => {
    const syncSession = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        setSession(stored ? JSON.parse(stored) : null)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
        setSession(null)
      }
    }

    syncSession()
    setIsHydrated(true)

    window.addEventListener("storage", syncSession)
    window.addEventListener("auth-update", syncSession)
    return () => {
      window.removeEventListener("storage", syncSession)
      window.removeEventListener("auth-update", syncSession)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginAction(email, password)
    if (!result.ok) return { ok: false, error: result.error }

    const newSession: Session = {
      id: result.user.id,
      email: result.user.email,
      role: result.user.role as UserRole,
      name: result.user.name,
      loginTime: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession))
    setSession(newSession)
    window.dispatchEvent(new CustomEvent("auth-update"))
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
    window.dispatchEvent(new CustomEvent("auth-update"))
  }, [])

  // ⚡ Bolt Optimization: Memoize the context value to prevent application-wide cascading re-renders.
  const value = useMemo(
    () => ({
      session,
      login,
      logout,
      isAuthenticated: !!session,
      isLoading: !isHydrated,
    }),
    [session, login, logout, isHydrated]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
