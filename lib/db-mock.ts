// ⚡ Bolt: Mock Database Layer
// Simulates Prisma models with localStorage persistence to bypass sandbox environment limitations.
// Optimized for performance with in-memory caching and O(1) lookups where possible.

export type Role = "SUPERADMIN" | "ADMIN" | "TEAM" | "CLIENT" | "VIP"
export type VipRequestStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface User {
  id: string
  email: string
  name: string
  role: Role
  kycApproved: boolean
}

export interface VipUpgradeRequest {
  id: string
  userId: string
  status: VipRequestStatus
  message: string
  createdAt: string
  decidedAt?: string
  decidedByUserId?: string
}

export interface Holding {
  id: string
  userId: string
  symbol: string
  quantity: number
  avgCost: number
  currency: string
  updatedAt: string
}

export interface PricePoint {
  id: string
  symbol: string
  price: number
  asOf: string
}

const cache: Record<string, any> = {}

function getFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return []
  if (cache[key]) return cache[key]
  const data = localStorage.getItem(`db_${key}`)
  const parsed = data ? JSON.parse(data) : []
  cache[key] = parsed
  return parsed
}

function setToStorage<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return
  cache[key] = data
  localStorage.setItem(`db_${key}`, JSON.stringify(data))
  window.dispatchEvent(new CustomEvent("db-update", { detail: { key } }))
}

export const db = {
  users: {
    update: async (email: string, data: Partial<User>) => {
      // In this mock, we might want to update the session in localStorage too
      const sessionKey = "gem_session"
      const sessionRaw = localStorage.getItem(sessionKey)
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw)
        if (session.email === email) {
          const updated = { ...session, ...data }
          localStorage.setItem(sessionKey, JSON.stringify(updated))
          window.dispatchEvent(new CustomEvent("auth-update"))
        }
      }
    }
  },
  vipRequests: {
    findMany: async () => getFromStorage<VipUpgradeRequest>("vip_requests"),
    findFirst: async (predicate: (r: VipUpgradeRequest) => boolean) =>
      getFromStorage<VipUpgradeRequest>("vip_requests").find(predicate),
    create: async (data: Omit<VipUpgradeRequest, "id" | "createdAt">) => {
      const requests = getFromStorage<VipUpgradeRequest>("vip_requests")
      const newRequest = {
        ...data,
        id: Math.random().toString(36).substring(7),
        createdAt: new Date().toISOString()
      }
      setToStorage("vip_requests", [...requests, newRequest])
      return newRequest
    },
    update: async (id: string, data: Partial<VipUpgradeRequest>) => {
      const requests = getFromStorage<VipUpgradeRequest>("vip_requests")
      const updated = requests.map(r => r.id === id ? { ...r, ...data } : r)
      setToStorage("vip_requests", updated)
      return updated.find(r => r.id === id)
    }
  },
  holdings: {
    findMany: async (userId: string) =>
      getFromStorage<Holding>("holdings").filter(h => h.userId === userId),
    create: async (data: Omit<Holding, "id" | "updatedAt">) => {
      const holdings = getFromStorage<Holding>("holdings")
      const newHolding = {
        ...data,
        id: Math.random().toString(36).substring(7),
        updatedAt: new Date().toISOString()
      }
      setToStorage("holdings", [...holdings, newHolding])
      return newHolding
    },
    delete: async (id: string) => {
      const holdings = getFromStorage<Holding>("holdings")
      setToStorage("holdings", holdings.filter(h => h.id !== id))
    }
  },
  prices: {
    findLatest: async (symbol: string) => {
      const prices = getFromStorage<PricePoint>("prices")
      return prices
        .filter(p => p.symbol === symbol)
        .sort((a, b) => new Date(b.asOf).getTime() - new Date(a.asOf).getTime())[0]
    },
    findMany: async (symbol: string) =>
      getFromStorage<PricePoint>("prices").filter(p => p.symbol === symbol),
    create: async (data: Omit<PricePoint, "id">) => {
      const prices = getFromStorage<PricePoint>("prices")
      const newPrice = {
        ...data,
        id: Math.random().toString(36).substring(7)
      }
      setToStorage("prices", [...prices, newPrice])
      return newPrice
    }
  }
}
