export { auth as middleware } from "@/auth"

export const config = {
  // API や Next.js の内部アセットを除く全ページを保護
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}