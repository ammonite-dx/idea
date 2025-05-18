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
import { TypeMap, Power, Item, Weapon, Armor, Vehicle, Connection, General, Dlois, Elois, Work } from '@/types/types';

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
    const powersInCategory = await fetch(apiUrl, {
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
              include: {
                ref_weapon: true,
                ref_armor: true,
                refed_dlois: true,
                other_vers: true,
                rel_weapons: true,
                rel_armors: true,
                rel_vehicles: true,
                rel_connections: true,
                rel_generals: true,
                rel_dloises: true,
                rel_faqs: true,
                rel_infos: true,
              },
              select: {
                id: true,
                supplement: true,
                category: true,
                type: true,
                name: true,
                maxlv: true,
                timing: true,
                skill: true,
                dfclty: true,
                target: true,
                rng: true,
                encroach: true,
                restrict: true,
                premise: true,
                flavor: true,
                effect: true,
                ref_weapon: true,
                ref_armor: true,
                other_vers: true,
                rel_powers: true,
                rel_weapons: true,
                rel_armors: true,
                rel_vehicles: true,
                rel_connections: true,
                rel_generals: true,
                rel_dloises: true,
                rel_faqs: true,
                rel_infos: true,
              },
              orderBy: [
                {type_restrict_order: 'asc' as const},
                {ruby: 'asc' as const},
              ],
            },
        }),
    }).then((res) => res.json()) as Power[];
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
    const weaponsInCategory = await fetch(apiUrl, {
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
          include: {
            refed_power: true,
            refed_armor: true,
            refed_general: true,
            other_vers: true,
            rel_powers: true,
            rel_weapons: true,
            rel_armors: true,
            rel_vehicles: true,
            rel_connections: true,
            rel_generals: true,
            rel_dloises: true,
            rel_faqs: true,
            rel_infos: true,
          },
          select: {
            id: true,
            supplement: true,
            category: true,
            name: true,
            type: true,
            skill: true,
            acc: true,
            atk: true,
            guard: true,
            rng: true,
            procure: true,
            stock: true,
            exp: true,
            rec: true,
            flavor: true,
            effect: true,
            price: true,
            rec_effect: true,
            refed_power: true,
            refed_armor: true,
            refed_general: true,
            other_vers: true,
            rel_powers: true,
            rel_weapons: true,
            rel_armors: true,
            rel_vehicles: true,
            rel_connections: true,
            rel_generals: true,
            rel_dloises: true,
            rel_faqs: true,
            rel_infos: true,
          },
          orderBy: [
            {type_order: "asc" as const},
            {cost_order: "asc" as const},
            {ruby: "asc" as const}
          ],
        },
      }),
    }).then((res) => res.json()) as Weapon[];
    return [category, weaponsInCategory]
  })));
  return weapons;
}

// 防具
async function searchArmors(searchParams: { [key: string]: string | string[] | undefined }) {
  const armors: { [key: string]: Armor[] } = Object.fromEntries(await Promise.all(toArray(searchParams["category"], ITEM_CATEGORIES).map(async category => {
    const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = `${baseUrl}/api/prisma`;
    const armorsInCategory = await fetch(apiUrl, {
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
          include: {
            ref_weapon: true,
            refed_power: true,
            other_vers: true,
            rel_powers: true,
            rel_weapons: true,
            rel_armors: true,
            rel_vehicles: true,
            rel_connections: true,
            rel_generals: true,
            rel_dloises: true,
            rel_faqs: true,
            rel_infos: true,
          },
          select: {
            id: true,
            supplement: true,
            category: true,
            name: true,
            type: true,
            dodge: true,
            initiative: true,
            armor: true,
            procure: true,
            stock: true,
            exp: true,
            rec: true,
            flavor: true,
            effect: true,
            price: true,
            rec_effect: true,
            ref_weapon: true,
            refed_power: true,
            other_vers: true,
            rel_powers: true,
            rel_weapons: true,
            rel_armors: true,
            rel_vehicles: true,
            rel_connections: true,
            rel_generals: true,
            rel_dloises: true,
            rel_faqs: true,
            rel_infos: true,
          },
          orderBy: [
            {type_order: "asc" as const},
            {cost_order: "asc" as const},
            {ruby: "asc" as const}
          ],
        },
      }),
    }).then((res) => res.json()) as Armor[];
    return [category, armorsInCategory]
  })));
  return armors;
}

// ヴィークル
async function searchVehicles(searchParams: { [key: string]: string | string[] | undefined }) {
  const vehicles: { [key: string]: Vehicle[] } = Object.fromEntries(await Promise.all(toArray(searchParams["category"], ITEM_CATEGORIES).map(async category => {
    const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = `${baseUrl}/api/prisma`;    
    const vehiclesInCategory = await fetch(apiUrl, {
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
          include: {
            other_vers: true,
            rel_powers: true,
            rel_weapons: true,
            rel_armors: true,
            rel_vehicles: true,
            rel_connections: true,
            rel_generals: true,
            rel_dloises: true,
            rel_faqs: true,
            rel_infos: true,
          },
          select: {
            id: true,
            supplement: true,
            category: true,
            name: true,
            type: true,
            skill: true,
            atk: true,
            initiative: true,
            armor: true,
            dash: true,
            procure: true,
            stock: true,
            exp: true,
            rec: true,
            flavor: true,
            effect: true,
            price: true,
            rec_effect: true,
            other_vers: true,
            rel_powers: true,
            rel_weapons: true,
            rel_armors: true,
            rel_vehicles: true,
            rel_connections: true,
            rel_generals: true,
            rel_dloises: true,
            rel_faqs: true,
            rel_infos: true,
          },
          orderBy: [
            {cost_order: "asc" as const},
            {ruby: "asc" as const}
          ],
        },
      }),
    }).then((res) => res.json()) as Vehicle[];
    return [category, vehiclesInCategory]
  })));
  return vehicles;
}

// コネ
async function searchConnections(searchParams: { [key: string]: string | string[] | undefined }) {
  const connections: { [key: string]: Connection[] } = Object.fromEntries(await Promise.all(toArray(searchParams["category"], ITEM_CATEGORIES).map(async category => {
    const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = `${baseUrl}/api/prisma`;    
    const connectionsInCategory: Connection[] = await fetch(apiUrl, {
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
          include: {
            other_vers: true,
            rel_powers: true,
            rel_weapons: true,
            rel_armors: true,
            rel_vehicles: true,
            rel_connections: true,
            rel_generals: true,
            rel_dloises: true,
            rel_faqs: true,
            rel_infos: true,
          },
          select: {
            id: true,
            supplement: true,
            category: true,
            name: true,
            type: true,
            skill: true,
            procure: true,
            stock: true,
            exp: true,
            rec: true,
            flavor: true,
            effect: true,
            price: true,
            rec_effect: true,
            other_vers: true,
            rel_powers: true,
            rel_weapons: true,
            rel_armors: true,
            rel_vehicles: true,
            rel_connections: true,
            rel_generals: true,
            rel_dloises: true,
            rel_faqs: true,
            rel_infos: true,
          },
          orderBy: [
            {cost_order: "asc" as const},
            {ruby: "asc" as const}
          ],
        },
      }),
    }).then((res) => res.json());
    return [category, connectionsInCategory]
  })));
  return connections;
}

// 一般アイテム
async function searchGenerals(searchParams: { [key: string]: string | string[] | undefined }) {
  const generals: { [key: string]: General[] } = Object.fromEntries(await Promise.all(toArray(searchParams["category"], ITEM_CATEGORIES).map(async category => {
    const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
    const apiUrl = `${baseUrl}/api/prisma`;    
    const generalsInCategory = await fetch(apiUrl, {
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
          include: {
            ref_weapon: true,
            other_vers: true,
            rel_powers: true,
            rel_weapons: true,
            rel_armors: true,
            rel_vehicles: true,
            rel_connections: true,
            rel_generals: true,
            rel_dloises: true,
            rel_faqs: true,
            rel_infos: true,
          },
          select: {
            id: true,
            supplement: true,
            category: true,
            name: true,
            type: true,
            procure: true,
            stock: true,
            exp: true,
            rec: true,
            flavor: true,
            effect: true,
            price: true,
            rec_effect: true,
            ref_weapon: true,
            other_vers: true,
            rel_powers: true,
            rel_weapons: true,
            rel_armors: true,
            rel_vehicles: true,
            rel_connections: true,
            rel_generals: true,
            rel_dloises: true,
            rel_faqs: true,
            rel_infos: true,
          },
          orderBy: [
            {type_order: "asc" as const},
            {cost_order: "asc" as const},
            {ruby: "asc" as const}
          ],
        },
      }),
    }).then((res) => res.json()) as General[];
    return [category, generalsInCategory]
  })));
  return generals;
}

// Dロイス
async function searchDloises(searchParams: { [key: string]: string | string[] | undefined }) {
  const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
  const apiUrl = `${baseUrl}/api/prisma`;  
  const dloises: {[key: string]: Dlois[]} = await fetch(apiUrl, {
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
          other_vers: true,
          rel_powers: true,
          rel_weapons: true,
          rel_armors: true,
          rel_vehicles: true,
          rel_connections: true,
          rel_generals: true,
          rel_dloises: true,
          rel_faqs: true,
          rel_infos: true,
        },
        select: {
          id: true,
          supplement: true,
          type: true,
          name: true,
          restrict: true,
          flavor: true,
          description: true,
          rec: true,
          effect: true,
          rec_effect: true,
          ref_power: true,
          flavor_summary: true,
          effect_summary: true,
          rec_effect_summary: true,
          other_vers: true,
          rel_powers: true,
          rel_weapons: true,
          rel_armors: true,
          rel_vehicles: true,
          rel_connections: true,
          rel_generals: true,
          rel_dloises: true,
          rel_faqs: true,
          rel_infos: true,
        },
        orderBy: [
          {type_order: "asc" as const},
          {restrict_order: "asc" as const},
          {no: "asc" as const}
        ],
      },
    }),
  }).then((res) => res.json()).then((data) => ({"Dロイス": data}));
  return dloises;
}

// Eロイス
async function searchEloises(searchParams: { [key: string]: string | string[] | undefined }) {
  const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
  const apiUrl = `${baseUrl}/api/prisma`;
  const eloises: {[key: string]: Elois[]} = await fetch(apiUrl, {
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
          other_vers: true,
          rel_eloises: true,
          rel_faqs: true,
          rel_infos: true,
        },
        select: {
          id: true,
          supplement: true,
          type: true,
          name: true,
          timing: true,
          skill: true,
          dfclty: true,
          target: true,
          rng: true,
          urge: true,
          flavor: true,
          effect: true,
          other_vers: true,
          rel_eloises: true,
          rel_faqs: true,
          rel_infos: true,
        },
        orderBy: [
          {urge_order: "asc" as const},
          {type_order: "asc" as const},
        ],
      },
    }),
  }).then((res) => res.json()).then((data) => ({"Eロイス": data}));
  return eloises;
}

// ワークス
async function searchWorks(searchParams: { [key: string]: string | string[] | undefined }) {
  const baseUrl = process.env.CF_PAGES_URL || process.env.NEXT_PUBLIC_BASE_URL;
  const apiUrl = `${baseUrl}/api/prisma`;  
  const works: {[key: string]: Work[]} = await fetch(apiUrl, {
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
        select: {
          id: true,
          supplement: true,
          name: true,
          stat: true,
          skills: true,
          emblems: true,
        },
      },
    }),
  }).then((res) => res.json()).then((data) => ({"ワークス": data}));
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
      {NOT: toArray(searchParams["supplement"], POWER_SUPPLEMENTS).map(supplement => ({update_supplement: {contains: supplement}}))}
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
        { NOT: toArray(searchParams["supplement"], ITEM_SUPPLEMENTS).map(supplement => ({ update_supplement: { contains: supplement } })) }
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
        {NOT: toArray(searchParams["supplement"], DLOIS_SUPPLEMENTS).map(supplement => ({update_supplement: {contains: supplement}}))}
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
      {NOT: toArray(searchParams["supplement"], ELOIS_SUPPLEMENTS).map(supplement => ({update_supplement: {contains: supplement}}))}
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