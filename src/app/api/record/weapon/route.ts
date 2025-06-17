import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';
import type { WeaponResponse } from '@/types/types';
import { parseWeapon } from '@/utils/parseRecord';

export const runtime = 'edge';

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {

        // クエリを取得
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // D1データベースのバインディングを取得
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const DB_BINDING = (process.env as any).DB as D1Database;
        if (!DB_BINDING) {
            console.error("API Route: D1 binding 'DB' not found.");
            return NextResponse.json({ error: "D1 binding not configured" }, { status: 500 });
        }
        const prisma = getPrismaClient(DB_BINDING);

        const response: WeaponResponse | null = await prisma.weapon.findUnique({
            where: {
                id: id,
            },
            include: {
                refed_power: true,
                refed_armor: true,
                refed_general: true,
                other_vers: true,
                rel_powers: true,
                rel_weapons: true,
                rel_armors: true,
                rel_vehicles: true,
                rel_connections: true,
                rel_generals: true,
                rel_dloises: true,
                rel_faqs: true,
                rel_infos: true,
                favorited_by: true,
            },
        });
        if (!response) {
            return NextResponse.json({ error: 'Weapon not found' }, { status: 404 });
        }
        const record = parseWeapon(response);
        return NextResponse.json({ record }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error in Weapon API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}