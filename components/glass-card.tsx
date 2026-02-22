"use client"

import { cn } from "@/lib/utils"
import { memo, type ReactNode } from "react"

/**
 * ⚡ Bolt Optimization: GlassCard Component
 *
 * 1. Wrapped in React.memo to prevent unnecessary re-renders when parent state changes.
 *    This is effective when children are stable or simple primitives.
 * 2. Optimized transitions by targeting specific properties (transform, border-color, box-shadow, opacity)
 *    instead of using 'transition-all'. This reduces the browser's style recalculation
 *    overhead during hover interactions.
 *
 * Impact: Improves frame rates during hover animations and reduces CPU usage across the app.
 */
export const GlassCard = memo(function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-glass-border bg-card p-5 backdrop-blur-xl transition-[transform,border-color,box-shadow,opacity] duration-300",
        hover && "hover:-translate-y-1 hover:border-primary hover:shadow-[0_12px_40px_var(--color-glass-shadow)]",
        className
      )}
    >
      {children}
    </div>
  )
})
