export const runtime = "edge"

import { handlers } from "@/auth"
import type { NextRequest } from "next/server"

export const GET = async (req: NextRequest) => {
  // クエリパラメータに入ってしまった nextauth=signin/discord を取り出し
  const param = req.nextUrl.searchParams.get("nextauth") || ""
  const [action, provider] = param.split("/")

  // pathname を本来の /api/auth/{action}/{provider} に書き換え
  req.nextUrl.pathname = `/api/auth/${action}/${provider}`

  // クエリは不要なので全部クリア（handlers 内でクエリを使わないため）
  req.nextUrl.search = ""

  // デバッグログ
  console.error("[DEBUG] rewritten path =", req.nextUrl.pathname)

  // NextRequest そのまま渡せるので型エラーなし
  return handlers.GET(req)
}

export const POST = async (req: NextRequest) => {
  // 同様に POST も書き換えてから渡す
  const param = req.nextUrl.searchParams.get("nextauth") || ""
  const [action, provider] = param.split("/")
  req.nextUrl.pathname = `/api/auth/${action}/${provider}`
  req.nextUrl.search = ""
  return handlers.POST(req)
}