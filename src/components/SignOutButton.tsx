'use client';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
    return (
        <button onClick={() => signOut()} className='w-full h-full font-black text-white dark:text-neutral-900 bg-neutral-900 dark:bg-neutral-200 py-1'>
            ログアウト
        </button>
    );
}