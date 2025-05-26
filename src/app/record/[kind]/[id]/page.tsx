import { notFound } from "next/navigation";
import RecordCard from "@/components/RecordCard";
import CardList from "@/components/CardList";
import getRecordById from "@/utils/getRecordById";
import { CardRecordKind } from "@/types/types";

export const runtime = 'edge';

type PageProps = {
    params: Promise<{
        kind: string;
        id: string;
    }>;
}

export default async function Page({ params }: PageProps) {

    // 詳細を表示したいデータを取得
    const { kind, id } = await params;
    const decodedKind = decodeURIComponent(kind) as CardRecordKind;
    const decodedId = decodeURIComponent(id);
    const record = await getRecordById(decodedKind, decodedId);
    if (!record) return notFound();

    // 別バージョン
    const otherVers = "other_vers" in record && record.other_vers;

    // 関連データ
    const relPowers = "rel_powers" in record && record.rel_powers;
    const relItems = [
        "rel_weapons" in record ? record.rel_weapons : null,
        "rel_armors" in record ? record.rel_armors : null,
        "rel_vehicles" in record ? record.rel_vehicles : null,
        "rel_connections" in record ? record.rel_connections : null,
        "rel_generals" in record ? record.rel_generals : null,
    ].filter((item) => (item !== null) && (item !== undefined)).flat();
    const relDlois = "rel_dloises" in record ? record.rel_dloises : null;
    const relElois = "rel_eloises" in record ? record.rel_eloises : null;

    return (
        <div>
            <div className="mb-4 lg:mb-8"><RecordCard record={record} category details/></div>
            {otherVers && otherVers.length>0 && <CardList title="別バージョン" records={otherVers} category />}
            {relPowers && relPowers.length>0 && <CardList title="関連エフェクト" records={relPowers} category />}
            {relItems && relItems.length>0 && <CardList title="関連アイテム" records={relItems} category />}
            {relDlois && relDlois.length>0 && <CardList title="関連Dロイス" records={relDlois} category />}
            {relElois && relElois.length>0 && <CardList title="関連Eロイス" records={relElois} category />}
        </div>
    );
} 