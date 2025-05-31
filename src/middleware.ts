import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
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
    console.warn('User is not authenticated, redirecting to sign-in page');
    await auth.protect();
  }

  const publicMetadata = sessionClaims?.public_metadata as PublicMetaData | undefined;
  const isMember = publicMetadata?.isMemberOfTargetGuild;

  if (isMember !== true) {
    console.warn('User is not a member of the target guild, redirecting to access denied page');
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