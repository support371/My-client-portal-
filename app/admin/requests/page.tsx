"use client"

import { useState, useEffect, useTransition, useMemo, useCallback, memo } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { PortalHeader } from "@/components/portal-header"
import { GlassCard } from "@/components/glass-card"
import { StatusBadge } from "@/components/status-badge"
import {
  getRequestsAction,
  updateRequestStatusAction,
  type RequestRow,
} from "@/lib/actions/requests"
import { ClipboardList, ArrowLeft, Search, Loader2 } from "lucide-react"
import Link from "next/link"

// ⚡ Bolt Optimization: Hoist static icons to module-level constants for stable references.
const REQUEST_ICON = <ClipboardList className="h-5 w-5 text-primary" />
const SEARCH_ICON = <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
const BACK_ICON = <ArrowLeft className="h-4 w-4" />
const LOADER_ICON = <Loader2 className="h-3 w-3 animate-spin" />

const statusVariant: Record<string, "default" | "success" | "warning" | "critical" | "info"> = {
  Pending:    "warning",
  Approved:   "success",
  Rejected:   "critical",
  "In Review":"info",
}

const priorityVariant: Record<string, "default" | "warning" | "critical"> = {
  Low: "default", Medium: "warning", High: "critical",
}

const ALL_STATUSES = ["All", "Pending", "In Review", "Approved", "Rejected"] as const
type FilterStatus = typeof ALL_STATUSES[number]

/**
 * ⚡ Bolt Optimization: Memoize individual request rows.
 * Accepts a derived 'isProcessing' boolean to prevent unnecessary re-renders of all rows
 * when an action is triggered on a single item.
 */
const RequestRowComponent = memo(function RequestRowComponent({
  req,
  onStatusChange,
  isProcessing
}: {
  req: RequestRow
  onStatusChange: (requestId: string, status: string) => void
  isProcessing: boolean
}) {
  return (
    <tr className="border-b border-border/50 hover:bg-surface/50">
      <td className="py-3 pr-4 font-medium text-foreground">{req.client.name}</td>
      <td className="py-3 pr-4 text-muted">{req.type}</td>
      <td className="max-w-[180px] truncate py-3 pr-4 text-foreground">{req.subject}</td>
      <td className="py-3 pr-4">
        <StatusBadge label={req.priority} variant={priorityVariant[req.priority] ?? "default"} />
      </td>
      <td className="py-3 pr-4">
        <StatusBadge label={req.status} variant={statusVariant[req.status] ?? "default"} />
      </td>
      <td className="py-3 pr-4 text-muted">{new Date(req.createdAt).toLocaleDateString()}</td>
      <td className="py-3">
        <div className="flex gap-1.5">
          {req.status !== "Approved" && (
            <button
              disabled={isProcessing}
              onClick={() => onStatusChange(req.id, "Approved")}
              className="rounded px-2 py-1 text-xs font-bold text-primary border border-glass-border hover:bg-primary/10 disabled:opacity-50"
            >
              {isProcessing ? LOADER_ICON : "Approve"}
            </button>
          )}
          {req.status !== "Rejected" && (
            <button
              disabled={isProcessing}
              onClick={() => onStatusChange(req.id, "Rejected")}
              className="rounded px-2 py-1 text-xs font-bold text-destructive border border-glass-border hover:bg-destructive/10 disabled:opacity-50"
            >
              Reject
            </button>
          )}
        </div>
      </td>
    </tr>
  )
})

export default function AdminRequestsPage() {
  const { session } = useAuth()
  const [requests, setRequests] = useState<RequestRow[]>([])
  const [search, setSearch]     = useState("")
  const [filter, setFilter]     = useState<FilterStatus>("All")
  const [actionId, setActionId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState("")
  const [isPending, startTransition] = useTransition()

  // ⚡ Bolt Optimization: Wrap reload in useCallback for stable reference.
  const reload = useCallback(() => {
    getRequestsAction()
      .then(setRequests)
      .catch(() => setLoadError("Failed to load requests."))
  }, [])

  useEffect(reload, [reload])

  // ⚡ Bolt Optimization: Wrap handleStatusChange in useCallback.
  const handleStatusChange = useCallback((requestId: string, status: string) => {
    if (!session?.email) return
    setActionId(requestId)
    startTransition(async () => {
      await updateRequestStatusAction({ requestId, status, adminEmail: session.email })
      reload()
      setActionId(null)
    })
  }, [session?.email, reload])

  // ⚡ Bolt Optimization: Memoize filtered list and pre-normalize search query.
  // This ensures O(N) filtering only happens when relevant state changes.
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return requests.filter((r) => {
      const matchSearch = !q ||
        r.client.name.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      const matchFilter = filter === "All" || r.status === filter
      return matchSearch && matchFilter
    })
  }, [requests, search, filter])

  // ⚡ Bolt Optimization: Memoize status counts with a single O(N) pass.
  const counts = useMemo(() => {
    const initialCounts = {
      All: requests.length,
      Pending: 0,
      "In Review": 0,
      Approved: 0,
      Rejected: 0,
    }
    return requests.reduce((acc, r) => {
      if (r.status in acc) {
        acc[r.status as keyof typeof acc]++
      }
      return acc
    }, initialCounts as Record<FilterStatus, number>)
  }, [requests])

  return (
    <AuthGuard requiredRole="admin">
      <PortalHeader
        title="Request Management"
        icon={REQUEST_ICON}
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
            Service Requests
          </h1>
          <p className="mt-1 text-sm text-muted">Review and action all platform requests</p>
        </div>

        {/* Filter tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                filter === s
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                  : "border border-glass-border text-muted hover:text-primary"
              }`}
            >
              {s} ({counts[s]})
            </button>
          ))}
        </div>

        <GlassCard className="mt-4">
          <div className="relative mb-4">
            {SEARCH_ICON}
            <input
              type="text"
              placeholder="Search by client, ID, or subject…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-lg border border-glass-border bg-input pl-10 pr-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          {loadError ? (
            <p className="py-4 text-sm text-destructive">{loadError}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-glass-border">
                    {["Client", "Type", "Subject", "Priority", "Status", "Date", "Action"].map((h) => (
                      <th key={h} className="pb-3 pr-4 text-xs font-bold uppercase tracking-wider text-primary last:pr-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-sm text-muted">No requests match your filters.</td>
                    </tr>
                  ) : filtered.map((req) => (
                    <RequestRowComponent
                      key={req.id}
                      req={req}
                      onStatusChange={handleStatusChange}
                      isProcessing={isPending && actionId === req.id}
                    />
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
