import { handlers } from "@/auth"
export const runtime = "edge";

// ここで確実にログを出す
console.log("🔷 [route.ts] Loaded NextAuth handlers")

export const { GET, POST } = handlers