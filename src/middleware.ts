import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- 以下のパスはセッションチェックをスキップ ---
  if (
    // Discord OAuth2 のログイン／コールバック
    pathname.startsWith("/api/auth/discord") ||
    // サインイン・エラー表示ページ
    pathname.startsWith("/auth") ||
    // 静的ファイルやビルド成果物
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // --- それ以外はセッション必須 ---
  const token = req.cookies.get("session")?.value;
  if (!token) {
    // 未ログインならサインインページへ
    return NextResponse.redirect(new URL("/auth/discord/signin", req.url));
  }

  try {
    // JWT 検証
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return NextResponse.next();
  } catch {
    // トークン無効なら再ログイン
    return NextResponse.redirect(new URL("/auth/discord/signin", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};