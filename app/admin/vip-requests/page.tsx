"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { PortalHeader } from "@/components/portal-header"
import { GlassCard } from "@/components/glass-card"
import { StatusBadge } from "@/components/status-badge"
import { db, type VipUpgradeRequest } from "@/lib/db-mock"
import { Settings, UserCheck, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function AdminVipRequestsPage() {
  const [requests, setRequests] = useState<VipUpgradeRequest[]>([])

  useEffect(() => {
    const fetchRequests = async () => {
      const data = await db.vipRequests.findMany()
      setRequests(data)
    }
    fetchRequests()
  }, [])

  return (
    <AuthGuard requiredRole="admin">
      <PortalHeader
        title="VIP Request Queue"
        icon={<Settings className="h-5 w-5 text-primary" />}
      />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-extrabold text-transparent">
            VIP Upgrade Management
          </h1>
          <p className="mt-2 text-sm text-muted">
            Review and process pending VIP access requests from clients.
          </p>
        </div>

        <GlassCard className="mt-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="pb-4 pr-4 text-xs font-bold uppercase tracking-wider text-primary">Client</th>
                  <th className="pb-4 pr-4 text-xs font-bold uppercase tracking-wider text-primary">Status</th>
                  <th className="pb-4 pr-4 text-xs font-bold uppercase tracking-wider text-primary">Submitted</th>
                  <th className="pb-4 text-right text-xs font-bold uppercase tracking-wider text-primary">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted">
                      No requests found in the queue.
                    </td>
                  </tr>
                ) : (
                  requests.map((r) => (
                    <tr key={r.id} className="border-b border-border/50 transition-colors hover:bg-primary/5">
                      <td className="py-4 pr-4 font-medium text-foreground">{r.userId}</td>
                      <td className="py-4 pr-4">
                        <StatusBadge
                          label={r.status}
                          variant={r.status === "PENDING" ? "warning" : r.status === "APPROVED" ? "success" : "critical"}
                        />
                      </td>
                      <td className="py-4 pr-4 text-xs text-muted">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right">
                        <Link
                          href={`/admin/vip-requests/${r.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                        >
                          Details <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </main>
    </AuthGuard>
  )
}
