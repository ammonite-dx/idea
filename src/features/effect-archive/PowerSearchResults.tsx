import searchPowers from "@/utils/searchPowers"
import CategoryCard from "@/components/CategoryCard";
import PowerCard from "@/components/PowerCard";
import { Power } from "@/types/types";
import { Fragment } from "react";

export default async function PowerSearchResults ({
    searchParams,
  }: {
    searchParams: { [key:string]: string | string[] | undefined },
  }) {

    const powers: { [key: string]: Power[] } = await searchPowers(searchParams);

    return (
      <div className="m-4">
        {Object.keys(powers).map((category) => (
          <Fragment key={category}>
            {powers[category].length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                <CategoryCard categoryName={category} hitNumber={powers[category].length} />
                {powers[category].map((power:Power) => (
                  <PowerCard key={power.id} power={power} />
                ))}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    );
  }