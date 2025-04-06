import getWeaponById from "@/utils/getWeaponById";
import CategoryCard from "@/components/CategoryCard";
import WeaponCard from "@/components/WeaponCard";
import { Weapon } from "@/types/types";

export default async function WeaponOtherVers ({ other_ver_id }: { other_ver_id: string }) {
    const otherVers = (await Promise.all(other_ver_id.split(" ").map(async (id) => getWeaponById(id)))).filter((weapon) => weapon !== null) as Weapon[];
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CategoryCard categoryName="別バージョン" hitNumber={otherVers.length} />
            {otherVers.map((weapon:Weapon) => (
                <WeaponCard key={weapon.id} weapon={weapon} category/>
            ))}
        </div>
    );
}