import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// NextAuth() が返すハンドラー関数を一度だけ受け取る
const handler = NextAuth(authOptions);

// App Router では default export は無効。
// GET／POST のみを named exports にする
export { handler as GET, handler as POST };