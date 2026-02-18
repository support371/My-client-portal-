"use server"

import { db, type VipUpgradeRequest } from "@/lib/db-mock"
import { revalidatePath } from "next/cache"

export async function createVipRequestAction(userId: string, message: string) {
  // ⚡ Bolt: Early exit for invalid input
  if (!message.trim()) throw new Error("Message is required")

  // Check for existing pending request
  const existing = await db.vipRequests.findFirst(r => r.userId === userId && r.status === "PENDING")
  if (existing) throw new Error("You already have a pending request")

  await db.vipRequests.create({
    userId,
    message,
    status: "PENDING"
  })

  // ⚡ Bolt: Revalidate to ensure UI is fresh
  revalidatePath("/vip/request")
}

export async function decideVipRequestAction(
  requestId: string,
  decision: "APPROVED" | "REJECTED",
  adminId: string
) {
  const request = await db.vipRequests.update(requestId, {
    status: decision,
    decidedAt: new Date().toISOString(),
    decidedByUserId: adminId
  })

  if (decision === "APPROVED" && request) {
    // ⚡ Bolt: Real role promotion in the mock DB
    await db.users.update(request.userId, { role: "VIP" })
  }

  revalidatePath("/admin/vip-requests")
  revalidatePath(`/admin/vip-requests/${requestId}`)
}
