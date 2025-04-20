'use client';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
    return (
        <button onClick={() => signOut()} className="w-full button-dark px-2 py-1">
            ログアウト
        </button>
    );
}