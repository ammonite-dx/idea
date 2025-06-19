'use client'; 

import { useUser, useClerk, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { isSignedIn, isLoaded } = useUser();
  const clerk = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // Clerkのライブラリが読み込み中の場合は、何もしない
    if (isSignedIn) router.push('/'); // ユーザーが既にサインイン済みの場合、トップページにリダイレクト
  }, [isLoaded, isSignedIn, clerk, router]);

  return (
    <>
        <SignedIn>
            <div>リダイレクトしています...</div>
        </SignedIn>
        <SignedOut>
            <RedirectToSignIn />
        </SignedOut>
    </>
  );
}