import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  // 未ログインなら Discord サインインページへリダイレクト
  if (!req.auth?.user) {
    const url = new URL("/api/auth/signin/discord", req.url)
    return NextResponse.redirect(url)
  }
  // 認証済みなら何も返さず次へ
})
export const config = {
  // API や _next 以下を除く全パスを保護
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}