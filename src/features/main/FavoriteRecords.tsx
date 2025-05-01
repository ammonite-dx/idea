'use client';

import React, { useEffect, useState } from 'react';

type Favorite = {
  id: string;
  user_id: string;
  record_kind: string;
  record_id: string;
};

export default function FavoriteRecords() {
  const [favPowers, setFavPowers] = useState<Favorite[]>([]);
  const [favItems, setFavItems] = useState<Favorite[]>([]);
  const [favDloises, setFavDloises] = useState<Favorite[]>([]);
  const [favEloises, setFavEloises] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const kinds = [
          'power',
          'weapon',
          'armor',
          'vehicle',
          'connection',
          'general',
          'dlois',
          'elois',
        ];

        // 全種類を並列フェッチ
        const responses = await Promise.all(
          kinds.map(kind =>
            fetch(`/api/favorite?record-kind=${kind}`, { cache: 'no-store' })
          )
        );

        // JSON 変換＆エラーチェック
        const dataArrays = await Promise.all(
          responses.map((res, i) => {
            if (!res.ok) throw new Error(`${kinds[i]}: ${res.statusText}`);
            return res.json() as Promise<Favorite[]>;
          })
        );

        // 結果をステートに格納
        setFavPowers(dataArrays[0]!);
        setFavItems([
          ...dataArrays[1]!,
          ...dataArrays[2]!,
          ...dataArrays[3]!,
          ...dataArrays[4]!,
          ...dataArrays[5]!,
        ]);
        setFavDloises(dataArrays[6]!);
        setFavEloises(dataArrays[7]!);
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  if (loading) return <div>Loading favorites…</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      {favPowers.length > 0 && (
        <section>
          <h2>Powers</h2>
          {favPowers.map(p => (
            <div key={p.id}>{p.record_id}</div>
          ))}
        </section>
      )}

      {favItems.length > 0 && (
        <section>
          <h2>Items</h2>
          {favItems.map(i => (
            <div key={i.id}>{i.record_id}</div>
          ))}
        </section>
      )}

      {favDloises.length > 0 && (
        <section>
          <h2>Dloises</h2>
          {favDloises.map(d => (
            <div key={d.id}>{d.record_id}</div>
          ))}
        </section>
      )}

      {favEloises.length > 0 && (
        <section>
          <h2>Eloises</h2>
          {favEloises.map(e => (
            <div key={e.id}>{e.record_id}</div>
          ))}
        </section>
      )}
    </div>
  );
}
