import searchPower from "@/features/effect-archive/utils/searchPower"
import { PowerData } from "@/types/types";

export default async function SearchResults ({
    searchParams,
  }: {
    searchParams: { [key: string]: string | string[] | undefined },
  }) {

    const powers = await searchPower(searchParams);

    return (
      <div>
        {Object.keys(powers).map((category) => (
          <div key={category}>
            <h2>{category}</h2>
            <ul>
              {powers[category].map((power:PowerData) => (
                <li key={power.id}>{power.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }