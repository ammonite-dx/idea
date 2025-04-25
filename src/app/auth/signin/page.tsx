"use client";

export default function SignIn() {
  return (
    <button
      onClick={() => window.location.href = "/api/auth/discord/login"}
      className="btn"
    >
      Discord でログイン
    </button>
  );
}