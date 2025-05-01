'use client';

type Favorite = {
    id: string;
    user_id: string;
    record_kind: string;
    record_id: string;
};

export default async function FavoriteRecords() {
    const favPowers = (await (await fetch(`/api/favorite?record-kind=power`,{method:"GET"})).json()) as Favorite[];
    const favWeapons = (await (await fetch(`/api/favorite?record-kind=weapon`,{method:"GET"})).json()) as Favorite[];
    const favArmors = (await (await fetch(`/api/favorite?record-kind=armor`,{method:"GET"})).json()) as Favorite[];
    const favVehicles = (await (await fetch(`/api/favorite?record-kind=vehicle`,{method:"GET"})).json()) as Favorite[];
    const favConnections = (await (await fetch(`/api/favorite?record-kind=connection`,{method:"GET"})).json()) as Favorite[];
    const favGenerals = (await (await fetch(`/api/favorite?record-kind=general`,{method:"GET"})).json()) as Favorite[];
    const favItems = favWeapons.concat(favArmors, favVehicles, favConnections, favGenerals);
    const favDloises = (await (await fetch(`/api/favorite?record-kind=dlois`,{method:"GET"})).json()) as Favorite[];
    const favEloises = (await (await fetch(`/api/favorite?record-kind=elois`,{method:"GET"})).json()) as Favorite[];
    return (
        <div>
            {favPowers.length>0 && favPowers.map((power) => (<div key={power.id}>{power.record_id}</div>))}
            {favItems.length>0 && favItems.map((item) => (<div key={item.id}>{item.record_id}</div>))}
            {favDloises.length>0 && favDloises.map((dlois) => (<div key={dlois.id}>{dlois.record_id}</div>))}
            {favEloises.length>0 && favEloises.map((elois) => (<div key={elois.id}>{elois.record_id}</div>))}
        </div>
    );
}