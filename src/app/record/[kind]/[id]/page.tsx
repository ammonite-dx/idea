import { notFound } from "next/navigation";
import RecordCard from "@/components/RecordCard";
import CardList from "@/components/CardList";
import getRecordById from "@/utils/getRecordById";
import { PrimaryKind, PrimaryRecord } from "@/types/types";

export default async function Page({ kind, id }: { kind: PrimaryKind, id: string }) {

    // 詳細を表示したいデータを取得
    const record = await getRecordById(kind, id);
    if (!record) return notFound();

    // 別バージョン
    const otherVers = ("other_ver_id" in record && record.other_ver_id) ? await getRelRecord(record.kind, record.other_ver_id) : null;

    // 関連データ
    const relPowers = ("rel_power_id" in record && record.rel_power_id) ? await getRelRecord("power", record.rel_power_id) : null;
    const relItems = [
        ("rel_weapon_id" in record && record.rel_weapon_id) ? await getRelRecord("weapon", record.rel_weapon_id) : null,
        ("rel_armor_id" in record && record.rel_armor_id) ? await getRelRecord("armor", record.rel_armor_id) : null,
        ("rel_vehicle_id" in record && record.rel_vehicle_id) ? await getRelRecord("vehicle", record.rel_vehicle_id) : null,
        ("rel_connection_id" in record && record.rel_connection_id) ? await getRelRecord("connection", record.rel_connection_id) : null,
        ("rel_general_id" in record && record.rel_general_id) ? await getRelRecord("general", record.rel_general_id) : null,
    ].filter((item) => item !== null).flat();
    const relDlois = ("rel_dlois_id" in record && record.rel_dlois_id) ? await getRelRecord("dlois", record.rel_dlois_id) : null;
    const relElois = ("rel_elois_id" in record && record.rel_elois_id) ? await getRelRecord("elois", record.rel_elois_id) : null;

    return (
        <div>
            <RecordCard record={record} category details/>
            {otherVers && <CardList title="別バージョン" records={otherVers} category />}
            {relPowers && <CardList title="関連エフェクト" records={relPowers} category />}
            {relItems && <CardList title="関連アイテム" records={relItems} category />}
            {relDlois && <CardList title="関連Dロイス" records={relDlois} category />}
            {relElois && <CardList title="関連Eロイス" records={relElois} category />}
        </div>
    );
}

async function getRelRecord(kind: PrimaryKind, ids?: string): Promise<PrimaryRecord[]> {
    if (!ids) return [];
    return (await Promise.all(
        ids.split(" ").map(id => getRecordById(kind, id))
    )).filter((d): d is NonNullable<typeof d> => d !== null);
}
  