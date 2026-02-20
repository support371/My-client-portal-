"use client"

import { cn } from "@/lib/utils"
import { type ReactNode, memo } from "react"

/**
 * ⚡ Bolt Optimization: GlassCard Component
 *
 * 1. Wrapped in React.memo to reduce re-renders when parent components update.
 *    While 'children' often change references, this still helps when parent
 *    state changes don't affect the card's content.
 *
 * 2. Optimized Transitions: Replaced 'transition-all' with specific properties.
 *    Targeting 'transform', 'border-color', and 'box-shadow' reduces the work
 *    the browser's style engine performs during hover interactions.
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
        "rounded-xl border border-glass-border bg-card p-5 backdrop-blur-xl transition-[transform,border-color,box-shadow] duration-300",
        hover && "hover:-translate-y-1 hover:border-primary hover:shadow-[0_12px_40px_var(--color-glass-shadow)]",
        className
      )}
    >
      {children}
    </div>
  )
})
