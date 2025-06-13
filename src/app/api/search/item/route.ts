import { NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';
import type { Item, WeaponResponse, ArmorResponse, VehicleResponse, ConnectionResponse, GeneralResponse } from '@/types/types';
import { ITEM_CATEGORIES } from '@/consts/item';
import { calculatePageStructure } from '@/utils/pagination';
import { parseWeapon, parseArmor, parseVehicle, parseConnection, parseGeneral } from '@/utils/parseRecord';
import { categorizeRecords } from '@/utils/search';

export const runtime = 'edge';

const ITEMS_PER_PAGE = 200; // 1ページあたりのアイテム数
const BATCH_SIZE = 100; // レコード取得時のバッチサイズ

export async function GET(
    request: NextRequest
): Promise<NextResponse> {
    try {
        // クエリを取得
        // アイテム全般
        const searchParams = request.nextUrl.searchParams;
        const action = searchParams.get('action');
        const supplements = searchParams.getAll('supplement');
        const categories = searchParams.getAll('category');
        const name = searchParams.get('name');
        const procure = searchParams.get('procure');
        const stock = searchParams.get('stock');
        const exp = searchParams.get('exp');
        const effect = searchParams.get('effect');
        const itemType = searchParams.get('item-type') || '指定なし'; // デフォルトは「指定なし」
        // 武器
        const weaponTypes = searchParams.getAll('weapon-type');
        const weaponSkills = searchParams.getAll('weapon-skill');
        const weaponAcc = searchParams.get('weapon-acc');
        const weaponAtk = searchParams.get('weapon-atk');
        const weaponGuard = searchParams.get('weapon-guard');
        const weaponRng = searchParams.get('weapon-rng');
        // 防具
        const armorTypes = searchParams.getAll('armor-type');
        const armorDodge = searchParams.get('armor-dodge');
        const armorInitiative = searchParams.get('armor-initiative');
        const armorArmor = searchParams.get('armor-armor');
        // ヴィークル
        const vehicleTypes = searchParams.getAll('vehicle-type');
        const vehicleSkills = searchParams.getAll('vehicle-skill');
        const vehicleAtk = searchParams.get('vehicle-atk');
        const vehicleInitiative = searchParams.get('vehicle-initiative');
        const vehicleArmor = searchParams.get('vehicle-armor');
        const VehicleDash = searchParams.get('vehicle-dash');
        // コネ
        const connectionSkills = searchParams.getAll('connection-skill');
        // 一般アイテム
        const generalTypes = searchParams.getAll('general-type');

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
        if (categories.length > 0) {whereConditions.push({OR: categories.map(category => ({category: category}))});}
        if (name !== null) {whereConditions.push({name: {contains: name}});}
        if (procure !== null && stock === null && exp === null) {
            whereConditions.push({procure_int: {lte: parseInt(procure)}});
            whereConditions.push({exp_int: null});
        } else if (procure === null && stock !== null && exp === null) {
            whereConditions.push({stock_int: {lte: parseInt(stock)}});
            whereConditions.push({exp_int: null});
        } else if (procure !== null && stock !== null && exp === null) {
            whereConditions.push({procure_int: {lte: parseInt(procure)}});
            whereConditions.push({stock_int: {lte: parseInt(stock)}});
            whereConditions.push({exp_int: null});
        } else if (procure === null && stock === null && exp !== null) {
            whereConditions.push({exp_int: {lte: parseInt(exp)}});
        } else if (procure !== null && stock === null && exp !== null) {
            whereConditions.push({OR: [{procure_int: {lte: parseInt(procure)}}, {exp_int: {lte: parseInt(exp)}}]});
        } else if (procure === null && stock !== null && exp !== null) {
            whereConditions.push({OR: [{stock_int: {lte: parseInt(stock)}}, {exp_int: {lte: parseInt(exp)}}]});
        } else if (procure !== null && stock !== null && exp !== null) {
            whereConditions.push({OR: [{AND: [{procure_int: {lte: parseInt(procure)}}, {stock_int: {lte: parseInt(stock)}}]}, {exp_int: {lte: parseInt(exp)}}]});
        }
        if (effect !== null) {whereConditions.push({OR: [{effect: {contains: effect}}, {rec_effect: {contains: effect}}]});}
        if (itemType === 'weapon') {
            if (weaponTypes.length > 0) {whereConditions.push({OR: weaponTypes.map(type => ({type: {contains: type}}))});}
            if (weaponSkills.length > 0) {whereConditions.push({OR: weaponSkills.map(skill => ({skill: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))});}
            if (weaponAcc !== null) {whereConditions.push({OR: [{acc_int: null}, {acc_int: {gte: parseInt(weaponAcc)}}]});}
            if (weaponAtk !== null) {whereConditions.push({OR: [{atk_int: null}, {atk_int: {gte: parseInt(weaponAtk)}}]});}
            if (weaponGuard !== null) {whereConditions.push({OR: [{guard_int: null}, {guard_int: {gte: parseInt(weaponGuard)}}]});}
            if (weaponRng !== null) {whereConditions.push({OR: [{rng_int: null}, {rng_int: {gte: parseInt(weaponRng)}}]});}
        } else if (itemType === 'armor') {
            if (armorTypes.length > 0) {whereConditions.push({OR: armorTypes.map(type => (type === "防具" ? { type: { not: { contains: "補助" } } } : { type: { contains: "補助" } }))});}
            if (armorDodge !== null) {whereConditions.push({OR: [{dodge_int: null}, {dodge_int: {gte: parseInt(armorDodge)}}]});}
            if (armorInitiative !== null) {whereConditions.push({OR: [{initiative_int: null}, {initiative_int: {gte: parseInt(armorInitiative)}}]});}
            if (armorArmor !== null) {whereConditions.push({OR: [{armor_int: null}, {armor_int: {gte: parseInt(armorArmor)}}]});}
        } else if (itemType === 'vehicle') {
            if (vehicleTypes.length > 0) {whereConditions.push({OR: vehicleTypes.map(type => ({type: {contains: type}}))});}
            if (vehicleSkills.length > 0) {whereConditions.push({OR: vehicleSkills.map(skill => ({skill: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))});}
            if (vehicleAtk !== null) {whereConditions.push({OR: [{atk_int: null}, {atk_int: {gte: parseInt(vehicleAtk)}}]});}
            if (vehicleInitiative !== null) {whereConditions.push({OR: [{initiative_int: null}, {initiative_int: {gte: parseInt(vehicleInitiative)}}]});}
            if (vehicleArmor !== null) {whereConditions.push({OR: [{armor_int: null}, {armor_int: {gte: parseInt(vehicleArmor)}}]});}
            if (VehicleDash !== null) {whereConditions.push({OR: [{dash_int: null}, {dash_int: {gte: parseInt(VehicleDash)}}]});}
        } else if (itemType === 'connection') {
            if (connectionSkills.length > 0) {whereConditions.push({OR: connectionSkills.map(skill => ({skill: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))});}
        } else if (itemType === 'general') {
            if (generalTypes.length > 0) {whereConditions.push({OR: generalTypes.map(type => ({type: {contains: type}}))});}
        }

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
            const categoriesInfo = await Promise.all(ITEM_CATEGORIES.map(async (category) => {
                let count = 0;
                if (itemType === '指定なし' || itemType === '武器') {count += await prisma.weapon.count({where: {AND: [{category: category.name}, ...whereConditions]}});}
                if (itemType === '指定なし' || itemType === '防具') {count += await prisma.armor.count({where: {AND: [{category: category.name}, ...whereConditions]}});}
                if (itemType === '指定なし' || itemType === 'ヴィークル') {count += await prisma.vehicle.count({where: {AND: [{category: category.name}, ...whereConditions]}});}
                if (itemType === '指定なし' || itemType === 'コネ') {count += await prisma.connection.count({where: {AND: [{category: category.name}, ...whereConditions]}});}
                if (itemType === '指定なし' || itemType === '一般アイテム') {count += await prisma.general.count({where: {AND: [{category: category.name}, ...whereConditions]}});}
                return { id: category.id, name: category.name, count };
            })).then(categories => categories.filter(category => category.count > 0));
            const { totalPages, pageDefinitions } = calculatePageStructure(categoriesInfo, ITEMS_PER_PAGE);
            return NextResponse.json({ totalPages, pageDefinitions }, { status: 200 });

        } else if (action === 'getPage') {
            // ページ定義に基づいて、該当するカテゴリのレコードを取得
            const records: Item[] = [];
            if (itemType === '指定なし' || itemType === '武器') {
                let responses: WeaponResponse[] = [];
                let currentSkip = 0;
                let moreDataToFetch = true;
                while (moreDataToFetch) {
                    const batch: WeaponResponse[] = await prisma.weapon.findMany({
                        where: {
                            AND: whereConditions,
                        },
                        include: {
                            refed_power: true,
                            refed_armor: true,
                            refed_general: true,
                            favorited_by: true,
                        },
                        orderBy: [
                            { category_order: 'asc' as const },
                            { type_order: 'asc' as const },
                            { cost_order: 'asc' as const },
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
                responses.forEach(response => {records.push(parseWeapon(response))});
            }
            if (itemType === '指定なし' || itemType === '防具') {
                let responses: ArmorResponse[] = [];
                let currentSkip = 0;
                let moreDataToFetch = true;
                while (moreDataToFetch) {
                    const batch: ArmorResponse[] = await prisma.armor.findMany({
                        where: {
                            AND: whereConditions,
                        },
                        include: {
                            ref_weapon: true,
                            refed_power: true,
                            favorited_by: true,
                        },
                        orderBy: [
                            { category_order: 'asc' as const },
                            { type_order: 'asc' as const },
                            { cost_order: 'asc' as const },
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
                responses.forEach(response => {records.push(parseArmor(response))});
            }
            if (itemType === '指定なし' || itemType === 'ヴィークル') {
                let responses: VehicleResponse[] = [];
                let currentSkip = 0;
                let moreDataToFetch = true;
                while (moreDataToFetch) {
                    const batch: VehicleResponse[] = await prisma.vehicle.findMany({
                        where: {
                            AND: whereConditions,
                        },
                        include: {
                            favorited_by: true,
                        },
                        orderBy: [
                            { category_order: 'asc' as const },
                            { cost_order: 'asc' as const },
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
                responses.forEach(response => {records.push(parseVehicle(response))});
            }
            if (itemType === '指定なし' || itemType === 'コネ') {
                let responses: ConnectionResponse[] = [];
                let currentSkip = 0;
                let moreDataToFetch = true;
                while (moreDataToFetch) {
                    const batch: ConnectionResponse[] = await prisma.connection.findMany({
                        where: {
                            AND: whereConditions,
                        },
                        include: {
                            favorited_by: true,
                        },
                        orderBy: [
                            { category_order: 'asc' as const },
                            { cost_order: 'asc' as const },
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
                responses.forEach(response => {records.push(parseConnection(response))});
            }
            if (itemType === '指定なし' || itemType === '一般アイテム') {
                let responses: GeneralResponse[] = [];
                let currentSkip = 0;
                let moreDataToFetch = true;
                while (moreDataToFetch) {
                    const batch: GeneralResponse[] = await prisma.general.findMany({
                        where: {
                            AND: whereConditions,
                        },
                        include: {
                            ref_weapon: true,
                            favorited_by: true,
                        },
                        orderBy: [
                            { category_order: 'asc' as const },
                            { type_order: 'asc' as const },
                            { cost_order: 'asc' as const },
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
                responses.forEach(response => {records.push(parseGeneral(response))});
            }
            const dataForPage = categorizeRecords(ITEM_CATEGORIES, records);
            return NextResponse.json({ dataForPage }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error: unknown) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}