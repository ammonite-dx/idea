import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

type PublicMetaData = {
  isMemberOfTargetGuild?: boolean;
  targetGuildId?: string;
  guildCheckTimestamp?: string;
};

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/access-denied',
  '/api/webhooks/clerk',
]);

export default clerkMiddleware(async (auth, req) => {

  // 1. 公開ルートかどうかを判定
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 2. ユーザーが認証されているか確認
  const authResult = await auth();
  const { userId, sessionClaims } = authResult;
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  const publicMetadata = sessionClaims?.public_metadata as PublicMetaData | undefined;
  let isMember = publicMetadata?.isMemberOfTargetGuild;

  if (isMember !== true) {
    try {
      const clerkSDK = await clerkClient(); // Clerk Backend SDKクライアント
      const freshUser = await clerkSDK.users.getUser(userId);
      const freshPublicMetadata = freshUser.publicMetadata as PublicMetaData | undefined;
      
      if (freshPublicMetadata?.isMemberOfTargetGuild === true) {
        isMember = true; // 最新情報で上書き

        // メタデータが更新されたことをClerkセッションに反映させるために、現在のページにリダイレクトして新しいトークンを取得させることを試みる。
        const currentUrl = new URL(req.url);
        if (!currentUrl.searchParams.has('_clerk_refreshed')) {
          currentUrl.searchParams.set('_clerk_refreshed', 'true'); // リダイレクトが一度だけ行われるようにマーカーを追加
          return NextResponse.redirect(currentUrl);
        }
      }
    } catch (error) {
      console.error(`[MW_GUILD_RECHECK_ERROR] Failed to fetch fresh user metadata for ${userId}:`, error); // エラーが発生した場合、既存の (おそらく古い) isMember の値で判断を続ける
    }
  }

  if (isMember !== true && req.nextUrl.pathname !== "/access-denied") {
    const accessDeniedUrl = new URL('/access-denied', req.url);
    return NextResponse.redirect(accessDeniedUrl);
  }

  if (isMember === true) { // 明示的に true の場合のみ許可
    return NextResponse.next();
  }
  
  // isMember が true でない場合 (null, undefined, false)、かつ /access-denied へのリダイレクトがまだなら、ここで最終的に拒否
  // (ただし、上の if (isMember !== true) ブロックで既に /access-denied にリダイレクトされているはず)
  // この部分は、上記のロジックでカバーされているため、通常は到達しないかもしれません。
  // もし到達する場合は、アクセス拒否ページへのリダイレクトが適切です。
  if (req.nextUrl.pathname !== "/access-denied") {
    const accessDeniedUrl = new URL('/access-denied', req.url);
    return NextResponse.redirect(accessDeniedUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|img|.*\\..*).*)',
    '/',
    '/api/(.*)',
  ],
};