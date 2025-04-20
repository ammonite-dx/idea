export const toArray = (value:string|string[]|undefined, defaultValue:string[]) : string[] => typeof value === "string" ? Array(value) : typeof value === "object" ? value : defaultValue;

export const toString = (value: string | string[] | undefined, defaultValue: string) : string => typeof value === "string" ? value : typeof value === "object" ? value[0] : defaultValue;

export const strToSelectObj = (s:string) => ({value:s, label:s})