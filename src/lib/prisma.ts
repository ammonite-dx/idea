import { PrismaClient }   from "@prisma/client";
import { PrismaD1 }        from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

let prisma: PrismaClient | null = null;

/** リクエストごとではなく、ワーカーのウォームスタート中は同一インスタンスを使い回す */
export default async function getPrismaClient(): Promise<PrismaClient> {
  if (prisma) return prisma;

  // 初回生成時のみ、binded DB を取得
  const { env } = await getCloudflareContext({ async: true });
  prisma = new PrismaClient({
    adapter: new PrismaD1(env.DB),
  });
  return prisma;
}