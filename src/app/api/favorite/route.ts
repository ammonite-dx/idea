export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import getPrismaClient from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';

// 簡易 Cookie パース
function parseCookies(cookieHeader: string): Record<string, string> {
    return cookieHeader.split(';').reduce((acc, part) => {
        const [key, ...rest] = part.split('=');
        const value = rest.join('=');
        if (key && value) acc[key.trim()] = decodeURIComponent(value.trim());
        return acc;
    }, {} as Record<string, string>);
}

// JWT から userId を取得
async function getUserIdFromRequest(request: Request, secret: Uint8Array): Promise<string | null> {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = parseCookies(cookieHeader);
    const token = cookies.session;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, secret);
        return typeof payload.sub === 'string' ? payload.sub : null;
    } catch {
        return null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: Request, context: any) {
    const { DB, JWT_SECRET } = context.env as { DB: D1Database; JWT_SECRET: string };
    const secret = new TextEncoder().encode(JWT_SECRET);

    const userId = await getUserIdFromRequest(request, secret);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const kind = url.searchParams.get('record-kind');
    if (!kind) {
        return NextResponse.json(
        { error: 'Missing query parameter: record-kind' },
        { status: 400 }
        );
    }
    const recordId = url.searchParams.get('record-id') || undefined;

    const prisma = getPrismaClient(DB);
    const where = recordId
        ? { user_id: userId, record_kind: kind, record_id: recordId }
        : { user_id: userId, record_kind: kind };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const favorites = await prisma.favorite.findMany({ where });

    return NextResponse.json(favorites);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(request: Request, context: any) {
    const { DB, JWT_SECRET } = context.env as { DB: D1Database; JWT_SECRET: string };
    const secret = new TextEncoder().encode(JWT_SECRET);

    const userId = await getUserIdFromRequest(request, secret);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recordKind, recordId } = (await request.json()) as {
        recordKind?: string;
        recordId?: string;
    };
    if (!recordKind || !recordId) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const prisma = getPrismaClient(DB);
    const favorite = await prisma.favorite.create({
        data: { user_id: userId, record_kind: recordKind, record_id: recordId },
    });

    return NextResponse.json({ ok: true, favorite });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: Request, context: any) {
    const { DB, JWT_SECRET } = context.env as { DB: D1Database; JWT_SECRET: string };
    const secret = new TextEncoder().encode(JWT_SECRET);

    const userId = await getUserIdFromRequest(request, secret);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recordKind, recordId } = (await request.json()) as {
        recordKind?: string;
        recordId?: string;
    };
    if (!recordKind || !recordId) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const prisma = getPrismaClient(DB);
    await prisma.favorite.deleteMany({
        where: { user_id: userId, record_kind: recordKind, record_id: recordId },
    });

    return NextResponse.json({ ok: true });
}
