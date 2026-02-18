"use server"

import { db } from "@/lib/db-mock"
import { revalidatePath } from "next/cache"

export async function addHoldingAction(userId: string, symbol: string, quantity: number, avgCost: number) {
  // ⚡ Bolt Optimization: Normalize symbol to uppercase
  const normalizedSymbol = symbol.toUpperCase().trim()
  if (!normalizedSymbol) throw new Error("Symbol is required")
  if (quantity <= 0) throw new Error("Quantity must be positive")

  await db.holdings.create({
    userId,
    symbol: normalizedSymbol,
    quantity,
    avgCost,
    currency: "USD"
  })

  revalidatePath("/investments/portfolio")
}

export async function removeHoldingAction(id: string) {
  await db.holdings.delete(id)
  revalidatePath("/investments/portfolio")
}

export async function addPricePointAction(symbol: string, price: number, asOf?: string) {
  const normalizedSymbol = symbol.toUpperCase().trim()
  if (price <= 0) throw new Error("Price must be positive")

  await db.prices.create({
    symbol: normalizedSymbol,
    price,
    asOf: asOf || new Date().toISOString()
  })

  revalidatePath("/investments/portfolio")
}
