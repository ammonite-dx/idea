import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';
import type { UserResponse } from '@/types/types';
import { parseUser } from '@/utils/parseRecord';

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

        const response: UserResponse | null = await prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                fav_powers: {
                    include: {
                        ref_weapon: true,
                        ref_armor: true,
                        favorited_by: true,
                    },
                },
                fav_weapons: {
                    include: {
                        refed_power: true,
                        refed_armor: true,
                        refed_general: true,
                        favorited_by: true,
                    },
                },
                fav_armors: {
                    include: {
                        ref_weapon: true,
                        refed_power: true,
                        favorited_by: true,
                    },
                },
                fav_vehicles: {
                    include: {
                        favorited_by: true,
                    },
                },
                fav_connections: {
                    include: {
                        favorited_by: true,
                    },
                },
                fav_generals: {
                    include: {
                        ref_weapon: true,
                        favorited_by: true,
                    },
                },
                fav_dloises: {
                    include: {
                        ref_power: true,
                        favorited_by: true,
                    },
                },
                fav_eloises: {
                    include: {
                        favorited_by: true,
                    },
                },
            },
        });
        if (!response) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const record = parseUser(response);
        return NextResponse.json({ record }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error in Power API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}