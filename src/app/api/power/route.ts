import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';
import type { PowerResponse } from '@/types/types';

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        // リクエストボディからwhereOptionsを取得
        const body = await request.json();
        const whereOptions = body.whereOptions;
        if (!whereOptions) {
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

        // エフェクト取得時のバッチサイズを設定
        const BATCH_SIZE = 100;

        // エフェクトをバッチで取得
        let powerResponses: PowerResponse[] = [];
        let currentSkip = 0;
        let moreDataToFetch = true;
        while (moreDataToFetch) {
            const batch: PowerResponse[] = await prisma.power.findMany({
                where: whereOptions,
                orderBy: [
                    {type_restrict_order: 'asc' as const},
                    {ruby: 'asc' as const},
                ],
                include: {
                    ref_weapon: true,
                    ref_armor: true,
                    refed_dlois: true,
                    favorited_by: true,
                },
                take: BATCH_SIZE,
                skip: currentSkip,
            });

            if (batch.length > 0) {
                powerResponses = powerResponses.concat(batch);
                currentSkip += batch.length; // 次の取得開始位置を更新
                if (batch.length < BATCH_SIZE) moreDataToFetch = false; // 取得した件数がBATCH_SIZEより少なければ、それが最後のバッチ
            } else {
                moreDataToFetch = false; // 取得できるデータがなくなった場合はループを終了
            }
        }
        return NextResponse.json(powerResponses);
    } catch (error: unknown) {
        console.error('Error in Power API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}