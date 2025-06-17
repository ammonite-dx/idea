import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';
import type { WorkResponse } from '@/types/types';
import { parseWork } from '@/utils/parseRecord';

export const runtime = 'edge';

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {

        // クエリを取得
        const searchParams = request.nextUrl.searchParams;
        const name = searchParams.get('name');
        const supplements = searchParams.getAll('supplement');
        const stats = searchParams.getAll('stat');
        const skills = searchParams.getAll('skill');

        // 検索条件の作成
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const whereConditions: any[] = [];
        if (supplements.length > 0) {
            whereConditions.push({OR: supplements.map(supplement => ({supplement: supplement}))});
            whereConditions.push({OR: [
                {update_supplement: null},
                {NOT: supplements.map(supplement => ({update_supplement: {contains: supplement}}))}
            ]})
        } else {
            whereConditions.push({update_supplement: null});
        }
        if (name !== null) {whereConditions.push({name: {contains: name}});}
        if (stats.length > 0) {whereConditions.push({OR: stats.map(stat => ({stat: stat}))});}
        if (skills.length > 0) {whereConditions.push({OR: skills.map(skill => ({skills: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))});}
        console.log('API Route: Search Power - whereConditions:', whereConditions);

        // D1データベースのバインディングを取得
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const DB_BINDING = (process.env as any).DB as D1Database;
        if (!DB_BINDING) {
            console.error("API Route: D1 binding 'DB' not found.");
            return NextResponse.json({ error: "D1 binding not configured" }, { status: 500 });
        }
        const prisma = getPrismaClient(DB_BINDING);

        // ページ定義に基づいて、該当するカテゴリのレコードを取得
        const responses: WorkResponse[] = await prisma.work.findMany({
            where: {
                AND: whereConditions,
            },
        });
        const records = responses.map(response => parseWork(response));
        return NextResponse.json({ records }, { status: 200 });
    } catch (error: unknown) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}