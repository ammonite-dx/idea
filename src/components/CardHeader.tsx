import Link from "next/link";
import ScaledText from "./ScaledText";
import FavoriteButton from "./FavoriteButton";
import { Power, Weapon, Armor, Vehicle, Connection, General, Dlois, Elois } from "@/types/types";

export default function CardHeader ({ title, data, subtitle="" }: { title:string, data:Power|Weapon|Armor|Vehicle|Connection|General|Dlois|Elois, subtitle?:string }) {
    const link = (
        data.kind === "power" ? `/effect-archive/${data.id}` :
        data.kind === "weapon" ? `/item-archive/weapon/${data.id}` :
        data.kind === "armor" ? `/item-archive/armor/${data.id}` :
        data.kind === "vehicle" ? `/item-archive/vehicle/${data.id}` :
        data.kind === "connection" ? `/item-archive/connection/${data.id}` :
        data.kind === "general" ? `/item-archive/general/${data.id}` :
        data.kind === "dlois" ? `/dlois-archive/${data.id}` :
        data.kind === "elois" ? `/elois-archive/${data.id}` :
        "/"
    )
    return (
        <div className="flex items-center justify-between px-1 lg:px-2 py-0">
            <div className="flex-1 text-left text-sm lg:text-lg font-black overflow-hidden"><Link href={link}><ScaledText text={title}/></Link></div>
            <div className="text-right mx-1 lg:mx-2 text-xs lg:text-base font-black">{subtitle}</div>
            <FavoriteButton dataKind={data.kind} dataId={data.id} />
        </div>
    )
}