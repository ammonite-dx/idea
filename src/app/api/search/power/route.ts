import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';
import type { PowerResponse } from '@/types/types';
import { POWER_CATEGORIES } from '@/consts/power';
import { calculatePageStructure } from '@/utils/pagination';
import { parsePower } from '@/utils/parseRecord';
import { categorizeRecords } from '@/utils/search';

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
        const categories = searchParams.getAll('category');
        const name = searchParams.get('name');
        const maxlv = searchParams.get('maxlv');
        const timings = searchParams.getAll('timing');
        const skills = searchParams.getAll('skill');
        const dfclties = searchParams.getAll('dfclty');
        const targets = searchParams.getAll('target');
        const rngs = searchParams.getAll('rng');
        const encroaches = searchParams.getAll('encroach');
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
        if (categories.length > 0) {whereConditions.push({OR: categories.map(category => ({category: category}))});}
        if (name !== null) {whereConditions.push({name: {contains: name}});}
        if (maxlv !== null) {whereConditions.push({OR: [{maxlv_int: null}, {maxlv_int: {gte: parseInt(maxlv)}}]});}
        if (timings.length > 0) {whereConditions.push({OR: timings.map(timing => ({timing: {contains: timing}}))});}
        if (skills.length > 0) {whereConditions.push({OR: skills.map(skill => ({skill: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))});}
        if (dfclties.length > 0) {whereConditions.push({OR: dfclties.map(dfclty => ({dfclty: dfclty}))});}
        if (targets.length > 0) {whereConditions.push({OR: targets.map(target => ({target: target}))});}
        if (rngs.length > 0) {whereConditions.push({OR: rngs.map(rng => ({rng: rng}))});}
        if (encroaches.length > 0) {whereConditions.push({OR: encroaches.map(encroach => ({encroach: encroach}))});}
        if (restricts.length > 0) {whereConditions.push({OR: restricts.map(restrict => ({restrict: {contains: restrict}}))});}
        if (effect !== null) {whereConditions.push({effect: {contains: effect}});}
        console.log('API Route: Search Power - whereConditions:', whereConditions);

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
            const categoriesInfo = await Promise.all(POWER_CATEGORIES.map(async (category) => {
                const count = await prisma.power.count({
                    where: {
                        AND: [
                            { category: category.name },
                            ...whereConditions,
                        ],
                    },
                });
                return { id: category.id, name: category.name, count };
            })).then(categories => categories.filter(category => category.count > 0));
            const { totalPages, pageDefinitions } = calculatePageStructure(categoriesInfo, ITEMS_PER_PAGE);
            return NextResponse.json({ totalPages, pageDefinitions }, { status: 200 });
        
        } else if (action === 'getPage') {
            // ページ定義に基づいて、該当するカテゴリのレコードを取得
            let responses: PowerResponse[] = [];
            let currentSkip = 0;
            let moreDataToFetch = true;
            while (moreDataToFetch) {
                const batch: PowerResponse[] = await prisma.power.findMany({
                    where: {
                        AND: whereConditions,
                    },
                    include: {
                        ref_weapon: true,
                        ref_armor: true,
                        refed_dlois: true,
                        favorited_by: true,
                    },
                    orderBy: [
                        { supplement_order: 'asc' as const },
                        { category_order: 'asc' as const },
                        { type_restrict_order: 'asc' as const },
                        { additional_order: 'asc' as const },
                        { ruby: 'asc' as const },
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
            const records = responses.map(response => parsePower(response));
            const dataForPage = categorizeRecords(POWER_CATEGORIES, records);
            return NextResponse.json({ dataForPage }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error: unknown) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}