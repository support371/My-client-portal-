"use client"

import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

/**
 * ⚡ Bolt Optimization: GlassCard
 *
 * 1. Optimizes browser style recalculations by using targeted transitions for
 *    'transform', 'border-color', and 'box-shadow' instead of 'transition-all'.
 * 2. Removed 'React.memo' (originally added as a micro-optimization) because this
 *    foundational wrapper primarily receives dynamic 'children' (inline JSX),
 *    making the shallow comparison overhead inefficient as it almost always fails.
 */
export function GlassCard({
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
        "rounded-xl border border-glass-border bg-card p-5 backdrop-blur-xl transition-[transform,border-color,box-shadow] duration-300",
        hover && "hover:-translate-y-1 hover:border-primary hover:shadow-[0_12px_40px_var(--color-glass-shadow)]",
        className
      )}
    >
      {children}
    </div>
  )
}
