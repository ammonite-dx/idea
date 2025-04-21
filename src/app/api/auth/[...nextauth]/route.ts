export const runtime = "edge";

import { handlers } from "@/auth";

// App Router では default export を使わず、HTTP メソッドごとの名前付きエクスポートにする
export { handlers as GET, handlers as POST };