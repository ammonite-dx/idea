import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // 認証されていない場合、Discordの認証ページにリダイレクト
    return NextResponse.redirect(new URL('/api/auth/signin/discord', req.url));
  }

  // 通常のルート処理を続行
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|login|api/auth).*)"],
};
