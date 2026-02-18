"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { PortalHeader } from "@/components/portal-header"
import { GlassCard } from "@/components/glass-card"
import { createVipRequestAction } from "./actions"
import { db, type VipUpgradeRequest } from "@/lib/db-mock"
import { Crown, Send, CheckCircle2, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function VipRequestPage() {
  const { session } = useAuth()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [request, setRequest] = useState<VipUpgradeRequest | null>(null)

  useEffect(() => {
    if (session?.role === "VIP") {
      router.replace("/dashboard") // Already VIP
    }
    // Fetch existing request
    const fetchRequest = async () => {
      const existing = await db.vipRequests.findFirst(r => r.userId === session?.email)
      if (existing) setRequest(existing)
    }
    if (session?.email) fetchRequest()
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.email) return
    setIsSubmitting(true)
    try {
      await createVipRequestAction(session.email, message)
      // Refresh request status
      const updated = await db.vipRequests.findFirst(r => r.userId === session.email)
      if (updated) setRequest(updated)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ⚡ Bolt: Simulate KYC status check (In a real app, this would be in the session)
  const isKycApproved = session?.email === "client@gem.com" // Mock: only the demo client is pre-approved

  return (
    <AuthGuard requiredRole="client">
      <PortalHeader
        title="VIP Access Request"
        icon={<Crown className="h-5 w-5 text-warning" />}
      />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          <h1 className="bg-gradient-to-r from-warning to-secondary bg-clip-text text-3xl font-extrabold text-transparent">
            Upgrade to VIP
          </h1>
          <p className="mt-2 text-sm text-muted">
            Exclusive access to high-yield assets and priority recovery services.
          </p>
        </div>

        <GlassCard className="mt-8">
          {!isKycApproved ? (
            <div className="text-center py-6">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-destructive/10">
                <CheckCircle2 className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-foreground">KYC Required</h3>
              <p className="mt-2 text-sm text-muted">
                You must complete your KYC verification before requesting VIP status.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground"
              >
                Return to Dashboard
              </button>
            </div>
          ) : request ? (
            <div className="text-center py-6">
              {request.status === "PENDING" ? (
                <>
                  <Clock className="mx-auto h-12 w-12 text-warning animate-pulse" />
                  <h3 className="mt-4 text-xl font-bold text-foreground">Request Pending</h3>
                  <p className="mt-2 text-sm text-muted">
                    An administrator is reviewing your application.
                  </p>
                </>
              ) : request.status === "APPROVED" ? (
                <>
                  <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                  <h3 className="mt-4 text-xl font-bold text-foreground">Request Approved!</h3>
                  <p className="mt-2 text-sm text-muted">
                    Your account has been upgraded to VIP status.
                  </p>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground"
                  >
                    Go to Dashboard
                  </button>
                </>
              ) : (
                <>
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-destructive/10">
                    <Crown className="h-6 w-6 text-destructive" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-foreground">Request Rejected</h3>
                  <p className="mt-2 text-sm text-muted">
                    Please contact support for more information.
                  </p>
                  <button
                    onClick={() => setRequest(null)}
                    className="mt-6 w-full rounded-lg border border-glass-border py-2.5 text-sm font-bold text-primary"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted">
                  Why do you want to upgrade to VIP?
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your investment goals..."
                  className="min-h-[120px] w-full rounded-lg border border-glass-border bg-input p-4 text-foreground outline-none focus:border-warning"
                />
              </div>

              <div className="rounded-lg bg-warning/5 p-4 border border-warning/10">
                <p className="text-xs leading-relaxed text-warning">
                  <strong>Note:</strong> VIP status requires additional KYC verification and is subject to administrative approval based on your portfolio activity.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-warning to-secondary py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          )}
        </GlassCard>
      </main>
    </AuthGuard>
  )
}
