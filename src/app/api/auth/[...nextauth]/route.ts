export const runtime = "edge"

import { handlers } from "@/auth"
import type { NextRequest } from "next/server"

export const GET = async (request: NextRequest) => {
  try {
    return await handlers.GET(request)
  } catch (error) {
    console.error("[NEXTAUTH HANDLER GET ERROR]", error)
    throw error
  }
}

export const POST = async (request: NextRequest) => {
  try {
    return await handlers.POST(request)
  } catch (error) {
    console.error("[NEXTAUTH HANDLER POST ERROR]", error)
    throw error
  }
}