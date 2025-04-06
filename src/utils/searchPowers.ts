import prisma from '@/lib/prisma';
import getPowerById from './getPowerById';
import { toArray, toString } from '@/utils/utils';
import { POWER_CATEGORIES, POWER_TYPES, POWER_SUPPLEMENTS, POWER_TIMINGS, POWER_SKILLS, POWER_DFCLTIES, POWER_TARGETS, POWER_RNGS, POWER_RESTRICTS } from '@/consts/power';
import { Power } from '@/types/types';

export default async function searchPowers(currSearchParams: { [key: string]: string | string[] | undefined }) {
  const powers: {[key: string]: Power[]} = Object.fromEntries(await Promise.all(toArray(currSearchParams["category"], POWER_CATEGORIES).map(async category => {
    const whereConndition = {
      AND: [
        {category: category},
        {OR: toArray(currSearchParams["type"], POWER_TYPES).map(type => ({type: type}))},
        {OR: toArray(currSearchParams["supplement"], POWER_SUPPLEMENTS).map(supplement => ({supplement: supplement}))},
        {OR: [
          {update: null},
          {NOT: toArray(currSearchParams["supplement"], POWER_SUPPLEMENTS).map(supplement => ({update: {contains: supplement}}))}
        ]},
        {name: {contains: toString(currSearchParams["name"], "")}},
        {OR: [
          {maxlv_int: null},
          {maxlv_int: {gte: parseInt(toString(currSearchParams["maxlv"], "0"))}},
        ]},
        {OR: toArray(currSearchParams["timing"], POWER_TIMINGS).map(timing => ({timing: {contains: timing}}))}, 
        {OR: toArray(currSearchParams["skill"], POWER_SKILLS).map(skill => ({skill: {contains: skill}}))},
        {OR: toArray(currSearchParams["dfclty"], POWER_DFCLTIES).map(dfclty => ({dfclty: dfclty}))},
        {OR: toArray(currSearchParams["target"], POWER_TARGETS).map(target => ({target: target}))},
        {OR: toArray(currSearchParams["rng"], POWER_RNGS).map(rng => ({rng: rng}))},
        {OR: [
          {encroach_int: null},
          {encroach_int: {lte: parseInt(toString(currSearchParams["encroach"], "999"))}},
        ]},
        {OR: toArray(currSearchParams["restrict"], POWER_RESTRICTS).map(restrict => ({restrict: {contains: restrict}}))},
        {effect: currSearchParams["effect"] && {contains: toString(currSearchParams["effect"], "")}},
      ]
    };
    const searchResultsInCategory = await prisma.power.findMany({
      where: whereConndition,
      orderBy: [
        {type_restrict_order: "asc"},
        {ruby: "asc"}
      ],
    })
    const powersInCategory = (await Promise.all(searchResultsInCategory.map(async searchResult => getPowerById(searchResult.id)))).filter((power) => power !== null) as Power[];
    return [category, powersInCategory];
  })));
  return powers;
}