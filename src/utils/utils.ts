import { Power,Weapon,Armor,Vehicle,Connection,General } from "@/types/types"

export const toArray = (value:string|string[]|undefined, defaultValue:string[]) : string[] => typeof value === "string" ? Array(value) : typeof value === "object" ? value : defaultValue;

export const toString = (value: string | string[] | undefined, defaultValue: string) : string => typeof value === "string" ? value : typeof value === "object" ? value[0] : defaultValue;

export const strToSelectObj = (s:string) => ({value:s, label:s})

//export function is<T extends Power|Weapon|Armor|Vehicle|Connection|General, U extends T["kind"]>(kind:U, item:T): item is Extract<T,{kind:U}> {return item.kind === kind;}