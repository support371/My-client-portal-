"use client"

import { cn } from "@/lib/utils"
import { type ReactNode } from "react"

/**
 * ⚡ Bolt Optimization: GlassCard Component
 *
 * Replaces 'transition-all' with specific property transitions to reduce
 * browser style recalculation overhead during hover interactions.
 *
 * Note: React.memo is not used here because this component primarily renders
 * 'children', which often creates new object references on every render,
 * making the comparison overhead not worth the rare skip.
 *
 * Impact: Improves style calculation efficiency across the entire application.
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
