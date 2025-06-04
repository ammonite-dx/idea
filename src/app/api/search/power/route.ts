import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';
import type { CategoryWithCardRecords, PowerResponse } from '@/types/types';
import { POWER_CATEGORIES } from '@/consts/power';
import { calculatePageStructure } from '@/utils/pagination';
import { parsePower } from '@/utils/parseRecord';
import type { TocItem } from '@/features/search/TableOfContents';

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
        const page = searchParams.get('page');
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
        if (types !== null) {whereConditions.push({OR: types.map(type => ({type: type}))});}
        if (supplements !== null) {
            whereConditions.push({OR: supplements.map(supplement => ({supplement: supplement}))});
            whereConditions.push({OR: [
                {update_supplement: null},
                {NOT: supplements.map(supplement => ({update_supplement: {contains: supplement}}))}
            ]})
        } else {
            whereConditions.push({update_supplement: null});
        }
        if (categories !== null) {whereConditions.push({OR: categories.map(category => ({category: category}))});}
        if (name !== null) {whereConditions.push({name: {contains: name}});}
        if (maxlv !== null) {whereConditions.push({OR: [{maxlv_int: null}, {maxlv_int: {gte: parseInt(maxlv)}}]});}
        if (timings !== null) {whereConditions.push({OR: timings.map(timing => ({timing: {contains: timing}}))});}
        if (skills !== null) {whereConditions.push({OR: skills.map(skill => ({skill: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))});}
        if (dfclties !== null) {whereConditions.push({OR: dfclties.map(dfclty => ({dfclty: dfclty}))});}
        if (targets !== null) {whereConditions.push({OR: targets.map(target => ({target: target}))});}
        if (rngs !== null) {whereConditions.push({OR: rngs.map(rng => ({rng: rng}))});}
        if (encroaches !== null) {whereConditions.push({OR: encroaches.map(encroach => ({encroach: encroach}))});}
        if (restricts !== null) {whereConditions.push({OR: restricts.map(restrict => ({restrict: {contains: restrict}}))});}
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
            const categoriesInfo = await Promise.all(POWER_CATEGORIES.map(async (category) => {
                const count = await prisma.power.count({
                    where: {
                        AND: [
                            { category: category },
                            ...whereConditions,
                        ],
                    },
                });
                return { id: category.id, name: category.name, count };
            })).then(categories => categories.filter(category => category.count > 0));
            const { totalPages, pageDefinitions } = calculatePageStructure(
                categoriesInfo,
                ITEMS_PER_PAGE
            );
            const tableOfContents: TocItem[] = [];
            pageDefinitions.forEach(pageDefinition => {
                pageDefinition.categories.forEach(category => {
                    tableOfContents.push({
                        categoryId: category.id,
                        categoryName: category.name,
                        pageNumber: pageDefinition.page,
                    });
                });
            });
            return NextResponse.json({
                totalPages,
                pageDefinitions,
                tableOfContents,
            });
        } else if (action === 'getPage') {
            // ページごとのデータ取得
            const pageNumber = parseInt(page || "1");
            // getInfoと同様にカテゴリごとの件数を取得してページ定義を計算
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
            const { totalPages, pageDefinitions } = calculatePageStructure(
                categoriesInfo,
                ITEMS_PER_PAGE
            );
            // 指定されたページ番号に対応するカテゴリを取得
            const pageDefinition = pageDefinitions.find(pageDefinition => pageDefinition.page === pageNumber);
            if (!pageDefinition) {
                return NextResponse.json({ currentPage: pageNumber, totalPages, dataForPage: [] }, { status: 200 });
            }
            // ページ定義に基づいて、該当するカテゴリのレコードを取得
            const dataForPage: CategoryWithCardRecords[] = [];
            for (const category of pageDefinition.categories) {
                // レコードをバッチで取得
                let responses: PowerResponse[] = [];
                let currentSkip = 0;
                let moreDataToFetch = true;
                while (moreDataToFetch) {
                    const batch: PowerResponse[] = await prisma.power.findMany({
                        where: {
                            AND: [
                                { category: category.name },
                                ...whereConditions,
                            ],
                        },
                        include: {
                            ref_weapon: true,
                            ref_armor: true,
                            refed_dlois: true,
                            favorited_by: true,
                        },
                        orderBy: [
                            { type_restrict_order: 'asc' as const },
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
                dataForPage.push({
                    id: category.id,
                    name: category.name,
                    records: records,
                });
            }
            return NextResponse.json({ currentPage: pageNumber, totalPages, dataForPage }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error: unknown) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}