import { PrismaClient }   from "@prisma/client";
import { PrismaD1 }        from "@prisma/adapter-d1";
import { D1Database }      from "@cloudflare/workers-types";

let cache: { [binding: string]: PrismaClient } = {};

export default function getPrismaClient(env: { DB: D1Database }): PrismaClient {
  // ページ関数ごとに渡ってくる env.DB をキーにキャッシュ
  const key = "DB";
  if (!cache[key]) {
    cache[key] = new PrismaClient({
      adapter: new PrismaD1(env.DB),
    });
  }
  return cache[key];
}