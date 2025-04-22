import { auth } from "@/auth";
import { getToken } from "next-auth/jwt";

export default auth(async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // 認証されていない場合、Discordの認証ページにリダイレクト
    return Response.redirect(new URL('/api/auth/signin/discord', req.url));
  }
})

export const config = {
  matcher: ["/((?!_next|favicon.ico|login|api/auth).*)"],
};