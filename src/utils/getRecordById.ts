import getPrismaClient from '@/lib/prisma';
import { Power,Weapon,Armor,Vehicle,Connection,General,Dlois,Elois,Faq,Info,Work,TypeMap } from '@/types/types';

export default async function getRecordById<K extends keyof TypeMap>(
    kind: K,
    id: string
): Promise<TypeMap[K] | null> {
    switch (kind) {
        case "power": return await getPowerById(id) as TypeMap[K];
        case "weapon": return await getWeaponById(id) as TypeMap[K];
        case "armor": return await getArmorById(id) as TypeMap[K];
        case "vehicle": return await getVehicleById(id) as TypeMap[K];
        case "connection": return await getConnectionById(id) as TypeMap[K];
        case "general": return await getGeneralById(id) as TypeMap[K];
        case "dlois": return await getDloisById(id) as TypeMap[K];
        case "elois": return await getEloisById(id) as TypeMap[K];
        case "faq": return await getFaqById(id) as TypeMap[K];
        case "info": return await getInfoById(id) as TypeMap[K];
        case "work": return await getWorkById(id) as TypeMap[K];
        default: return null;
    }
}

// エフェクトの取得
async function getPowerById(id:string) {
    const prisma  = await getPrismaClient();
    const searchResult = await prisma.power.findUnique({where: {id: id}});
    if (!searchResult) return null;
    const { ref_weapon_id, ref_armor_id, ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_weapon: Weapon|null = ref_weapon_id ? await getWeaponById(ref_weapon_id) : null;
    const ref_armor: Armor|null = ref_armor_id ? await getArmorById(ref_armor_id) : null;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getFaqById(id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getInfoById(id)))).filter((info:Info|null) => info !== null) : null;
    const power: Power = {
        kind: "power",
        ...base,
        ref_weapon: ref_weapon,
        ref_armor: ref_armor,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return power;
}

// 武器の取得
async function getWeaponById(id: string) {
    const prisma  = await getPrismaClient();
    const searchResult = await prisma.weapon.findUnique({where: {id: id}});
    if (!searchResult) return null;
    const { ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getFaqById(id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getInfoById(id)))).filter((info:Info|null) => info !== null) : null;
    const weapon: Weapon = {
        kind: "weapon",
        ...base,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return weapon;
}

// 防具の取得
async function getArmorById(id: string) {
    const prisma  = await getPrismaClient();
    const searchResult = await prisma.armor.findUnique({where: {id: id}});
    if (!searchResult) return null;
    const { ref_weapon_id, ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_weapon: Weapon|null = ref_weapon_id ? await getWeaponById(ref_weapon_id) : null;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getFaqById(id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getInfoById(id)))).filter((info:Info|null) => info !== null) : null;
    const armor: Armor = {
        kind: "armor",
        ...base,
        ref_weapon: ref_weapon,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return armor;
}

// ヴィークルの取得
async function getVehicleById(id: string) {
    const prisma  = await getPrismaClient();
    const searchResult = await prisma.vehicle.findUnique({where: {id: id}});
    if (!searchResult) return null;
    const { ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getFaqById(id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getInfoById(id)))).filter((info:Info|null) => info !== null) : null;
    const vehicle: Vehicle = {
        kind: "vehicle",
        ...base,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return vehicle;
}

// コネの取得
async function getConnectionById(id: string) {
    const prisma  = await getPrismaClient();
    const searchResult = await prisma.connection.findUnique({where: {id: id}});
    if (!searchResult) return null;
    const { ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getFaqById(id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getInfoById(id)))).filter((info:Info|null) => info !== null) : null;
    const connection: Connection = {
        kind: "connection",
        ...base,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return connection;
}

// 一般アイテムの取得
async function getGeneralById(id: string) {
    const prisma  = await getPrismaClient();
    const searchResult = await prisma.general.findUnique({where: {id: id}});
    if (!searchResult) return null;
    const { ref_weapon_id, ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_weapon: Weapon|null = ref_weapon_id ? await getWeaponById(ref_weapon_id) : null;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getFaqById(id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getInfoById(id)))).filter((info:Info|null) => info !== null) : null;
    const general: General = {
        kind: "general",
        ...base,
        ref_weapon: ref_weapon,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return general;
}

// Dロイスの取得
async function getDloisById(id: string) {
    const prisma  = await getPrismaClient();
    const searchResult = await prisma.dlois.findUnique({where: {id: id}});
    if (!searchResult) return null;
    const { ref_power_id, ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_power: Power|null = ref_power_id ? await getPowerById(ref_power_id) : null;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getFaqById(id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getInfoById(id)))).filter((info:Info|null) => info !== null) : null;
    const dlois: Dlois = {
        kind: "dlois",
        ...base,
        ref_power: ref_power,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return dlois;
}

// Eロイスの取得
async function getEloisById(id: string) {
    const prisma  = await getPrismaClient();
    const searchResult = await prisma.elois.findUnique({where: {id: id}});
    if (!searchResult) return null;
    const { ref_faq_id, ref_info_id, ...base } = searchResult;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getFaqById(id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getInfoById(id)))).filter((info:Info|null) => info !== null) : null;
    const elois: Elois = {
        kind: "elois",
        ...base,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return elois;
}

// FAQの取得
async function getFaqById(id: string) {
    const prisma  = await getPrismaClient();
    const searchResult = await prisma.faq.findUnique({where: {id: id}});
    if (!searchResult) return null;
    const faq: Faq = {
        kind: "faq",
        id: searchResult.id,
        q: searchResult.q,
        a: searchResult.a,
    };
    return faq;
}

// 補足情報の取得
async function getInfoById(id: string) {
    const prisma  = await getPrismaClient();
    const searchResult = await prisma.info.findUnique({where: {id: id}});
    if (!searchResult) return null;
    const info: Info = {
        kind: "info",
        id: searchResult.id,
        title: searchResult.title,
        content: searchResult.content,
    };
    return info;
}

// ワークスの取得
async function getWorkById(id: string) {
    const prisma  = await getPrismaClient();
    const searchResult = await prisma.works.findUnique({where: {id: id}});
    if (!searchResult) return null;
    const work: Work = {
        kind: "work",
        id: searchResult.id,
        supplement: searchResult.supplement,
        name: searchResult.name,
        stat: searchResult.stat,
        skills: searchResult.skills.split(" "),
        emblems: searchResult.emblems ? searchResult.emblems.split(" ") : null,
    };
    return work;
}
