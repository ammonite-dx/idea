import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import getPowerById from './getPowerById';
import getWeaponById from './getWeaponById';
import getArmorById from './getArmorById';
import getVehicleById from './getVehicleById';
import getConnectionById from './getConnectionById';
import getGeneralById from './getGeneralById';
import getDloisById from './getDloisById';
import getEloisById from './getEloisById';
import { Power, Weapon, Armor, Vehicle, Connection, General, Dlois, Elois } from '@/types/types';

export default async function findFavorites({ kind }: { kind: string }) {
  
  // セッションを取得
  const session = await getServerSession(authOptions);
  if (!session) return [];
  if (!session.user.id) return [];
    
  // お気に入りID取得
  const searchResults = await prisma.favorite.findMany({
    where: {
      user_id: session.user.id,
      data_kind: kind,
    },
    select: { data_id: true },
  });

  // 検索結果を整形
  const favorites = (
    kind === "power" ? (await Promise.all(searchResults.map(async searchResult => getPowerById(searchResult.data_id)))).filter(power => power !== null) as Power[] :
    kind === "weapon" ? (await Promise.all(searchResults.map(async searchResult => getWeaponById(searchResult.data_id)))).filter(weapon => weapon !== null) as Weapon[] :
    kind === "armor" ? (await Promise.all(searchResults.map(async searchResult => getArmorById(searchResult.data_id)))).filter(armor => armor !== null) as Armor[] :
    kind === "vehicle" ? (await Promise.all(searchResults.map(async searchResult => getVehicleById(searchResult.data_id)))).filter(vehicle => vehicle !== null) as Vehicle[] :
    kind === "connection" ? (await Promise.all(searchResults.map(async searchResult => getConnectionById(searchResult.data_id)))).filter(connection => connection !== null) as Connection[] :
    kind === "general" ? (await Promise.all(searchResults.map(async searchResult => getGeneralById(searchResult.data_id)))).filter(general => general !== null) as General[] :
    kind === "dlois" ? (await Promise.all(searchResults.map(async searchResult => getDloisById(searchResult.data_id)))).filter(dlois => dlois !== null) as Dlois[] :
    kind === "elois" ? (await Promise.all(searchResults.map(async searchResult => getEloisById(searchResult.data_id)))).filter(elois => elois !== null) as Elois[] :
    []
  );

  return favorites;
}