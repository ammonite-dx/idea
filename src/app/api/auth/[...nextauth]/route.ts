import { handlers as nextAuthHandlers } from "@/auth";

// App Router では default エクスポートは使えない
// 各 HTTP メソッドを handlers に割り当てる
export { nextAuthHandlers as GET, nextAuthHandlers as POST };