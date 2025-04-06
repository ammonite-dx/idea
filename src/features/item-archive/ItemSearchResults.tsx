import searchItems from "@/utils/searchItems"
import CategoryCard from "@/components/CategoryCard";
import PowerCard from "@/components/PowerCard";
import WeaponCard from "@/components/WeaponCard";
import ArmorCard from "@/components/ArmorCard";
import VehicleCard from "@/components/VehicleCard";
import ConnectionCard from "@/components/ConnectionCard";
import GeneralCard from "@/components/GeneralCard";
import { Power,Weapon,Armor,Vehicle,Connection,General } from "@/types/types";
import { is } from "@/utils/utils"
import { Fragment } from "react";

export default async function PowerSearchResults ({
    searchParams,
  }: {
    searchParams: { [key:string]: string | string[] | undefined },
  }) {

    const items: { [key: string]: (Power|Weapon|Armor|Vehicle|Connection|General)[] } = await searchItems(searchParams);

    return (
      <div className="m-4">
        {Object.keys(items).map((category) => (
          <Fragment key={category}>
            {items[category].length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                <CategoryCard categoryName={category} hitNumber={items[category].length} />
                {items[category].map((item:Power|Weapon|Armor|Vehicle|Connection|General) => (
                  <Fragment key={item.id}>
                    {is("power", item) && <PowerCard power={item}/>}
                    {is("weapon", item) && <WeaponCard weapon={item}/>}
                    {is("armor", item) && <ArmorCard armor={item}/>}
                    {is("vehicle", item) && <VehicleCard vehicle={item}/>}
                    {is("connection", item) && <ConnectionCard connection={item}/>}
                    {is("general", item) && <GeneralCard general={item}/>}
                  </Fragment>
                ))}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    );
  }