"use client";

import { useState, useEffect } from 'react';
import RecordCard from "@/components/RecordCard";
import CardList from "@/components/CardList";
import { CardRecordKindMap } from "@/types/types";

export default function RecordResult<K extends keyof CardRecordKindMap>({
    kind,
    id,
}: {
    kind: K,
    id: string,
}) {

    const [record, setRecord] = useState<CardRecordKindMap[K] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecord = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/record/${kind}?id=${id}`);
                if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
                const result = (await response.json()).record as CardRecordKindMap[K];
                console.log("fetchRecord result:", result);
                setRecord(result);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                console.error("fetchRecord failed:", e);
                setError(e.message || "データの取得に失敗しました。");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecord();
    }, [kind, id]);

    if (isLoading) {
        return <div className='base-text'>検索中...</div>; // ローディング表示
    }

    if (error) {
        return <div className='base-text'>エラー: {error}</div>; // エラー表示
    }

    if (!record) {
        return (
            <section>
                <div className="base-text m-4">指定されたデータは存在しません。</div>
            </section>
        );
    }

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

