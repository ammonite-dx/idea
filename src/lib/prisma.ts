/* eslint-disable no-var */
import { PrismaClient } from "@prisma/client"
import { PrismaD1 } from "@prisma/adapter-d1"
import type { D1Database } from "@cloudflare/workers-types"

function getPrisma(db: D1Database) {
  // PrismaD1 が「Driver Adapter」の実装本体です
  const adapter = new PrismaD1(db)
  return new PrismaClient({ adapter })
}

export default getPrisma