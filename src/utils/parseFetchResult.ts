import getRecordById from './getRecordById';
import { Power,Weapon,Armor,Vehicle,Connection,General,Dlois,Elois,Faq,Info,Work,PowerFetchResult,WeaponFetchResult,ArmorFetchResult,VehicleFetchResult,ConnectionFetchResult,GeneralFetchResult,DloisFetchResult,EloisFetchResult,WorkFetchResult,FaqFetchResult,InfoFetchResult,TypeMap } from '@/types/types';

export default async function parseFetchResult<K extends keyof TypeMap>(
    kind: K,
    searchResult: unknown
): Promise<TypeMap[K] | null> {
    switch (kind) {
        case "power": return parsePower(searchResult) as Promise<TypeMap[K]>;
        case "weapon": return parseWeapon(searchResult) as Promise<TypeMap[K]>;
        case "armor": return parseArmor(searchResult) as Promise<TypeMap[K]>;
        case "vehicle": return parseVehicle(searchResult) as Promise<TypeMap[K]>;
        case "connection": return parseConnection(searchResult) as Promise<TypeMap[K]>;
        case "general": return parseGeneral(searchResult) as Promise<TypeMap[K]>;
        case "dlois": return parseDlois(searchResult) as Promise<TypeMap[K]>;
        case "elois": return parseElois(searchResult) as Promise<TypeMap[K]>;
        case "work": return parseWork(searchResult) as Promise<TypeMap[K]>;
        case "faq": return parseFaq(searchResult) as Promise<TypeMap[K]>;
        case "info": return parseInfo(searchResult) as Promise<TypeMap[K]>;
        default: throw new Error(`Unknown kind: ${kind}`);
    }
}

async function parsePower(searchResult: unknown): Promise<Power> {
    const { ref_weapon_id, ref_armor_id, ref_faq_id, ref_info_id, ...base } = searchResult as PowerFetchResult;
    const ref_weapon: Weapon|null = ref_weapon_id ? await getRecordById("weapon", ref_weapon_id) : null;
    const ref_armor: Armor|null = ref_armor_id ? await getRecordById("armor", ref_armor_id) : null;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getRecordById("faq", id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getRecordById("info", id)))).filter((info:Info|null) => info !== null) : null;
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

async function parseWeapon(searchResult: unknown): Promise<Weapon> {
    const { ref_faq_id, ref_info_id, ...base } = searchResult as WeaponFetchResult;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getRecordById("faq", id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getRecordById("info", id)))).filter((info:Info|null) => info !== null) : null;
    const weapon: Weapon = {
        kind: "weapon",
        ...base,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return weapon;
}

async function parseArmor(searchResult: unknown): Promise<Armor> {
    const { ref_weapon_id, ref_faq_id, ref_info_id, ...base } = searchResult as ArmorFetchResult;
    const ref_weapon: Weapon|null = ref_weapon_id ? await getRecordById("weapon", ref_weapon_id) : null;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getRecordById("faq", id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getRecordById("info", id)))).filter((info:Info|null) => info !== null) : null;
    const armor: Armor = {
        kind: "armor",
        ...base,
        ref_weapon: ref_weapon,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return armor;
}

async function parseVehicle(searchResult: unknown): Promise<Vehicle> {
    const { ref_faq_id, ref_info_id, ...base } = searchResult as VehicleFetchResult;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getRecordById("faq", id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getRecordById("info", id)))).filter((info:Info|null) => info !== null) : null;
    const vehicle: Vehicle = {
        kind: "vehicle",
        ...base,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return vehicle;
}

async function parseConnection(searchResult: unknown): Promise<Connection> {
    const { ref_faq_id, ref_info_id, ...base } = searchResult as ConnectionFetchResult;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getRecordById("faq", id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getRecordById("info", id)))).filter((info:Info|null) => info !== null) : null;
    const connection: Connection = {
        kind: "connection",
        ...base,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return connection;
}

async function parseGeneral(searchResult: unknown): Promise<General> {
    const { ref_weapon_id, ref_faq_id, ref_info_id, ...base } = searchResult as GeneralFetchResult;
    const ref_weapon: Weapon|null = ref_weapon_id ? await getRecordById("weapon", ref_weapon_id) : null;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getRecordById("faq", id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getRecordById("info", id)))).filter((info:Info|null) => info !== null) : null;
    const general: General = {
        kind: "general",
        ...base,
        ref_weapon: ref_weapon,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return general;
}

async function parseDlois(searchResult: unknown): Promise<Dlois> {
    const { ref_power_id, ref_faq_id, ref_info_id, ...base } = searchResult as DloisFetchResult;
    const ref_power: Power|null = ref_power_id ? await getRecordById("power", ref_power_id) : null;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getRecordById("faq", id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getRecordById("info", id)))).filter((info:Info|null) => info !== null) : null;
    const dlois: Dlois = {
        kind: "dlois",
        ...base,
        ref_power: ref_power,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return dlois;
}

async function parseElois(searchResult: unknown): Promise<Elois> {
    const { ref_faq_id, ref_info_id, ...base } = searchResult as EloisFetchResult;
    const ref_faqs: Faq[]|null = ref_faq_id ? (await Promise.all(ref_faq_id.split(" ").map(async (id:string) => getRecordById("faq", id)))).filter((faq:Faq|null) => faq !== null) : null;
    const ref_infos: Info[]|null = ref_info_id ? (await Promise.all(ref_info_id.split(" ").map(async (id:string) => getRecordById("info", id)))).filter((info:Info|null) => info !== null) : null;
    const elois: Elois = {
        kind: "elois",
        ...base,
        ref_faqs: ref_faqs,
        ref_infos: ref_infos,
    };
    return elois;
}

async function parseWork(searchResult: unknown): Promise<Work> {
    const { ...base } = searchResult as WorkFetchResult;
    const work: Work = {
        kind: "work",
        ...base,
    };
    return work;
}

async function parseFaq(searchResult: unknown): Promise<Faq> {
    const { ...base } = searchResult as FaqFetchResult;
    const faq: Faq = {
        kind: "faq",
        ...base,
    };
    return faq;
}

async function parseInfo(searchResult: unknown): Promise<Info> {
    const { ...base } = searchResult as InfoFetchResult;
    const info: Info = {
        kind: "info",
        ...base,
    };
    return info;
}