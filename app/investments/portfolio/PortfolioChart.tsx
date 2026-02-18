"use client"

import { useMemo, memo } from "react"

interface DataPoint {
  date: string
  value: number
}

// ⚡ Bolt Optimization: Use a custom SVG chart for extreme performance and zero dependencies.
// Memoized to prevent re-rendering unless the data changes.
export const PortfolioChart = memo(function PortfolioChart({ data }: { data: DataPoint[] }) {
  const points = useMemo(() => {
    if (data.length < 2) return ""
    const maxVal = Math.max(...data.map(d => d.value), 1)
    const minVal = Math.min(...data.map(d => d.value), 0)
    const range = maxVal - minVal || 1

    const width = 1000
    const height = 300
    const padding = 20

    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * (width - padding * 2) + padding
      const y = height - ((d.value - minVal) / range) * (height - padding * 2) - padding
      return `${x},${y}`
    }).join(" ")
  }, [data])

  if (data.length < 2) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl bg-surface/50 text-sm text-muted">
        Insufficient data for chart
      </div>
    )
  }

  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-surface/30 p-4">
      <svg
        viewBox="0 0 1000 300"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Fill Area */}
        <path
          d={`M 20,280 L ${points} L 980,280 Z`}
          fill="url(#chartGradient)"
        />

        {/* Line */}
        <polyline
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>

      {/* Legend / Info */}
      <div className="absolute left-6 top-6">
        <p className="text-xs font-bold uppercase tracking-wider text-muted">Portfolio History</p>
        <p className="text-lg font-extrabold text-foreground">Value over time</p>
      </div>
    </div>
  )
})
