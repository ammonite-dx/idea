
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { CardRecordKind, User } from "@/types/types";

export default function FavoriteButton({
  recordKind,
  recordId,
  favoritedBy
}: {
  recordKind: CardRecordKind,
  recordId: string,
  favoritedBy?: User[]
}) {
  const { user } = useUser();
  const userId = user?.id || "";
  const [ isFavorite, setIsFavorite ] = useState(favoritedBy ? favoritedBy.some((u) => u.id === userId) : false);
  const [ loadingFavorite, setLoadingFavorite ] = useState(true);

  // トグル処理
  const toggleFavorite = async () => {
    if (!user) return;
    setLoadingFavorite(true);

    await fetch("/api/favorite", {
      method: isFavorite ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordKind, recordId, userId }),
    });

    setIsFavorite((prev) => !prev);
    setLoadingFavorite(false);
  };

  if (loadingFavorite) return <span>...</span>;

  return (
    <button onClick={toggleFavorite} className="base-text p-0">
      <div className="w-[2ch] text-right">{ isFavorite ? "★" : "☆" }</div>
    </button>
  );
}
