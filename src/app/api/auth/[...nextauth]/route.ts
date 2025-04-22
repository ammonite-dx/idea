export const runtime = "edge"

import NextAuth from "next-auth"
import { authOptions } from "@/auth"

// 公式ドキュメント推奨パターン :contentReference[oaicite:0]{index=0}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }