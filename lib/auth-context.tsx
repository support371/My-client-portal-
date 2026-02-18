"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useSyncExternalStore, type ReactNode } from "react"
import { USERS, type UserRole } from "./data"

const listeners = new Set<() => void>()

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange)
  window.addEventListener("storage", onStoreChange)
  return () => {
    listeners.delete(onStoreChange)
    window.removeEventListener("storage", onStoreChange)
  }
}

function notify() {
  listeners.forEach((l) => l())
}

function getSnapshot() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("gem_session")
}

function getServerSnapshot() {
  return null
}

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
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const sessionStr = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const session = useMemo(() => {
    if (!isMounted || !sessionStr) return null
    try {
      return JSON.parse(sessionStr) as Session
    } catch {
      return null
    }
  }, [isMounted, sessionStr])

  const isLoading = !isMounted

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
      notify()
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("gem_session")
    notify()
  }, [])

  const isAuthenticated = !!session

  return (
    <AuthContext.Provider value={{ session, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
