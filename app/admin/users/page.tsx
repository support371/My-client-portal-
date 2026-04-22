"use client"

import { useState, useEffect, useMemo, memo } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { PortalHeader } from "@/components/portal-header"
import { GlassCard } from "@/components/glass-card"
import { StatusBadge } from "@/components/status-badge"
import { getUsersAction, type UserRow } from "@/lib/actions/users"
import { Users, ArrowLeft, Search, ShieldCheck } from "lucide-react"
import Link from "next/link"

// ⚡ Bolt Optimization: Hoist static icons to module-level constants for stable element references.
const USERS_ICON = <Users className="h-5 w-5 text-primary" />
const SEARCH_ICON = <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
const BACK_ICON = <ArrowLeft className="h-4 w-4" />
const SHIELD_ICON = <ShieldCheck className="h-4 w-4 text-primary" />

const roleVariant: Record<string, "default" | "success" | "warning" | "critical" | "info"> = {
  superadmin: "critical",
  admin:      "warning",
  team:       "info",
  client:     "success",
}

/**
 * ⚡ Bolt Optimization: Memoized UserRowComponent
 * Isolates re-renders of individual user table rows.
 */
const UserRowComponent = memo(function UserRowComponent({ user }: { user: UserRow }) {
  return (
    <tr className="border-b border-border/50 hover:bg-surface/50">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            {SHIELD_ICON}
          </div>
          <span className="font-medium text-foreground">{user.name}</span>
        </div>
      </td>
      <td className="py-3 pr-4 text-muted">{user.email}</td>
      <td className="py-3 pr-4">
        <StatusBadge label={user.role} variant={roleVariant[user.role] ?? "default"} />
      </td>
      <td className="py-3 pr-4">
        <StatusBadge label={user.active ? "Active" : "Inactive"} variant={user.active ? "success" : "critical"} />
      </td>
      <td className="py-3 pr-4 text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
      <td className="py-3">
        <button className="rounded-lg border border-glass-border px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/10">
          Manage
        </button>
      </td>
    </tr>
  )
})

export default function AdminUsersPage() {
  const [users, setUsers]     = useState<UserRow[]>([])
  const [search, setSearch]   = useState("")
  const [loadError, setLoadError] = useState("")

  useEffect(() => {
    getUsersAction()
      .then(setUsers)
      .catch(() => setLoadError("Failed to load users."))
  }, [])

  // ⚡ Bolt Optimization: Memoize filtered results and pre-normalize search query.
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter((u) => (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    ))
  }, [users, search])

  return (
    <AuthGuard requiredRole="admin">
      <PortalHeader
        title="User Management"
        icon={USERS_ICON}
      />

      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-primary"
          >
            {BACK_ICON}
            Back to Admin Portal
          </Link>
        </div>

        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-extrabold text-transparent md:text-3xl">
            User Management
          </h1>
          <p className="mt-1 text-sm text-muted">
            Platform accounts and role assignments ({users.length} users)
          </p>
        </div>

        <GlassCard className="mt-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              {SEARCH_ICON}
              <input
                type="text"
                placeholder="Search by name, email, or role…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg border border-glass-border bg-input pl-10 pr-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <button className="rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-xs font-bold text-primary-foreground whitespace-nowrap">
              Invite User
            </button>
          </div>

          {loadError ? (
            <p className="py-4 text-sm text-destructive">{loadError}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-glass-border">
                    {["Name", "Email", "Role", "Status", "Joined", "Actions"].map((h) => (
                      <th key={h} className="pb-3 pr-4 text-xs font-bold uppercase tracking-wider text-primary last:pr-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-muted">
                        {users.length === 0 ? "Loading…" : "No users match your search."}
                      </td>
                    </tr>
                  ) : filtered.map((user) => (
                    <UserRowComponent key={user.id} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </main>
    </AuthGuard>
  )
}
