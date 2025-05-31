import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';

export const runtime = 'edge';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const model = body.recordKind;
        const userId = body.userId;
        const recordId = body.recordId;

        if (!model || !userId || !recordId) {
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
        const newFavorite = await (prisma[model] as any).update({
            where: { id: recordId },
            data: {
                favorited_by: {
                    connect: { id: userId },
                },
            },
        });
        return NextResponse.json(newFavorite, { status: 201 });
    } catch (error: unknown) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const model = body.recordKind;
        const userId = body.userId;
        const recordId = body.recordId;

        if (!model || !userId || !recordId) {
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
        const updatedFavorite = await (prisma[model] as any).update({
            where: { id: recordId },
            data: {
                favorited_by: {
                    disconnect: { id: userId },
                },
            },
        });
        return NextResponse.json(updatedFavorite, { status: 200 });
    } catch (error: unknown) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}