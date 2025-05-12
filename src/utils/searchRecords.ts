import parseFetchResult from './parseFetchResult';
import { toArray, toString } from '@/utils/utils';
import { POWER_CATEGORIES, POWER_TYPES, POWER_SUPPLEMENTS, POWER_TIMINGS, POWER_SKILLS, POWER_DFCLTIES, POWER_TARGETS, POWER_RNGS, POWER_ENCROACHES, POWER_RESTRICTS } from '@/consts/power';
import { ITEM_CATEGORIES, ITEM_SUPPLEMENTS } from '@/consts/item';
import { WEAPON_TYPES, WEAPON_SKILLS } from '@/consts/weapon';
import { ARMOR_TYPES } from '@/consts/armor';
import { VEHICLE_SKILLS } from '@/consts/vehicle';
import { CONNECTION_SKILLS } from '@/consts/connection';
import { GENERAL_TYPES } from '@/consts/general';
import { DLOIS_TYPES, DLOIS_RESTRICTS, DLOIS_SUPPLEMENTS } from '@/consts/dlois';
import { ELOIS_TYPES, ELOIS_SUPPLEMENTS, ELOIS_TIMINGS, ELOIS_SKILLS, ELOIS_DFCLTIES, ELOIS_TARGETS, ELOIS_RNGS, ELOIS_URGES } from '@/consts/elois';
import { WORK_SUPPLEMENTS, WORK_STATS, WORK_SKILLS } from '@/consts/work';
import { TypeMap, Power, Item, Weapon, Armor, Vehicle, Connection, General, Dlois, Elois, Work, PowerFetchResult, WeaponFetchResult, ArmorFetchResult, VehicleFetchResult, ConnectionFetchResult, GeneralFetchResult, DloisFetchResult, EloisFetchResult, WorkFetchResult } from '@/types/types';

export default async function searchRecords<K extends keyof TypeMap>(
  kind: K,
  searchParams:{ [key:string]:string|string[] | undefined } 
): Promise<{ [key: string]: TypeMap[K][] } | null> {
  switch (kind) {
    case "power": return await searchPowers(searchParams) as { [key: string]: TypeMap[K][] };
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
async function searchPowers(searchParams: { [key: string]: string | string[] | undefined }) {
  const powers: {[key: string]: Power[]} = Object.fromEntries(await Promise.all(toArray(searchParams["category"], POWER_CATEGORIES).map(async category => {
    const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = `${baseUrl}/api/prisma`;
    const fetchResultsInCategory = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "power",
            findOptions: {
              where: {
                AND: [
                  {category: category},
                  powerWhereCondition(searchParams),
                ].flat()
              },
              orderBy: [
                {type_restrict_order: 'asc' as const},
                {ruby: 'asc' as const},
              ],
            },
        }),
    }).then((res) => res.json());
    const powersInCategory = (await Promise.all(fetchResultsInCategory.map(async (fetchResult: PowerFetchResult) => parseFetchResult("power", fetchResult)))).filter((record) => record !== null) as Power[];
    return [category, powersInCategory];
  })));
  return powers;
}

// アイテム
async function searchItems(searchParams: { [key: string]: string | string[] | undefined }) {
  switch (toString(searchParams["item-type"], "指定なし")) {
    case "武器": return searchWeapons(searchParams) as Promise<{ [key: string]: Item[] }>;
    case "防具": return searchArmors(searchParams) as Promise<{ [key: string]: Item[] }> ;
    case "ヴィークル": return searchVehicles(searchParams) as Promise<{ [key: string]: Item[] }>;
    case "コネ": return searchConnections(searchParams) as Promise<{ [key: string]: Item[] }>;
    case "一般アイテム": return searchGenerals(searchParams) as Promise<{ [key: string]: Item[] }>;
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
async function searchWeapons(searchParams: { [key: string]: string | string[] | undefined }) {
  const weapons: { [key: string]: Weapon[] } = Object.fromEntries(await Promise.all(toArray(searchParams["category"], ITEM_CATEGORIES).map(async category => {
    const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = `${baseUrl}/api/prisma`;
    const fetchResultsInCategory = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "weapon",
        findOptions: {
          where: {
            AND: [
              {category: category},
              itemWhereCondition(searchParams),
              weaponWhereCondition(searchParams),
            ].flat()
          },
          orderBy: [
            {type_order: "asc" as const},
            {cost_order: "asc" as const},
            {ruby: "asc" as const}
          ],
        },
      }),
    }).then((res) => res.json());
    const weaponsInCategory = (await Promise.all(fetchResultsInCategory.map(async (fetchResult: WeaponFetchResult) => parseFetchResult("weapon", fetchResult)))).filter((record) => record !== null) as Weapon[];
    return [category, weaponsInCategory]
  })));
  return weapons;
}

// 防具
async function searchArmors(searchParams: { [key: string]: string | string[] | undefined }) {
  const armors: { [key: string]: Armor[] } = Object.fromEntries(await Promise.all(toArray(searchParams["category"], ITEM_CATEGORIES).map(async category => {
    const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = `${baseUrl}/api/prisma`;
    const fetchResultsInCategory = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "armor",
        findOptions: {
          where: {
            AND: [
              {category: category},
              itemWhereCondition(searchParams),
              armorWhereCondition(searchParams),
            ].flat()
          },
          orderBy: [
            {type_order: "asc" as const},
            {cost_order: "asc" as const},
            {ruby: "asc" as const}
          ],
        },
      }),
    }).then((res) => res.json());
    const armorsInCategory = (await Promise.all(fetchResultsInCategory.map(async (fetchResult: ArmorFetchResult) => parseFetchResult("armor", fetchResult)))).filter((record) => record !== null) as Armor[];
    return [category, armorsInCategory]
  })));
  return armors;
}

// ヴィークル
async function searchVehicles(searchParams: { [key: string]: string | string[] | undefined }) {
  const vehicles: { [key: string]: Vehicle[] } = Object.fromEntries(await Promise.all(toArray(searchParams["category"], ITEM_CATEGORIES).map(async category => {
    const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = `${baseUrl}/api/prisma`;    
    const fetchResultsInCategory = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "vehicle",
        findOptions: {
          where: {
            AND: [
              {category: category},
              itemWhereCondition(searchParams),
              vehicleWhereCondition(searchParams),
            ].flat()
          },
          orderBy: [
            {cost_order: "asc" as const},
            {ruby: "asc" as const}
          ],
        },
      }),
    }).then((res) => res.json());
    const vehiclesInCategory = (await Promise.all(fetchResultsInCategory.map(async (fetchResult: VehicleFetchResult) => parseFetchResult("vehicle", fetchResult)))).filter((record) => record !== null) as Vehicle[];
    return [category, vehiclesInCategory]
  })));
  return vehicles;
}

// コネ
async function searchConnections(searchParams: { [key: string]: string | string[] | undefined }) {
  const connections: { [key: string]: Connection[] } = Object.fromEntries(await Promise.all(toArray(searchParams["category"], ITEM_CATEGORIES).map(async category => {
    const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = `${baseUrl}/api/prisma`;    
    const fetchResultsInCategory = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "connection",
        findOptions: {
          where: {
            AND: [
              {category: category},
              itemWhereCondition(searchParams),
              connectionWhereCondition(searchParams),
            ].flat()
          },
          orderBy: [
            {cost_order: "asc" as const},
            {ruby: "asc" as const}
          ],
        },
      }),
    }).then((res) => res.json());
    const connectionsInCategory = (await Promise.all(fetchResultsInCategory.map(async (fetchResult: ConnectionFetchResult) => parseFetchResult("connection", fetchResult)))).filter((record) => record !== null) as Connection[];
    return [category, connectionsInCategory]
  })));
  return connections;
}

// 一般アイテム
async function searchGenerals(searchParams: { [key: string]: string | string[] | undefined }) {
  const generals: { [key: string]: General[] } = Object.fromEntries(await Promise.all(toArray(searchParams["category"], ITEM_CATEGORIES).map(async category => {
    const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = `${baseUrl}/api/prisma`;    
    const fetchResultsInCategory = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "general",
        findOptions: {
          where: {
            AND: [
              {category: category},
              itemWhereCondition(searchParams),
              generalWhereCondition(searchParams),
            ].flat()
          },
          orderBy: [
            {type_order: "asc" as const},
            {cost_order: "asc" as const},
            {ruby: "asc" as const}
          ],
        },
      }),
    }).then((res) => res.json());
    const generalsInCategory = (await Promise.all(fetchResultsInCategory.map(async (fetchResult: GeneralFetchResult) => parseFetchResult("general", fetchResult)))).filter((record) => record !== null) as General[];
    return [category, generalsInCategory]
  })));
  return generals;
}

// Dロイス
async function searchDloises(searchParams: { [key: string]: string | string[] | undefined }) {
  const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
  const apiUrl = `${baseUrl}/api/prisma`;  
  const fetchResults = await fetch(apiUrl, {
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
        orderBy: [
          {type_order: "asc" as const},
          {restrict_order: "asc" as const},
          {no: "asc" as const}
        ],
      },
    }),
  }).then((res) => res.json());
  const dloises: {[key: string]: Dlois[]} = { "Dロイス": (await Promise.all(fetchResults.map(async (fetchResult: DloisFetchResult) => parseFetchResult("dlois", fetchResult)))).filter((record) => record !== null) as Dlois[] };
  return dloises;
}

// Eロイス
async function searchEloises(searchParams: { [key: string]: string | string[] | undefined }) {
  const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
  const apiUrl = `${baseUrl}/api/prisma`;
  const fetchResults = await fetch(apiUrl, {
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
        orderBy: [
          {urge_order: "asc" as const},
          {type_order: "asc" as const},
        ],
      },
    }),
  }).then((res) => res.json());
  const eloises: {[key: string]: Elois[]} = { "Eロイス": (await Promise.all(fetchResults.map(async (fetchResult: EloisFetchResult) => parseFetchResult("elois", fetchResult)))).filter((record) => record !== null) as Elois[] };
  return eloises;
}

// ワークス
async function searchWorks(searchParams: { [key: string]: string | string[] | undefined }) {
  const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
  const apiUrl = `${baseUrl}/api/prisma`;  
  const fetchResults = await fetch(apiUrl, {
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
  }).then((res) => res.json());
  const works: {[key: string]: Work[]} = { "ワークス": (await Promise.all(fetchResults.map(async (fetchResult: WorkFetchResult) => parseFetchResult("work", fetchResult)))).filter((record) => record !== null) as Work[] };
  return works;
}

////////////////////////////////
// 検索条件
////////////////////////////////

// エフェクト
function powerWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  return [
    {OR: toArray(searchParams["type"], POWER_TYPES).map(type => ({type: type}))},
    {OR: toArray(searchParams["supplement"], POWER_SUPPLEMENTS).map(supplement => ({supplement: supplement}))},
    {OR: [
      {update_supplement: null},
      {NOT: toArray(searchParams["supplement"], POWER_SUPPLEMENTS).map(supplement => ({update: {contains: supplement}}))}
    ]},
    {name: {contains: toString(searchParams["name"], "")}},
    {OR: [
      {maxlv_int: null},
      {maxlv_int: {gte: parseInt(toString(searchParams["maxlv"], "0"))}},
    ]},
    {OR: toArray(searchParams["timing"], POWER_TIMINGS).map(timing => ({timing: {contains: timing}}))}, 
    {OR: toArray(searchParams["skill"], POWER_SKILLS).map(skill => ({skill: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))},
    {OR: toArray(searchParams["dfclty"], POWER_DFCLTIES).map(dfclty => ({dfclty: dfclty}))},
    {OR: toArray(searchParams["target"], POWER_TARGETS).map(target => ({target: target}))},
    {OR: toArray(searchParams["rng"], POWER_RNGS).map(rng => ({rng: rng}))},
    {OR: toArray(searchParams["encroach"], POWER_ENCROACHES).map(encroach => ({encroach: encroach}))},
    {OR: toArray(searchParams["restrict"], POWER_RESTRICTS).map(restrict => ({restrict: {contains: restrict}}))},
    {effect: searchParams["effect"] && {contains: toString(searchParams["effect"], "")}},
  ];
}

// アイテム
function itemWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  return [
    { name: { contains: toString(searchParams["name"], "") } },
    { OR: toArray(searchParams["supplement"], ITEM_SUPPLEMENTS).map(supplement => ({ supplement: supplement })) },
    { OR: [
        { update_supplement: null },
        { NOT: toArray(searchParams["supplement"], ITEM_SUPPLEMENTS).map(supplement => ({ update: { contains: supplement } })) }
    ] },
    (searchParams["procure"]==null && searchParams["stock"]==null && searchParams["exp"]==null) ? {}
    : (searchParams["procure"]!=null && searchParams["stock"]==null && searchParams["exp"]==null) ? {AND: [{procure_int: {lte: parseInt(toString(searchParams["procure"], "0"))}}, {exp_int: null}]} 
    : (searchParams["procure"]==null && searchParams["stock"]!=null && searchParams["exp"]==null) ? {AND: [{stock_int: {lte: parseInt(toString(searchParams["stock"], "0"))}}, {exp_int: null}]} 
    : (searchParams["procure"]!=null && searchParams["stock"]!=null && searchParams["exp"]==null) ? {AND: [{procure_int: {lte: parseInt(toString(searchParams["procure"], "0"))}}, {stock_int: {lte: parseInt(toString(searchParams["stock"], "0"))}}, {exp_int: null}]} 
    : (searchParams["procure"]==null && searchParams["stock"]==null && searchParams["exp"]!=null) ? {exp_int: {lte: parseInt(toString(searchParams["exp"], "0"))}} 
    : (searchParams["procure"]!=null && searchParams["stock"]==null && searchParams["exp"]!=null) ? {OR: [{procure_int: {lte: parseInt(toString(searchParams["procure"], "0"))}}, {exp_int: {lte: parseInt(toString(searchParams["exp"], "0"))}}]} 
    : (searchParams["procure"]==null && searchParams["stock"]!=null && searchParams["exp"]!=null) ? {OR: [{stock_int: {lte: parseInt(toString(searchParams["stock"], "0"))}}, {exp_int: {lte: parseInt(toString(searchParams["exp"], "0"))}}]} 
    : {OR: [{AND: [{procure_int: {lte: parseInt(toString(searchParams["procure"], "0"))}}, {stock_int: {lte: parseInt(toString(searchParams["stock"], "0"))}}]}, {exp_int: {lte: parseInt(toString(searchParams["exp"], "0"))}}]},
    { effect: searchParams["effect"] && { contains: toString(searchParams["effect"], "") } },
  ];
}

// 武器
function weaponWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  return [
    { OR: toArray(searchParams["weapon-type"], WEAPON_TYPES).map(type => ({ type: { contains: type }})) },
    { OR: toArray(searchParams["weapon-skill"], WEAPON_SKILLS).map(skill => ({ skill: { contains: skill.replace("〈","").replace("〉","").replace(":","") } })) },
    { OR: [{ acc_int: null }, { acc_int: { gte: parseInt(toString(searchParams["weapon-acc"], "-999")) } }] },
    { OR: [{ atk_int: null }, { atk_int: { gte: parseInt(toString(searchParams["weapon-atk"], "-999")) } }] },
    { OR: [{ guard_int: null }, { guard_int: { gte: parseInt(toString(searchParams["weapon-guard"], "0")) } }] },
    { OR: [{ rng_int: null }, { rng_int: { gte: parseInt(toString(searchParams["weapon-rng"], "0")) } }] },
    (toString(searchParams["item-type"], "指定なし") == "指定なし") ? { refed_armor_id: null } : {},
    (toString(searchParams["item-type"], "指定なし") == "指定なし") ? { refed_general_id: null } : {},
  ];
}

// 防具
function armorWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  return [
      { OR: toArray(searchParams["armor-type"], ARMOR_TYPES).map(type => (type==="防具" ? { type: { not: { contains: "補助" } } } : { type: { contains: "補助" } })) },
      { OR: [{ dodge_int: null }, { dodge_int: { gte: parseInt(toString(searchParams["armor-dodge"], "-999")) } }] },
      { OR: [{ initiative_int: null }, { initiative_int: { gte: parseInt(toString(searchParams["armor-initiative"], "-999")) } }] },
      { OR: [{ armor_int: null }, { armor_int: { gte: parseInt(toString(searchParams["armor-armor"], "0")) } }] },
  ];
}

// ヴィークル
function vehicleWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  return [
    { OR: toArray(searchParams["vehicle-skill"], VEHICLE_SKILLS).map(skill => ({ skill: { contains: skill.replace("〈","").replace("〉","").replace(":","") } })) },
    { OR: [{ atk_int: null }, { atk_int: { gte: parseInt(toString(searchParams["vehicle-atk"], "-999")) } }] },
    { OR: [{ initiative_int: null }, { initiative_int: { gte: parseInt(toString(searchParams["vehicle-initiative"], "-999")) } }] },
    { OR: [{ armor_int: null }, { armor_int: { gte: parseInt(toString(searchParams["vehicle-armor"], "0")) } }] },
    { OR: [{ dash_int: null }, { dash_int: { gte: parseInt(toString(searchParams["vehicle-dash"], "0")) } }] },
  ];
}

// コネ
function connectionWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  return [
    { OR: toArray(searchParams["connection-skill"], CONNECTION_SKILLS).map(skill => ({ skill: { contains: skill } })) }
  ];
}

// 一般アイテム
function generalWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  return [
    { OR: toArray(searchParams["general-type"], GENERAL_TYPES).map(type => ({ type: { contains: type } })) }
  ];
}

// Dロイス
function dloisWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  return [
      {OR: toArray(searchParams["supplement"], DLOIS_SUPPLEMENTS).map(supplement => ({supplement: supplement}))},
      {OR: [
        {update_supplement: null},
        {NOT: toArray(searchParams["supplement"], DLOIS_SUPPLEMENTS).map(supplement => ({update: {contains: supplement}}))}
      ]},
      {OR: toArray(searchParams["type"], DLOIS_TYPES).map(type => ({type: type}))},
      {name: {contains: toString(searchParams["name"], "")}},
      {OR: toArray(searchParams["restrict"], DLOIS_RESTRICTS).map(restrict => ({restrict: {contains: restrict}}))},
      {effect: searchParams["effect"] && {contains: toString(searchParams["effect"], "")}},
  ];
}

// Eロイス
function eloisWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  return [
    {OR: toArray(searchParams["supplement"], ELOIS_SUPPLEMENTS).map(supplement => ({supplement: supplement}))},
    {OR: [
      {update_supplement: null},
      {NOT: toArray(searchParams["supplement"], ELOIS_SUPPLEMENTS).map(supplement => ({update: {contains: supplement}}))}
    ]},
    {OR: toArray(searchParams["type"], ELOIS_TYPES).map(type => ({type: type}))},
    {name: {contains: toString(searchParams["name"], "")}},
    {OR: toArray(searchParams["restrict"], ELOIS_TIMINGS).map(timing => ({timing: {contains: timing}}))},
    {OR: toArray(searchParams["skill"], ELOIS_SKILLS).map(skill => ({skill: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))},
    {OR: toArray(searchParams["dfclty"], ELOIS_DFCLTIES).map(dfclty => ({dfclty: {contains: dfclty}}))},
    {OR: toArray(searchParams["target"], ELOIS_TARGETS).map(target => ({target: {contains: target}}))},
    {OR: toArray(searchParams["rng"], ELOIS_RNGS).map(rng => ({rng: {contains: rng}}))},
    {OR: toArray(searchParams["urge"], ELOIS_URGES).map(urge => ({urge: {contains: urge}}))},
    {effect: searchParams["effect"] && {contains: toString(searchParams["effect"], "")}},
  ];
}

// ワークス
function workWhereCondition(searchParams: { [key: string]: string | string[] | undefined }) {
  return [
    { name: { contains: toString(searchParams["name"], "") } },
    {OR: toArray(searchParams["supplement"], WORK_SUPPLEMENTS).map(supplement => ({supplement: supplement}))},
    {OR: toArray(searchParams["stat"], WORK_STATS).map(stat => ({stat: {contains: stat}}))},
    {OR: toArray(searchParams["skill"], WORK_SKILLS).map(skill => ({skills: {contains: skill.replace("〈","").replace("〉","").replace(":","")}}))},
  ];
}