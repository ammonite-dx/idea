import NextAuth from "next-auth";
// ── 既存の authOptions を正しい相対パスでインポート
import { authOptions } from "./lib/auth";

// NextAuth を初期化してエクスポート
export const { auth, handlers } = NextAuth(authOptions);