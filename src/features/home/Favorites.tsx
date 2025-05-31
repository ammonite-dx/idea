"use client";

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import getRecordById from '@/utils/getRecordById';
import CardList from "@/components/CardList";
import { User } from "@/types/types";

export default function Favorites() {

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const { user } = useUser();
                const userId = user?.id || "";
                const result = await getRecordById("user", userId);
                setUser(result);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                console.error("fetchUser failed:", e);
                setError(e.message || "データの取得に失敗しました。");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (isLoading) {
        return <div className='base-text'>検索中...</div>; // ローディング表示
    }

    if (error) {
        return <div className='base-text'>エラー: {error}</div>; // エラー表示
    }

    if (!user) {
        return (
            <section>
                <div className="base-text m-4">指定されたユーザーは存在しません。</div>
            </section>
        );
    }

    // お気に入りデータ
    const favPowers = ("fav_powers" in user && user.fav_powers) ? user.fav_powers : [];
    const favItems = [
        ("fav_weapons" in user && user.fav_weapons) ? user.fav_weapons : null,
        ("fav_armors" in user && user.fav_armors) ? user.fav_armors : null,
        ("fav_vehicles" in user && user.fav_vehicles) ? user.fav_vehicles : null,
        ("fav_connections" in user && user.fav_connections) ? user.fav_connections : null,
        ("fav_generals" in user && user.fav_generals) ? user.fav_generals : null,
    ].filter((item) => (item !== null) && (item !== undefined)).flat();
    const favDlois = ("fav_dloises" in user && user.fav_dloises) ? user.fav_dloises : [];
    const favElois = ("fav_eloises" in user && user.fav_eloises) ? user.fav_eloises : [];
    const totalCount = favPowers.length + favItems.length + favDlois.length + favElois.length;

    return (
      <section>
        <h2 className="headline-text font-bold">お気に入りデータ</h2>
        <hr className="border-neutral-900 dark:border-neutral-200 mb-4"/>
        { totalCount > 0
            ? <>
                {favPowers && favPowers.length>0 && <CardList title="お気に入りエフェクト" records={favPowers} category />}
                {favItems && favItems.length>0 && <CardList title="お気に入りアイテム" records={favItems} category />}
                {favDlois && favDlois.length>0 && <CardList title="お気に入りDロイス" records={favDlois} category />}
                {favElois && favElois.length>0 && <CardList title="お気に入りEロイス" records={favElois} category />}
              </>
          : <div className="base-text m-4">お気に入りのデータがありません。</div>
        }
      </section>
    )
}

