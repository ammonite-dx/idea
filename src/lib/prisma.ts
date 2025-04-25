/* eslint-disable no-var */
import { PrismaClient } from "@prisma/client"
import { PrismaD1 } from "@prisma/adapter-d1"
import type { D1Database } from "@cloudflare/workers-types"

// グローバルにキャッシュ用の変数と、Cloudflare Worker の D1 バインディングを宣言
declare global {
  var __prisma: PrismaClient | undefined
  var DB: D1Database
}

// PrismaClient のシングルトンを作成
const prisma = global.__prisma
  ?? new PrismaClient({
    adapter: new PrismaD1(globalThis.DB),
  })

// 初回生成時のみグローバルにキャッシュ
if (!global.__prisma) {
  global.__prisma = prisma
}

export default prisma