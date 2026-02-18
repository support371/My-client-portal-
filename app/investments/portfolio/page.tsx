"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { PortalHeader } from "@/components/portal-header"
import { GlassCard } from "@/components/glass-card"
import { db, type Holding, type PricePoint } from "@/lib/db-mock"
import { addHoldingAction, removeHoldingAction, addPricePointAction } from "./actions"
import { PortfolioChart } from "./PortfolioChart"
import {
  Plus,
  TrendingUp,
  Trash2,
  DollarSign,
  BarChart3,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

export default function PortfolioPage() {
  const { session } = useAuth()
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [prices, setPrices] = useState<Record<string, number>>({})

  // Form states
  const [newSymbol, setNewSymbol] = useState("")
  const [newQty, setNewQty] = useState("")
  const [newCost, setNewCost] = useState("")

  const [priceSymbol, setPriceSymbol] = useState("")
  const [priceVal, setPriceVal] = useState("")

  const fetchData = async () => {
    if (!session?.email) return
    const h = await db.holdings.findMany(session.email)
    setHoldings(h)

    // Fetch latest prices for each symbol
    const symbols = Array.from(new Set(h.map(i => i.symbol)))
    const priceMap: Record<string, number> = {}
    for (const s of symbols) {
      const p = await db.prices.findLatest(s)
      if (p) priceMap[s] = Number(p.price)
    }
    setPrices(priceMap)
  }

  useEffect(() => {
    fetchData()
  }, [session])

  // ⚡ Bolt Optimization: Memoize all portfolio computations
  const stats = useMemo(() => {
    let totalMarketValue = 0
    let totalCostBasis = 0

    const computedHoldings = holdings.map(h => {
      const latestPrice = prices[h.symbol] || 0
      const marketValue = Number(h.quantity) * latestPrice
      const costBasis = Number(h.quantity) * Number(h.avgCost)
      const unrealizedPL = marketValue - costBasis
      const plPercentage = costBasis > 0 ? (unrealizedPL / costBasis) * 100 : 0

      totalMarketValue += marketValue
      totalCostBasis += costBasis

      return {
        ...h,
        latestPrice,
        marketValue,
        costBasis,
        unrealizedPL,
        plPercentage
      }
    })

    const totalPL = totalMarketValue - totalCostBasis
    const totalPLPercentage = totalCostBasis > 0 ? (totalPL / totalCostBasis) * 100 : 0

    return {
      computedHoldings,
      totalMarketValue,
      totalCostBasis,
      totalPL,
      totalPLPercentage
    }
  }, [holdings, prices])

  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.email) return
    try {
      await addHoldingAction(session.email, newSymbol, Number(newQty), Number(newCost))
      setNewSymbol("")
      setNewQty("")
      setNewCost("")
      fetchData()
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addPricePointAction(priceSymbol, Number(priceVal))
      setPriceSymbol("")
      setPriceVal("")
      fetchData()
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <AuthGuard requiredRole="client">
      <PortalHeader
        title="Investment Portfolio"
        icon={<TrendingUp className="h-5 w-5 text-primary" />}
      />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-extrabold text-transparent">
            My Portfolio
          </h1>
          <p className="mt-1 text-sm text-muted">Track your holdings and performance across digital assets.</p>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <GlassCard>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Total Market Value</p>
            <p className="mt-2 text-3xl font-extrabold text-foreground">
              ${stats.totalMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </GlassCard>
          <GlassCard>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Cost Basis</p>
            <p className="mt-2 text-3xl font-extrabold text-muted-foreground">
              ${stats.totalCostBasis.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </GlassCard>
          <GlassCard className={stats.totalPL >= 0 ? "border-primary/30" : "border-destructive/30"}>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Total Unrealized P/L</p>
            <div className="mt-2 flex items-end gap-2">
              <p className={`text-3xl font-extrabold ${stats.totalPL >= 0 ? "text-primary" : "text-destructive"}`}>
                {stats.totalPL >= 0 ? "+" : ""}${Math.abs(stats.totalPL).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <span className={`mb-1 text-sm font-bold ${stats.totalPL >= 0 ? "text-primary" : "text-destructive"}`}>
                ({stats.totalPLPercentage.toFixed(2)}%)
              </span>
            </div>
          </GlassCard>
        </div>

        {/* Charts and Forms */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GlassCard>
              <h3 className="mb-6 flex items-center gap-2 text-base font-bold text-foreground">
                <BarChart3 className="h-4 w-4 text-primary" /> Performance Overview
              </h3>
              <PortfolioChart data={[
                { date: "2026-01-01", value: stats.totalCostBasis * 0.9 },
                { date: "2026-01-15", value: stats.totalCostBasis * 1.05 },
                { date: "2026-02-01", value: stats.totalCostBasis * 0.98 },
                { date: "2026-02-15", value: stats.totalMarketValue },
              ]} />
            </GlassCard>

            <GlassCard className="mt-6">
              <h3 className="mb-4 text-base font-bold text-foreground">Holdings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-glass-border">
                      <th className="pb-3 text-xs font-bold uppercase text-primary">Symbol</th>
                      <th className="pb-3 text-xs font-bold uppercase text-primary">Qty</th>
                      <th className="pb-3 text-xs font-bold uppercase text-primary">Avg Cost</th>
                      <th className="pb-3 text-xs font-bold uppercase text-primary">Price</th>
                      <th className="pb-3 text-right text-xs font-bold uppercase text-primary">P/L</th>
                      <th className="pb-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.computedHoldings.map((h) => (
                      <tr key={h.id} className="border-b border-border/30">
                        <td className="py-4 font-bold text-foreground">{h.symbol}</td>
                        <td className="py-4 text-muted-foreground">{Number(h.quantity)}</td>
                        <td className="py-4 text-muted-foreground">${Number(h.avgCost).toFixed(2)}</td>
                        <td className="py-4 font-medium">${h.latestPrice.toFixed(2)}</td>
                        <td className={`py-4 text-right font-bold ${h.unrealizedPL >= 0 ? "text-primary" : "text-destructive"}`}>
                          <div className="flex flex-col items-end">
                            <span>{h.unrealizedPL >= 0 ? "+" : ""}{h.unrealizedPL.toFixed(2)}</span>
                            <span className="text-[10px] opacity-70">{h.plPercentage.toFixed(2)}%</span>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => removeHoldingAction(h.id).then(fetchData)}
                            className="text-muted hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {holdings.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-muted italic">No assets in portfolio yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard>
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
                <Plus className="h-4 w-4 text-primary" /> Add Asset
              </h3>
              <form onSubmit={handleAddHolding} className="space-y-4">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-muted">Symbol (e.g. BTC)</label>
                  <input
                    required
                    value={newSymbol}
                    onChange={e => setNewSymbol(e.target.value)}
                    className="h-10 w-full rounded-lg border border-glass-border bg-input px-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-muted">Quantity</label>
                    <input
                      required
                      type="number"
                      step="any"
                      value={newQty}
                      onChange={e => setNewQty(e.target.value)}
                      className="h-10 w-full rounded-lg border border-glass-border bg-input px-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-muted">Avg Cost</label>
                    <input
                      required
                      type="number"
                      step="any"
                      value={newCost}
                      onChange={e => setNewCost(e.target.value)}
                      className="h-10 w-full rounded-lg border border-glass-border bg-input px-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-transform hover:scale-[1.02]">
                  Add to Portfolio
                </button>
              </form>
            </GlassCard>

            <GlassCard>
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
                <RefreshCw className="h-4 w-4 text-secondary" /> Update Market Price
              </h3>
              <form onSubmit={handleUpdatePrice} className="space-y-4">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-muted">Symbol</label>
                  <input
                    required
                    value={priceSymbol}
                    onChange={e => setPriceSymbol(e.target.value)}
                    className="h-10 w-full rounded-lg border border-glass-border bg-input px-3 text-sm outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase text-muted">New Price ($)</label>
                  <input
                    required
                    type="number"
                    step="any"
                    value={priceVal}
                    onChange={e => setPriceVal(e.target.value)}
                    className="h-10 w-full rounded-lg border border-glass-border bg-input px-3 text-sm outline-none focus:border-secondary"
                  />
                </div>
                <button type="submit" className="w-full rounded-lg bg-secondary py-2.5 text-xs font-bold text-primary-foreground transition-transform hover:scale-[1.02]">
                  Update Price
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      </main>
    </AuthGuard>
  )
}
