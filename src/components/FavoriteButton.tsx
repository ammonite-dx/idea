
// "use client";

// import { useState, useEffect } from "react";


export default function FavoriteButton({ recordKind, recordId }: { recordKind:string, recordId:string }) {
  console.log("FavoriteButton", recordKind, recordId);
  /*
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(true);

  // 1) セッションを取得
  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json() as Promise<{ user: User }>)
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
      .then((res) => res.json() as Promise<{ isFavorite: boolean }>)
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

  if (!session) return null;
  if (loading) return <span>...</span>;
  */

  return (
    <button className="base-text p-0">
      <div className="w-[2ch] text-right">☆</div>
    </button>
  );
}
