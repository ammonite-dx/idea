import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        // リクエストボディからfindOptionsを取得
        const body = await request.json();
        const findOptions = body.findOptions;
        if (!findOptions) {
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

        // Powerモデルからデータを取得
        const data = await prisma.power.findMany({...findOptions});
        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error('Error in Power API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}