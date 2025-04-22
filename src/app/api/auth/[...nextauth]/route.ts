export const runtime = "edge"
import { handlers } from "@/auth"
import type { NextRequest } from "next/server"

export const GET = async (req: NextRequest) => {
  console.error("[DEBUG] GET path          =", req.nextUrl.pathname)
  console.error("[DEBUG] GET original URL  =", req.url)
  // 続いて本来の処理へ
  return handlers.GET(req)
}

export const POST = async (req: NextRequest) => {
  console.error("[DEBUG] POST path         =", req.nextUrl.pathname)
  console.error("[DEBUG] POST original URL =", req.url)
  return handlers.POST(req)
}