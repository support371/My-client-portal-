"use client"

import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { PortalHeader } from "@/components/portal-header"
import { GlassCard } from "@/components/glass-card"
import { transactions, assetAllocation, topPerformers, businessHoldings } from "@/lib/data"
import { Briefcase, ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, PieChart, Building2, Plus, ExternalLink, Activity, FileText } from "lucide-react"

// ⚡ Bolt Optimization: Move static icon out of render function.
const CLIENT_ICON = <Briefcase className="h-5 w-5 text-primary" />

export default function ClientPage() {
  const { session } = useAuth()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(2)}%`
  }

  const totalValue = assetAllocation.reduce((sum, asset) => sum + asset.value, 0)
  const investmentCount = assetAllocation.reduce((sum, asset) => sum + asset.count, 0)
  const totalInvested = 425000 // In a real app, this would also be calculated or fetched
  const totalReturns = totalValue - totalInvested
  const returnPercent = (totalReturns / totalInvested) * 100

  const colorMap: Record<string, string> = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    warning: "bg-warning",
  }

  return (
    <AuthGuard requiredRole="client">
      <PortalHeader
        title="Client Portal"
        icon={CLIENT_ICON}
      />

      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-extrabold text-transparent md:text-3xl">
            Welcome Back, {session?.name || "Client"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Personal Portfolio & Trading Access
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Portfolio Value */}
          <GlassCard className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted">Total Portfolio Value</h3>
                <DollarSign className="h-5 w-5 text-muted" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{formatCurrency(totalValue)}</div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="font-bold text-primary">+2.45%</span>
              <span className="ml-2 text-muted">today</span>
            </div>
          </GlassCard>

          {/* Total Returns */}
          <GlassCard className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted">Total Returns</h3>
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-extrabold text-primary">{formatCurrency(totalReturns)}</div>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted">
              <span className="font-medium text-foreground">{formatPercent(returnPercent)}</span>
              <span className="ml-2 text-muted">return</span>
            </div>
          </GlassCard>

          {/* Total Invested */}
          <GlassCard className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted">Total Invested</h3>
                <Briefcase className="h-5 w-5 text-muted" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">{formatCurrency(totalInvested)}</div>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted">
              <span className="text-muted">Across</span>
              <span className="mx-1 font-bold text-foreground">{investmentCount}</span>
              <span className="text-muted">investments</span>
            </div>
          </GlassCard>

          {/* Asset Types */}
          <GlassCard className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted">Asset Types</h3>
                <PieChart className="h-5 w-5 text-muted" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">5</div>
            </div>
            <div className="mt-4 text-sm text-muted">Diversified categories</div>
          </GlassCard>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Asset Allocation */}
          <GlassCard hover={false}>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">Asset Allocation</h2>
              <p className="text-sm text-muted">Distribution across asset types</p>
            </div>
            <div className="space-y-5">
              {assetAllocation.map((asset) => (
                <div key={asset.category}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-foreground">{asset.category.replace("_", " ")}</span>
                    <span className="text-muted">
                      {asset.percentage.toFixed(1)}% ({asset.count})
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-input overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colorMap[asset.color] || "bg-primary"}`}
                      style={{ width: `${asset.percentage}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-right text-sm font-bold text-foreground">
                    {formatCurrency(asset.value)}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Top Performers */}
          <GlassCard hover={false}>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">Top Performers</h2>
              <p className="text-sm text-muted">Your best performing investments</p>
            </div>
            <div className="space-y-4">
              {topPerformers.map((investment, index) => (
                <div
                  key={investment.symbol}
                  className="flex items-center justify-between rounded-xl bg-surface p-3 transition-colors hover:bg-input"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {investment.name}
                        <span className="ml-2 text-[10px] font-medium text-muted">{investment.symbol}</span>
                      </p>
                      <p className="text-[11px] text-muted">{investment.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{formatCurrency(investment.value)}</p>
                    <p className="text-[11px] font-bold text-primary">{formatPercent(investment.returnPercent)}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Recent Transactions */}
        <GlassCard hover={false} className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Recent Transactions</h2>
              <p className="text-sm text-muted">Your latest portfolio activity</p>
            </div>
            <button className="flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
              View All <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-1">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-xl px-3 py-4 transition-colors hover:bg-surface"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.positive ? "bg-primary/10" : "bg-destructive/10"}`}>
                    {tx.positive ? (
                      <ArrowUpRight className={`h-5 w-5 ${tx.positive ? "text-primary" : "text-destructive"}`} />
                    ) : (
                      <ArrowDownRight className={`h-5 w-5 ${tx.positive ? "text-primary" : "text-destructive"}`} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{tx.label}</p>
                    <p className="text-[11px] text-muted">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.positive ? "text-primary" : "text-destructive"}`}>
                    {tx.amount}
                  </p>
                  <span className="text-[10px] uppercase tracking-widest text-muted">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Business Holdings */}
        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground">Business Holdings</h2>
              <p className="text-sm text-muted">Manage and track your business investments</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]">
              <Plus className="h-4 w-4" />
              Add Business
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businessHoldings.map((business) => {
              const roi = ((business.valuation - business.cost) / business.cost) * 100
              return (
                <GlassCard key={business.name} className="flex flex-col">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="flex items-center gap-1.5 text-lg font-bold text-foreground">
                        {business.name}
                        <ExternalLink className="h-3.5 w-3.5 text-muted" />
                      </h3>
                      <p className="text-xs text-muted">{business.industry}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                      {business.status}
                    </span>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-medium text-muted">Ownership</p>
                    <p className="text-3xl font-extrabold text-foreground">{business.ownership.toFixed(1)}%</p>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted">Current Value</p>
                      <p className="text-base font-bold text-foreground">{formatCurrency(business.valuation)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted">ROI</p>
                      <p className="text-base font-bold text-primary">{formatPercent(roi)}</p>
                    </div>
                  </div>

                  <div className="mt-auto border-t border-glass-border pt-4 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Revenue</span>
                      <span className="font-bold text-foreground">{formatCurrency(business.revenue)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Net Income</span>
                      <span className="font-bold text-foreground">{formatCurrency(business.netIncome)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted">Employees</span>
                      <span className="font-bold text-foreground">{business.employees}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-glass-border py-2 text-xs font-bold text-foreground transition-colors hover:bg-surface">
                      <Activity className="h-3.5 w-3.5" />
                      Analytics
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-glass-border py-2 text-xs font-bold text-foreground transition-colors hover:bg-surface">
                      <FileText className="h-3.5 w-3.5" />
                      Reports
                    </button>
                  </div>
                </GlassCard>
              )
            })}
          </div>
        </div>
      </main>
    </AuthGuard>
  )
}
