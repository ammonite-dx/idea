"use client";

import { useState, useEffect } from "react";
import { CardRecordKind } from "@/types/types";

type User = { id: string; name: string } | null;

export default function FavoriteButton({
  recordKind,
  recordId,
}: {
  recordKind: CardRecordKind;
  recordId: string;
}) {
  // セッションユーザー取得
  const [user, setUser] = useState<User>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // お気に入り状態取得
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(true);

  // 1) セッションを取得
  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoadingSession(false);
      });
  }, []);

  // 2) セッション確定後にお気に入り状態を取得
  useEffect(() => {
    if (loadingSession) return;
    if (!user) {
      setLoadingFavorite(false);
      return;
    }

    fetch(`/api/favorite?recordKind=${encodeURIComponent(recordKind)}&recordId=${encodeURIComponent(recordId)}`)
      .then((res) => res.json())
      .then((json) => {
        setIsFavorite(Boolean(json.isFavorite));
      })
      .catch(() => {
        setIsFavorite(false);
      })
      .finally(() => {
        setLoadingFavorite(false);
      });
  }, [loadingSession, user, recordKind, recordId]);

  // トグル処理
  const toggleFavorite = async () => {
    if (!user) return;
    setLoadingFavorite(true);

    await fetch("/api/favorite", {
      method: isFavorite ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recordKind, recordId }),
    });

    setIsFavorite((prev) => !prev);
    setLoadingFavorite(false);
  };

  // 非ログイン時はボタンを表示しない
  if (loadingSession || !user) return null;
  if (loadingFavorite) return <span>...</span>;

  return (
    <button onClick={toggleFavorite} className="base-text p-0">
      {isFavorite ? (
        <div className="w-[2ch] text-right">★</div>
      ) : (
        <div className="w-[2ch] text-right">☆</div>
      )}
    </button>
  );
}
