import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';

export const runtime = 'edge';

export async function POST(request: Request) {
    console.log('[API_PRISMA_POST] Handler reached!');
    try {
        const body = await request.json();
        const model = body.model;
        const findOptions = body.findOptions;

        if (!model || !findOptions) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const DB_BINDING = (process.env as any).DB as D1Database;
        if (!DB_BINDING) {
        console.error("API Route: D1 binding 'DB' not found.");
        return NextResponse.json({ error: "D1 binding not configured" }, { status: 500 });
        }
        const prisma = getPrismaClient(DB_BINDING);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await (prisma[model] as any).findMany(findOptions);
        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}