"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { PortalHeader } from "@/components/portal-header"
import { GlassCard } from "@/components/glass-card"
import { StatusBadge } from "@/components/status-badge"
import { db, type VipUpgradeRequest } from "@/lib/db-mock"
import { decideVipRequestAction } from "@/app/vip/request/actions"
import { Settings, ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"

export default function AdminVipRequestDetailPage() {
  const { requestId } = useParams()
  const router = useRouter()
  const { session } = useAuth()
  const [request, setRequest] = useState<VipUpgradeRequest | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchRequest = async () => {
      const data = await db.vipRequests.findMany()
      const found = data.find(r => r.id === requestId)
      if (found) setRequest(found)
    }
    fetchRequest()
  }, [requestId])

  const handleDecision = async (decision: "APPROVED" | "REJECTED") => {
    if (!session?.email || !request) return
    setIsProcessing(true)
    try {
      await decideVipRequestAction(request.id, decision, session.email)
      router.push("/admin/vip-requests")
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!request) return null

  return (
    <AuthGuard requiredRole="admin">
      <PortalHeader
        title="Request Details"
        icon={<Settings className="h-5 w-5 text-primary" />}
      />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/admin/vip-requests"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Queue
        </Link>

        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-foreground">
              Review Request: {request.id}
            </h1>
            <StatusBadge
              label={request.status}
              variant={request.status === "PENDING" ? "warning" : request.status === "APPROVED" ? "success" : "critical"}
            />
          </div>
          <p className="mt-1 text-sm text-muted">Submitted on {new Date(request.createdAt).toLocaleString()}</p>
        </div>

        <div className="mt-8 grid gap-6">
          <GlassCard>
            <h3 className="text-base font-bold text-primary mb-4">Client Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-border/30 pb-2">
                <span className="text-sm text-muted">Email Address</span>
                <span className="text-sm font-medium">{request.userId}</span>
              </div>
              <div className="flex justify-between border-b border-border/30 pb-2">
                <span className="text-sm text-muted">Current Role</span>
                <span className="text-sm font-medium text-secondary">CLIENT</span>
              </div>
              <div className="flex justify-between border-b border-border/30 pb-2">
                <span className="text-sm text-muted">KYC Status</span>
                <span className="text-sm font-medium text-primary">APPROVED</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-base font-bold text-primary mb-4">Client Message</h3>
            <div className="rounded-lg bg-surface p-4 text-sm leading-relaxed italic text-foreground border border-border/50">
              "{request.message}"
            </div>
          </GlassCard>

          {request.status === "PENDING" && (
            <div className="flex gap-4">
              <button
                disabled={isProcessing}
                onClick={() => handleDecision("REJECTED")}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-destructive/10 py-3 text-sm font-bold text-destructive hover:bg-destructive/20 transition-colors"
              >
                <XCircle className="h-4 w-4" /> Reject Request
              </button>
              <button
                disabled={isProcessing}
                onClick={() => handleDecision("APPROVED")}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <CheckCircle2 className="h-4 w-4" /> Approve Upgrade
              </button>
            </div>
          )}

          {request.status !== "PENDING" && (
            <GlassCard className="bg-primary/5 border-primary/20">
              <p className="text-center text-sm font-medium text-primary">
                This request was {request.status.toLowerCase()} by {request.decidedByUserId} on {request.decidedAt && new Date(request.decidedAt).toLocaleString()}.
              </p>
            </GlassCard>
          )}
        </div>
      </main>
    </AuthGuard>
  )
}
