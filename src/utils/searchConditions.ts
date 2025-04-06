import { toString, toArray } from "./utils";
import { ITEM_SUPPLEMENTS } from "@/consts/item";
import { WEAPON_TYPES, WEAPON_SKILLS } from "@/consts/weapon";
import { ARMOR_TYPES } from "@/consts/armor";
import { VEHICLE_SKILLS } from "@/consts/vehicle";
import { CONNECTION_SKILLS } from "@/consts/connection";
import { GENERAL_TYPES } from "@/consts/general";

//////////////////////////////
// 汎用
//////////////////////////////

// 名称
export const itemNameCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { name: { contains: toString(currSearchParams["name"], "") } }
);

// サプリメント
export const itemSupplementCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: toArray(currSearchParams["supplement"], ITEM_SUPPLEMENTS).map(supplement => ({ supplement: supplement })) }
);

// アップデート
export const itemUpdateCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: [
        { update: null },
        { NOT: toArray(currSearchParams["supplement"], ITEM_SUPPLEMENTS).map(supplement => ({ update: { contains: supplement } })) }
    ] }
);

// 取得コスト
export const itemCostCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    (currSearchParams["procure"]==null && currSearchParams["stock"]==null && currSearchParams["exp"]==null) ? {} :
    (currSearchParams["procure"]!=null && currSearchParams["stock"]==null && currSearchParams["exp"]==null) ? {AND: [{procure_int: {lte: parseInt(toString(currSearchParams["procure"], "0"))}}, {exp_int: null}]} :
    (currSearchParams["procure"]==null && currSearchParams["stock"]!=null && currSearchParams["exp"]==null) ? {AND: [{stock_int: {lte: parseInt(toString(currSearchParams["stock"], "0"))}}, {exp_int: null}]} :
    (currSearchParams["procure"]!=null && currSearchParams["stock"]!=null && currSearchParams["exp"]==null) ? {AND: [{procure_int: {lte: parseInt(toString(currSearchParams["procure"], "0"))}}, {stock_int: {lte: parseInt(toString(currSearchParams["stock"], "0"))}}, {exp_int: null}]} :
    (currSearchParams["procure"]==null && currSearchParams["stock"]==null && currSearchParams["exp"]!=null) ? {exp_int: {lte: parseInt(toString(currSearchParams["exp"], "0"))}} :
    (currSearchParams["procure"]!=null && currSearchParams["stock"]==null && currSearchParams["exp"]!=null) ? {OR: [{procure_int: {lte: parseInt(toString(currSearchParams["procure"], "0"))}}, {exp_int: {lte: parseInt(toString(currSearchParams["exp"], "0"))}}]} :
    (currSearchParams["procure"]==null && currSearchParams["stock"]!=null && currSearchParams["exp"]!=null) ? {OR: [{stock_int: {lte: parseInt(toString(currSearchParams["stock"], "0"))}}, {exp_int: {lte: parseInt(toString(currSearchParams["exp"], "0"))}}]} :
    {OR: [{AND: [{procure_int: {lte: parseInt(toString(currSearchParams["procure"], "0"))}}, {stock_int: {lte: parseInt(toString(currSearchParams["stock"], "0"))}}]}, {exp_int: {lte: parseInt(toString(currSearchParams["exp"], "0"))}}]}
);

// 効果
export const itemEffectCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { effect: currSearchParams["effect"] && { contains: toString(currSearchParams["effect"], "") } }
);

//////////////////////////////
// 武器
//////////////////////////////

// 武器種
export const weaponTypeCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: toArray(currSearchParams["weapon-type"], WEAPON_TYPES).map(type => ({ type: type })) }
);

// 技能
export const weaponSkillCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: toArray(currSearchParams["weapon-skill"], WEAPON_SKILLS).map(skill => ({ skill: { contains: skill } })) }
);

// 命中
export const weaponAccCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: [{ acc_int: null }, { acc_int: { gte: parseInt(toString(currSearchParams["weapon-acc"], "-999")) } }] }
);

// 攻撃力
export const weaponAtkCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: [{ atk_int: null }, { atk_int: { gte: parseInt(toString(currSearchParams["weapon-atk"], "-999")) } }] }
);

// ガード値
export const weaponGuardCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: [{ guard_int: null }, { guard_int: { gte: parseInt(toString(currSearchParams["weapon-guard"], "0")) } }] }
);

// 射程
export const weaponRngCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: [{ rng_int: null }, { rng_int: { gte: parseInt(toString(currSearchParams["weapon-rng"], "0")) } }] }
);

// 参照元防具
export const weaponRefedArmorCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    (toString(currSearchParams["item-type"], "指定なし") == "指定なし") ? { refed_armor_id: null } : {}
);

// 参照元一般アイテム
export const weaponRefedGeneralCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    (toString(currSearchParams["item-type"], "指定なし") == "指定なし") ? { refed_general_id: null } : {}
);

//////////////////////////////
// 防具
//////////////////////////////

// 防具種
export const armorTypeCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: toArray(currSearchParams["armor-type"], ARMOR_TYPES).map(type => (type==="防具" ? { type: { not: { contains: "補助" } } } : { type: { contains: "補助" } })) }
);

// ドッジ
export const armorDodgeCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: [{ dodge_int: null }, { dodge_int: { gte: parseInt(toString(currSearchParams["armor-dodge"], "-999")) } }] }
);

// 行動
export const armorInitiativeCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: [{ initiative_int: null }, { initiative_int: { gte: parseInt(toString(currSearchParams["armor-initiative"], "-999")) } }] }
);

// 装甲値
export const armorArmorCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: [{ armor_int: null }, { armor_int: { gte: parseInt(toString(currSearchParams["armor-armor"], "0")) } }] }
);

//////////////////////////////
// ヴィークル
//////////////////////////////

// 技能
export const vehicleSkillCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: toArray(currSearchParams["vehicle-skill"], VEHICLE_SKILLS).map(skill => ({ skill: { contains: skill } })) }
);

// 攻撃力
export const vehicleAtkCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: [{ atk_int: null }, { atk_int: { gte: parseInt(toString(currSearchParams["vehicle-atk"], "-999")) } }] }
);

// 行動
export const vehicleInitiativeCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: [{ initiative_int: null }, { initiative_int: { gte: parseInt(toString(currSearchParams["vehicle-initiative"], "-999")) } }] }
);

// 装甲値
export const vehicleArmorCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: [{ armor_int: null }, { armor_int: { gte: parseInt(toString(currSearchParams["vehicle-armor"], "0")) } }] }
);

// 全力移動
export const vehicleDashCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: [{ dash_int: null }, { dash_int: { gte: parseInt(toString(currSearchParams["vehicle-dash"], "0")) } }] }
);

//////////////////////////////
// コネ
//////////////////////////////

// 技能
export const connectionSkillCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: toArray(currSearchParams["connection-skill"], CONNECTION_SKILLS).map(skill => ({ skill: { contains: skill } })) }
);

//////////////////////////////
// 一般アイテム
//////////////////////////////

// 種別
export const generalTypeCondition = (currSearchParams:{[key: string]: string | string[] | undefined }) => (
    { OR: toArray(currSearchParams["general-type"], GENERAL_TYPES).map(type => ({ type: { contains: type } })) }
);