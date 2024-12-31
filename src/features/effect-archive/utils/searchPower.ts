import prisma from '@/lib/prisma';
import { EFFECT_CATEGORIES } from '@/consts/consts';
import { PowerData } from '@/types/types';

export default async function searchPower(currSearchParams: { [key: string]: string | string[] | undefined }) {
  const filteredCategories = typeof currSearchParams["category"] === "undefined" ? EFFECT_CATEGORIES : EFFECT_CATEGORIES.filter(category => toArray(currSearchParams["category"])?.includes(category));
  const results = Object.fromEntries(await Promise.all(filteredCategories.map(async category => [category, await searchPowerInCategory(category, currSearchParams)])));
  return results;
}

const searchPowerInCategory = async (category: string, currSearchParams: { [key: string]: string | string[] | undefined }): Promise<PowerData[]> => {
  const whereConndition = {
    category: category,
    supplement: {in: toArray(currSearchParams["supplement"])},
    name: {contains: toString(currSearchParams["name"])},
    maxlv: {in: toArray(currSearchParams["maxlv"])},
    timing: {in: toArray(currSearchParams["timing"])},
    skill: {in: toArray(currSearchParams["skill"])},
    dfclty: {in: toArray(currSearchParams["dfclty"])},
    target: {in: toArray(currSearchParams["target"])},
    rng: {in: toArray(currSearchParams["rng"])},
    encroach: {in: toArray(currSearchParams["encroach"])},
    restrict: {in: toArray(currSearchParams["restrict"])},
  };
  const results = await prisma.power.findMany({
    where: whereConndition
  });
  return results;
}

const toArray = (value: string | string[] | undefined) : string[] | undefined => typeof value === "string" ? Array(value) : typeof value === "object" ? value : undefined;
const toString = (value: string | string[] | undefined) : string | undefined => typeof value === "string" ? value : typeof value === "object" ? value[0] : undefined;