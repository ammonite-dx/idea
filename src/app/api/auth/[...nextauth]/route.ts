export const runtime = "edge";

import { handlers } from "@/auth";

// handlers の中に GET, POST として定義されている関数を
// そのまま名前付きエクスポートする
export const { GET, POST } = handlers;