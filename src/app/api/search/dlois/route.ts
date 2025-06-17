import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';
import type { DloisResponse } from '@/types/types';
import { calculatePageStructure } from '@/utils/pagination';
import { parseDlois } from '@/utils/parseRecord';
import { Category } from '@/types/pagination';

export const runtime = 'edge';

const ITEMS_PER_PAGE = 200; // 1ページあたりのアイテム数
const BATCH_SIZE = 100; // レコード取得時のバッチサイズ

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {

        // クエリを取得
        const searchParams = request.nextUrl.searchParams;
        const action = searchParams.get('action');
        const types = searchParams.getAll('type');
        const supplements = searchParams.getAll('supplement');
        const name = searchParams.get('name');
        const restricts = searchParams.getAll('restrict');
        const effect = searchParams.get('effect');

        // 検索条件の作成
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const whereConditions: any[] = [];
        if (types.length > 0) {whereConditions.push({OR: types.map(type => ({type: type}))});}
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
        if (restricts.length > 0) {whereConditions.push({OR: restricts.map(restrict => ({restrict: {contains: restrict}}))});}
        if (effect !== null) {whereConditions.push({effect: {contains: effect}});}

        // D1データベースのバインディングを取得
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const DB_BINDING = (process.env as any).DB as D1Database;
        if (!DB_BINDING) {
            console.error("API Route: D1 binding 'DB' not found.");
            return NextResponse.json({ error: "D1 binding not configured" }, { status: 500 });
        }
        const prisma = getPrismaClient(DB_BINDING);

        if (action === 'getInfo') {
            // ページネーションの情報取得
            const conut: number = await prisma.dlois.count({where: {AND: whereConditions}});

            const categoriesInfo: Category[] = [{id: 'dlois', name: 'Dロイス', count: conut}];
            const { totalPages, pageDefinitions } = calculatePageStructure(categoriesInfo, ITEMS_PER_PAGE);
            return NextResponse.json({ totalPages, pageDefinitions }, { status: 200 });
        
        } else if (action === 'getPage') {
            // ページ定義に基づいて、該当するカテゴリのレコードを取得
            let responses: DloisResponse[] = [];
            let currentSkip = 0;
            let moreDataToFetch = true;
            while (moreDataToFetch) {
                const batch: DloisResponse[] = await prisma.dlois.findMany({
                    where: {
                        AND: whereConditions,
                    },
                    include: {
                        ref_power: true,
                        favorited_by: true,
                    },
                    orderBy: [
                        { type_order: 'asc' as const },
                        { restrict_order: 'asc' as const },
                        { no: 'asc' as const },
                        { additional_order: 'asc' as const },
                    ],
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
            const records = responses.map(response => parseDlois(response));
            const dataForPage: Category[] = [{id: 'dlois', name: 'Dロイス', count: records.length, records: records}];
            return NextResponse.json({ dataForPage }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error: unknown) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}