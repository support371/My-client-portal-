"use client"

import { AuthGuard } from "@/components/auth-guard"
import { PortalHeader } from "@/components/portal-header"
import { GlassCard } from "@/components/glass-card"
import { cn } from "@/lib/utils"
import { StatCard } from "@/components/stat-card"
import { StatusBadge } from "@/components/status-badge"
import { tenants, logs } from "@/lib/data"
import { Crown, ShieldCheck, Database, Server, Activity } from "lucide-react"

export default function SuperAdminPage() {
  return (
    <AuthGuard requiredRole="superadmin">
      <PortalHeader
        title="SuperAdmin Portal"
        icon={<Crown className="h-5 w-5 text-primary" />}
      />

      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-extrabold text-transparent md:text-3xl">
            Platform Control Center
          </h1>
          <p className="mt-1 text-sm text-muted">
            Global Tenant Management & Infrastructure Monitoring
          </p>
        </div>

        {/* Tenant Table */}
        <GlassCard className="mt-6">
          <h3 className="mb-4 text-base font-bold text-foreground">Tenant Oversight</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="pb-3 pr-4 text-xs font-bold uppercase tracking-wider text-primary">Tenant Name</th>
                  <th className="pb-3 pr-4 text-xs font-bold uppercase tracking-wider text-primary">Status</th>
                  <th className="pb-3 pr-4 text-xs font-bold uppercase tracking-wider text-primary">Users</th>
                  <th className="pb-3 text-xs font-bold uppercase tracking-wider text-primary">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((t) => (
                  <tr key={t.id} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-medium text-foreground">{t.name}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge
                        label={t.status}
                        variant={t.status.toLowerCase() as "healthy" | "warning" | "critical"}
                      />
                    </td>
                    <td className="py-3 pr-4 text-muted">{t.users}</td>
                    <td className="py-3 font-semibold text-foreground">{t.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* System Logs */}
        <GlassCard className="mt-4">
          <h3 className="mb-4 text-base font-bold text-foreground">System Logs</h3>
          <div className="max-h-64 space-y-2 overflow-y-auto font-mono text-sm">
            {logs.map((l, i) => (
              <div
                key={i}
                className="flex flex-col gap-0.5 border-b border-border/30 pb-2 md:flex-row md:items-center md:gap-3"
              >
                <span className="text-xs text-muted">[{l.time}]</span>
                <span className="text-xs font-semibold text-secondary">{l.user}</span>
                <span className="text-xs text-foreground">{l.action}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* Resource Allocation - NEW */}
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Resource Allocation</h3>
              <Server className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-4">
              {[
                { label: "Compute (CPU)", value: "64%", color: "bg-primary" },
                { label: "Memory (RAM)", value: "42%", color: "bg-secondary" },
                { label: "Storage (SSD)", value: "88%", color: "bg-warning" },
              ].map((r, i) => (
                <div key={i}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted">{r.label}</span>
                    <span className="font-bold">{r.value}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-border/30 overflow-hidden">
                    <div className={cn("h-full", r.color)} style={{ width: r.value }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Global Security Audit - NEW */}
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Global Security Audit</h3>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-3">
              {[
                { label: "Encryption", status: "Verified", icon: ShieldCheck, color: "text-primary" },
                { label: "Firewall", status: "Active", icon: Activity, color: "text-secondary" },
                { label: "Backups", status: "Healthy", icon: Database, color: "text-primary" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-glass-border p-2.5">
                  <div className="flex items-center gap-3">
                    <s.icon className={cn("h-4 w-4", s.color)} />
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                  <span className={cn("text-[10px] font-bold uppercase", s.color)}>{s.status}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Infrastructure Health */}
        <GlassCard hover={false} className="mt-4">
          <h3 className="mb-4 text-base font-bold text-foreground">Infrastructure Health</h3>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
            <StatCard value="99.9%" label="Uptime" />
            <StatCard value={12} label="Active Nodes" />
            <StatCard value="45ms" label="Latency" />
            <StatCard value="2.4M" label="Requests" />
            <StatCard value="0" label="Incidents" />
            <StatCard value="100%" label="Health" />
          </div>
        </GlassCard>
      </main>
    </AuthGuard>
  )
}
