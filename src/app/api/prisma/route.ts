import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';
import type { ResponseMap } from '@/types/types';

export const runtime = 'edge';

interface ApiRequestBody {
  model: keyof ResponseMap;
  findOptions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orderBy?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    include?: any;
  };
}

// Prisma Clientのモデルdelegateを型安全に取得するヘルパー関数
function getPrismaModelDelegate(prisma: PrismaClient, modelKey: keyof ResponseMap) {
  const delegate = prisma[modelKey as keyof PrismaClient];
  if (!delegate || typeof (delegate as any).findMany !== 'function') {
    // findManyメソッドが存在しない、またはmodelKeyが不正な場合
    throw new Error(`Invalid model key or delegate does not support findMany: ${modelKey}`);
  }
  // findManyメソッドを持つことを型で示す (より具体的な型も可能)
  return delegate as { findMany: (args: any) => Promise<any[]> };
}

export async function POST(
    request: Request
): Promise<NextResponse> {
    try {
        // リクエストボディからmodelとfindOptionsを取得
        const body: ApiRequestBody = await request.json();
        const model = body.model;
        const findOptions = body.findOptions;
        if (!model || !findOptions) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        // D1データベースのバインディングを取得
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const DB_BINDING = (process.env as any).DB as D1Database;
        if (!DB_BINDING) {
            console.error("API Route: D1 binding 'DB' not found.");
            return NextResponse.json({ error: "D1 binding not configured" }, { status: 500 });
        }
        const prisma = getPrismaClient(DB_BINDING);
        const modelDelegate = getPrismaModelDelegate(prisma, model);

        // レコード取得時のバッチサイズを設定
        const BATCH_SIZE = 100;

        // レコードをバッチで取得
        let responses: ResponseMap[keyof ResponseMap][] = [];
        let currentSkip = 0;
        let moreDataToFetch = true;
        while (moreDataToFetch) {
            const batch: ResponseMap[keyof ResponseMap][] = await modelDelegate.findMany({
                ...findOptions,
                take: BATCH_SIZE,
                skip: currentSkip,
            });

            if (batch.length > 0) {
                responses = responses.concat(batch);
                currentSkip += batch.length; // 次の取得開始位置を更新
                if (batch.length < BATCH_SIZE) moreDataToFetch = false; // 取得した件数がBATCH_SIZEより少なければ、それが最後のバッチ
            } else {
                moreDataToFetch = false; // 取得できるデータがなくなった場合はループを終了
            }
        }

        return NextResponse.json(responses);
    } catch (error: unknown) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}