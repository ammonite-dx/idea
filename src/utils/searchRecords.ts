import { toArray, toString } from '@/utils/utils';
import { POWER_CATEGORIES } from '@/consts/power';
import { ITEM_CATEGORIES } from '@/consts/item';
import { TypeMap, Power, Item, Weapon, Armor, Vehicle, Connection, General, Dlois, Elois, Work, PowerResponse, WeaponResponse, ArmorResponse, VehicleResponse, ConnectionResponse, GeneralResponse, DloisResponse, EloisResponse, WorkResponse } from '@/types/types';
import { parsePower, parseWeapon, parseArmor, parseVehicle, parseConnection, parseGeneral, parseDlois, parseElois, parseWork } from './parseRecord';
 
export default async function searchRecords<K extends keyof TypeMap>(
  kind: K,
  searchParams:{ [key:string]:string|string[] | undefined } 
): Promise<{ [key: string]: TypeMap[K][] } | null> {
  switch (kind) {
    case "power": return await searchPowers(searchParams) as { [key: string]: TypeMap[K][] };
    case "weapon": return await searchWeapons(searchParams) as { [key: string]: TypeMap[K][] };
    case "item": return await searchItems(searchParams) as { [key: string]: TypeMap[K][] };
    case "dlois": return await searchDloises(searchParams) as { [key: string]: TypeMap[K][] };
    case "elois": return await searchEloises(searchParams) as { [key: string]: TypeMap[K][] };
    case "work": return await searchWorks(searchParams) as { [key: string]: TypeMap[K][] };
    default: return null;
  }
}

///////////////////////////////
// 検索ロジック
///////////////////////////////

// エフェクト
async function searchPowers(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<{ [key: string]: Power[] }> {
  const powers: {[key:string]: Power[]} = await fetch('/api/prisma', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "power",
      findOptions: {
        where: {
          AND: [
            powerWhereCondition(searchParams),
          ].flat()
        },
        include: {
          ref_weapon: true,
          ref_armor: true,
          refed_dlois: true,
          favorited_by: true,
        },
        orderBy: [
          {type_restrict_order: 'asc' as const},
          {ruby: 'asc' as const},
        ],
      },
    }),
    credentials: 'include',
  })
  .then((response) => response.json())
  .then((records:PowerResponse[]) => {
    console.log("searchPowers: fetched records", records);
    return records.map((record) => parsePower(record))
  })
  .then((powers:Power[]) => {
    console.log("searchPowers: parsed powers", powers);
    return CategorizeRecords(POWER_CATEGORIES, powers);
  });
  console.log("searchPowers: categorized powers", powers);
  return powers;
};

// アイテム
async function searchItems(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<{ [key: string]: Item[] }> {
  switch (toString(searchParams["item-type"], "指定なし")) {
    case "防具": return await searchArmors(searchParams) as { [key: string]: Item[] } ;
    case "ヴィークル": return await searchVehicles(searchParams) as { [key: string]: Item[] };
    case "コネ": return await searchConnections(searchParams) as { [key: string]: Item[] };
    case "一般アイテム": return await searchGenerals(searchParams) as { [key: string]: Item[] };
    default:
      const weapons = await searchWeapons(searchParams);
      const armors = await searchArmors(searchParams);
      const vehicles = await searchVehicles(searchParams);
      const connections = await searchConnections(searchParams);
      const generals = await searchGenerals(searchParams);
      const items = Object.fromEntries(toArray(searchParams["category"], ITEM_CATEGORIES).map(category => {
        const weaponsInCategory: Item[] = weapons[category] || [];
        const armorsInCategory: Item[] = armors[category] || [];
        const vehiclesInCategory: Item[] = vehicles[category] || [];
        const connectionsInCategory: Item[] = connections[category] || [];
        const generalsInCategory: Item[] = generals[category] || [];
        const itemsInCategory: Item[] = weaponsInCategory.concat(armorsInCategory).concat(vehiclesInCategory).concat(connectionsInCategory).concat(generalsInCategory);
        return [category, itemsInCategory]
      }));
      return items;
  }
}

// 武器
async function searchWeapons(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<{ [key: string]: Weapon[] }> {
  const weapons: {[key:string]: Weapon[]} = await fetch('/api/prisma', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "weapon",
      findOptions: {
        where: {
          AND: [
            itemWhereCondition(searchParams),
            weaponWhereCondition(searchParams),
          ].flat()
        },
        include: {
          refed_power: true,
          refed_armor: true,
          refed_general: true,
          favorited_by: true,
        },
        orderBy: [
          {type_order: "asc" as const},
          {cost_order: "asc" as const},
          {ruby: "asc" as const}
        ],
      },
    }),
    credentials: 'include',
  })
  .then((response) => response.json())
  .then((records:WeaponResponse[]) => records.map((record) => parseWeapon(record)))
  .then((weapons:Weapon[]) => CategorizeRecords(ITEM_CATEGORIES, weapons));
  return weapons;
}

// 防具
async function searchArmors(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<{ [key: string]: Armor[] }> {
  const armors: {[key:string]: Armor[]} = await fetch('/api/prisma', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "armor",
      findOptions: {
        where: {
          AND: [
            itemWhereCondition(searchParams),
            armorWhereCondition(searchParams),
          ].flat()
        },
        include: {
          ref_weapon: true,
          refed_power: true,
          favorited_by: true,
        },
        orderBy: [
          {type_order: "asc" as const},
          {cost_order: "asc" as const},
          {ruby: "asc" as const}
        ],
      },
    }),
    credentials: 'include',
  })
  .then((response) => response.json())
  .then((records:ArmorResponse[]) => records.map((record) => parseArmor(record)))
  .then((armors:Armor[]) => CategorizeRecords(ITEM_CATEGORIES, armors));
  return armors;
}

// ヴィークル
async function searchVehicles(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<{ [key: string]: Vehicle[] }> {
  const vehicles: {[key:string]: Vehicle[]} = await fetch('/api/prisma', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "vehicle",
      findOptions: {
        where: {
          AND: [
            itemWhereCondition(searchParams),
            vehicleWhereCondition(searchParams),
          ].flat()
        },
        include: {
          favorited_by: true,
        },
        orderBy: [
          {cost_order: "asc" as const},
          {ruby: "asc" as const}
        ],
      },
    }),
    credentials: 'include',
  })
  .then((response) => response.json())
  .then((records:VehicleResponse[]) => records.map((record) => parseVehicle(record)))
  .then((vehicles:Vehicle[]) => CategorizeRecords(ITEM_CATEGORIES, vehicles));
  return vehicles;
}

// コネ
async function searchConnections(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<{ [key: string]: Connection[] }> {
  const connections: {[key:string]: Connection[]} = await fetch('/api/prisma', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "connection",
      findOptions: {
        where: {
          AND: [
            itemWhereCondition(searchParams),
            connectionWhereCondition(searchParams),
          ].flat()
        },
        include: {
          favorited_by: true,
        },
        orderBy: [
          {cost_order: "asc" as const},
          {ruby: "asc" as const}
        ],
      },
    }),
    credentials: 'include',
  })
  .then((res) => res.json())
  .then((records:ConnectionResponse[]) => records.map((record) => parseConnection(record)))
  .then((connections:Connection[]) => CategorizeRecords(ITEM_CATEGORIES, connections));
  return connections;
}

// 一般アイテム
async function searchGenerals(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<{ [key: string]: General[] }> {
  const generals: {[key:string]: General[]} = await fetch('/api/prisma', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "general",
      findOptions: {
        where: {
          AND: [
            itemWhereCondition(searchParams),
            generalWhereCondition(searchParams),
          ].flat()
        },
        include: {
          ref_weapon: true,
          favorited_by: true,
        },
        orderBy: [
          {type_order: "asc" as const},
          {cost_order: "asc" as const},
          {ruby: "asc" as const}
        ],
      },
    }),
    credentials: 'include',
  })
  .then((res) => res.json())
  .then((records:GeneralResponse[]) => records.map((record) => parseGeneral(record)))
  .then((generals:General[]) => CategorizeRecords(ITEM_CATEGORIES, generals));
  return generals;
}

// Dロイス
async function searchDloises(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<{ [key: string]: Dlois[] }> {
  const dloises: {[key: string]: Dlois[]} = await fetch('/api/prisma', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "dlois",
      findOptions: {
        where: {
          AND: dloisWhereCondition(searchParams),
        },
        include: {
          ref_power: true,
          favorited_by: true,
        },
        orderBy: [
          {type_order: "asc" as const},
          {restrict_order: "asc" as const},
          {no: "asc" as const}
        ],
      },
    }),
    credentials: 'include',
  })
  .then((res) => res.json())
  .then((records:DloisResponse[]) => records.map((record) => parseDlois(record)))
  .then((dloises:Dlois[]) => ({"Dロイス": dloises}));
  return dloises;
}

// Eロイス
async function searchEloises(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<{ [key: string]: Elois[] }> {
  const eloises: {[key: string]: Elois[]} = await fetch('/api/prisma', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "elois",
      findOptions: {
        where: {
          AND: eloisWhereCondition(searchParams),
        },
        include: {
          favorited_by: true,
        },
        orderBy: [
          {urge_order: "asc" as const},
          {type_order: "asc" as const},
        ],
      },
    }),
    credentials: 'include',
  })
  .then((res) => res.json())
  .then((records:EloisResponse[]) => records.map((record) => parseElois(record)))
  .then((eloises:Elois[]) => ({"Eロイス": eloises}));
  return eloises;
}

// ワークス
async function searchWorks(
  searchParams: { [key: string]: string | string[] | undefined }
): Promise<{ [key: string]: Work[] }> {
  const works: {[key: string]: Work[]} = await fetch('/api/prisma', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "work",
      findOptions: {
        where: {
          AND: workWhereCondition(searchParams),
        },
      },
    }),
    credentials: 'include',
  })
  .then((res) => res.json())
  .then((records:WorkResponse[]) => records.map((record) => parseWork(record)))
  .then((works:Work[]) => ({"ワークス": works}));
  return works;
}

////////////////////////////////
// 検索条件
////////////////////////////////

// エフェクト
function powerWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  const conditions = [];
  if (searchParams["type"] !== undefined) {conditions.push({OR: toArray(searchParams["type"], []).map(type => ({type: type}))});}
  if (searchParams["supplement"] !== undefined) {
    conditions.push({OR: toArray(searchParams["supplement"], []).map(supplement => ({supplement: supplement}))});
    conditions.push({NOT: toArray(searchParams["supplement"], []).map(supplement => ({update_supplement: {contains: supplement}}))});
  } else {
    conditions.push({update_supplement: null});
  }
  if (searchParams["name"] !== undefined) {conditions.push({name: {contains: toString(searchParams["name"], "")}});}
  if (searchParams["maxlv"] !== undefined) {conditions.push({OR: [{maxlv_int: null}, {maxlv_int: {gte: parseInt(toString(searchParams["maxlv"], "0"))}}]});}
  if (searchParams["timing"] !== undefined) {conditions.push({OR: toArray(searchParams["timing"], []).map(timing => ({timing: {contains: timing}}))});}
  if (searchParams["skill"] !== undefined) {conditions.push({OR: toArray(searchParams["skill"], []).map(skill => ({skill: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))});}
  if (searchParams["dfclty"] !== undefined) {conditions.push({OR: toArray(searchParams["dfclty"], []).map(dfclty => ({dfclty: dfclty}))});}
  if (searchParams["target"] !== undefined) {conditions.push({OR: toArray(searchParams["target"], []).map(target => ({target: target}))});}
  if (searchParams["rng"] !== undefined) {conditions.push({OR: toArray(searchParams["rng"], []).map(rng => ({rng: rng}))});}
  if (searchParams["encroach"] !== undefined) {conditions.push({OR: toArray(searchParams["encroach"], []).map(encroach => ({encroach: encroach}))});}
  if (searchParams["restrict"] !== undefined) {conditions.push({OR: toArray(searchParams["restrict"], []).map(restrict => ({restrict: {contains: restrict}}))});}
  if (searchParams["effect"] !== undefined) {conditions.push({effect: {contains: toString(searchParams["effect"], "")}});}
  return conditions;
}

// アイテム
function itemWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  const conditions = [];
  if (searchParams["name"] !== undefined) {conditions.push({name: {contains: toString(searchParams["name"], "")}});}
  if (searchParams["supplement"] !== undefined) {
    conditions.push({OR: toArray(searchParams["supplement"], []).map(supplement => ({supplement: supplement}))});
    conditions.push({NOT: toArray(searchParams["supplement"], []).map(supplement => ({update_supplement: {contains: supplement}}))});
  } else {
    conditions.push({update_supplement: null});
  }
  if (searchParams["procure"] !== undefined && searchParams["stock"] === undefined && searchParams["exp"] === undefined) {
    conditions.push({procure_int: {lte: parseInt(toString(searchParams["procure"], "0"))}});
    conditions.push({exp_int: null});
  } else if (searchParams["procure"] === undefined && searchParams["stock"] !== undefined && searchParams["exp"] === undefined) {
    conditions.push({stock_int: {lte: parseInt(toString(searchParams["stock"], "0"))}});
    conditions.push({exp_int: null});
  } else if (searchParams["procure"] !== undefined && searchParams["stock"] !== undefined && searchParams["exp"] === undefined) {
    conditions.push({procure_int: {lte: parseInt(toString(searchParams["procure"], "0"))}});
    conditions.push({stock_int: {lte: parseInt(toString(searchParams["stock"], "0"))}});
    conditions.push({exp_int: null});
  } else if (searchParams["procure"] === undefined && searchParams["stock"] === undefined && searchParams["exp"] !== undefined) {
    conditions.push({exp_int: {lte: parseInt(toString(searchParams["exp"], "0"))}});
  } else if (searchParams["procure"] !== undefined && searchParams["stock"] === undefined && searchParams["exp"] !== undefined) {
    conditions.push({OR: [{procure_int: {lte: parseInt(toString(searchParams["procure"], "0"))}}, {exp_int: {lte: parseInt(toString(searchParams["exp"], "0"))}}]});
  } else if (searchParams["procure"] === undefined && searchParams["stock"] !== undefined && searchParams["exp"] !== undefined) {
    conditions.push({OR: [{stock_int: {lte: parseInt(toString(searchParams["stock"], "0"))}}, {exp_int: {lte: parseInt(toString(searchParams["exp"], "0"))}}]});
  } else if (searchParams["procure"] !== undefined && searchParams["stock"] !== undefined && searchParams["exp"] !== undefined) {
    conditions.push({OR: [{AND: [{procure_int: {lte: parseInt(toString(searchParams["procure"], "0"))}}, {stock_int: {lte: parseInt(toString(searchParams["stock"], "0"))}}]}, {exp_int: {lte: parseInt(toString(searchParams["exp"], "0"))}}]});
  }
  if (searchParams["effect"] !== undefined) {conditions.push({effect: {contains: toString(searchParams["effect"], "")}});}
  return conditions;
}

// 武器
function weaponWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  const conditions = [];
  if (searchParams["weapon-type"] !== undefined) {conditions.push({OR: toArray(searchParams["weapon-type"], []).map(type => ({type: {contains: type}}))});}
  if (searchParams["weapon-skill"] !== undefined) {conditions.push({OR: toArray(searchParams["weapon-skill"], []).map(skill => ({skill: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))});}
  if (searchParams["weapon-acc"] !== undefined) {conditions.push({OR: [{acc_int: null}, {acc_int: {gte: parseInt(toString(searchParams["weapon-acc"], "-999"))}}]});}
  if (searchParams["weapon-atk"] !== undefined) {conditions.push({OR: [{atk_int: null}, {atk_int: {gte: parseInt(toString(searchParams["weapon-atk"], "-999"))}}]});}
  if (searchParams["weapon-guard"] !== undefined) {conditions.push({OR: [{guard_int: null}, {guard_int: {gte: parseInt(toString(searchParams["weapon-guard"], "0"))}}]});}
  if (searchParams["weapon-rng"] !== undefined) {conditions.push({OR: [{rng_int: null}, {rng_int: {gte: parseInt(toString(searchParams["weapon-rng"], "0"))}}]});}
  if (toString(searchParams["item-type"], "指定なし") === "指定なし") {conditions.push({refed_armor: null});}
  if (toString(searchParams["item-type"], "指定なし") === "指定なし") {conditions.push({refed_general: null});}
  return conditions;
}

// 防具
function armorWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  const conditions = [];
  if (searchParams["armor-type"] !== undefined) {conditions.push({OR: toArray(searchParams["armor-type"], []).map(type => (type==="防具" ? { type: { not: { contains: "補助" } } } : { type: { contains: "補助" } }))});}
  if (searchParams["armor-dodge"] !== undefined) {conditions.push({OR: [{dodge_int: null}, {dodge_int: {gte: parseInt(toString(searchParams["armor-dodge"], "-999"))}}]});}
  if (searchParams["armor-initiative"] !== undefined) {conditions.push({OR: [{initiative_int: null}, {initiative_int: {gte: parseInt(toString(searchParams["armor-initiative"], "-999"))}}]});}
  if (searchParams["armor-armor"] !== undefined) {conditions.push({OR: [{armor_int: null}, {armor_int: {gte: parseInt(toString(searchParams["armor-armor"], "0"))}}]});}
  return conditions;
}

// ヴィークル
function vehicleWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  const conditions = [];
  if (searchParams["vehicle-type"] !== undefined) {conditions.push({OR: toArray(searchParams["vehicle-type"], []).map(type => ({type: {contains: type}}))});}
  if (searchParams["vehicle-skill"] !== undefined) {conditions.push({OR: toArray(searchParams["vehicle-skill"], []).map(skill => ({skill: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))});}
  if (searchParams["vehicle-atk"] !== undefined) {conditions.push({OR: [{atk_int: null}, {atk_int: {gte: parseInt(toString(searchParams["vehicle-atk"], "-999"))}}]});}
  if (searchParams["vehicle-initiative"] !== undefined) {conditions.push({OR: [{initiative_int: null}, {initiative_int: {gte: parseInt(toString(searchParams["vehicle-initiative"], "-999"))}}]});}
  if (searchParams["vehicle-armor"] !== undefined) {conditions.push({OR: [{armor_int: null}, {armor_int: {gte: parseInt(toString(searchParams["vehicle-armor"], "0"))}}]});}
  if (searchParams["vehicle-dash"] !== undefined) {conditions.push({OR: [{dash_int: null}, {dash_int: {gte: parseInt(toString(searchParams["vehicle-dash"], "0"))}}]});}
  return conditions;
}

// コネ
function connectionWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  const conditions = [];
  if (searchParams["connection-skill"] !== undefined) {conditions.push({OR: toArray(searchParams["connection-skill"], []).map(skill => ({skill: {contains: skill}}))});}
  return conditions;
}

// 一般アイテム
function generalWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  const conditions = [];
  if (searchParams["general-type"] !== undefined) {conditions.push({OR: toArray(searchParams["general-type"], []).map(type => ({type: {contains: type}}))});}
  return conditions;
}

// Dロイス
function dloisWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  const conditions = [];
  if (searchParams["name"] !== undefined) {conditions.push({name: {contains: toString(searchParams["name"], "")}});}
  if (searchParams["supplement"] !== undefined) {
    conditions.push({OR: toArray(searchParams["supplement"], []).map(supplement => ({supplement: supplement}))});
    conditions.push({NOT: toArray(searchParams["supplement"], []).map(supplement => ({update_supplement: {contains: supplement}}))});
  } else {
    conditions.push({update_supplement: null});
  }
  if (searchParams["type"] !== undefined) {conditions.push({OR: toArray(searchParams["type"], []).map(type => ({type: type}))});}
  if (searchParams["restrict"] !== undefined) {conditions.push({OR: toArray(searchParams["restrict"], []).map(restrict => ({restrict: {contains: restrict}}))});}
  if (searchParams["effect"] !== undefined) {conditions.push({effect: {contains: toString(searchParams["effect"], "")}});}
  return conditions;
}

// Eロイス
function eloisWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  const conditions = [];
  if (searchParams["name"] !== undefined) {conditions.push({name: {contains: toString(searchParams["name"], "")}});}
  if (searchParams["supplement"] !== undefined) {
    conditions.push({OR: toArray(searchParams["supplement"], []).map(supplement => ({supplement: supplement}))});
    conditions.push({NOT: toArray(searchParams["supplement"], []).map(supplement => ({update_supplement: {contains: supplement}}))});
  } else {
    conditions.push({update_supplement: null});
  }
  if (searchParams["type"] !== undefined) {conditions.push({OR: toArray(searchParams["type"], []).map(type => ({type: type}))});}
  if (searchParams["timing"] !== undefined) {conditions.push({OR: toArray(searchParams["timing"], []).map(timing => ({timing: {contains: timing}}))});}
  if (searchParams["skill"] !== undefined) {conditions.push({OR: toArray(searchParams["skill"], []).map(skill => ({skill: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))});}
  if (searchParams["dfclty"] !== undefined) {conditions.push({OR: toArray(searchParams["dfclty"], []).map(dfclty => ({dfclty: {contains: dfclty}}))});}
  if (searchParams["target"] !== undefined) {conditions.push({OR: toArray(searchParams["target"], []).map(target => ({target: {contains: target}}))});}
  if (searchParams["rng"] !== undefined) {conditions.push({OR: toArray(searchParams["rng"], []).map(rng => ({rng: {contains: rng}}))});}
  if (searchParams["urge"] !== undefined) {conditions.push({OR: toArray(searchParams["urge"], []).map(urge => ({urge: {contains: urge}}))});}
  if (searchParams["effect"] !== undefined) {conditions.push({effect: {contains: toString(searchParams["effect"], "")}});}
  return conditions;
}

// ワークス
function workWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  const conditions = [];
  if (searchParams["name"] !== undefined) {conditions.push({name: {contains: toString(searchParams["name"], "")}});}
  if (searchParams["supplement"] !== undefined) {conditions.push({OR: toArray(searchParams["supplement"], []).map(supplement => ({supplement: supplement}))});}
  if (searchParams["stat"] !== undefined) {conditions.push({OR: toArray(searchParams["stat"], []).map(stat => ({stat: {contains: stat}}))});}
  if (searchParams["skill"] !== undefined) {conditions.push({OR: toArray(searchParams["skill"], []).map(skill => ({skills: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))});}
  return conditions;
}

////////////////////////////////
// ユーティリティ関数
////////////////////////////////

// レコードをカテゴリごとに分類する関数
interface RecordWithCategory {
  category: string;
}
export function CategorizeRecords<T extends RecordWithCategory>(
  categories: string[],
  records: T[]
): { [key: string]: T[] } {
  const categorizedRecords: { [key: string]: T[] } = {};
  for (const category of categories) {
    categorizedRecords[category] = []; // 初期化
  }
  for (const record of records) {
    if (categorizedRecords.hasOwnProperty(record.category)) { // record.category が categorizedRecords のキーとして存在するか（つまり事前定義されたカテゴリか）確認
      categorizedRecords[record.category].push(record); // T 型の record を T[] 型の配列に push
    }
  }
  return categorizedRecords;
}