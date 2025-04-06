"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

type FavoriteButtonProps = {
  dataKind: string;
  dataId: string;
};

export default function FavoriteButton({ dataKind, dataId }: FavoriteButtonProps) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // お気に入り状態を取得
  useEffect(() => {
    const fetchFavorite = async () => {
      if (!session) {
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/favorites/check?dataKind=${dataKind}&dataId=${dataId}`);
      const json = await res.json();
      setIsFavorite(json.isFavorite);
      setLoading(false);
    };

    fetchFavorite();
  }, [session, dataKind, dataId]);

  // 登録 or 解除処理
  const toggleFavorite = async () => {
    if (!session) return;
    setLoading(true);

    const method = isFavorite ? "DELETE" : "POST";

    await fetch("/api/favorites", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataKind, dataId }),
    });

    setIsFavorite(!isFavorite);
    setLoading(false);
  };

  if (!session) return null;
  if (loading) return <span>...</span>;

  return (
    <button onClick={toggleFavorite} className="text-md p-0">
      {isFavorite ? <div className="w-[2ch] text-right">★</div> : <div className="w-[2ch] text-right">☆</div>}
    </button>
  );
}
