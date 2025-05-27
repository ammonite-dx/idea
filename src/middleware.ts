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
]);

export default clerkMiddleware(async (auth, req) => {

  const currentPath = req.nextUrl.pathname;

  // 1. 公開ルートかどうかを判定
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 2. ユーザーが認証されているか確認
  const authResult = await auth();
  const { userId, sessionClaims } = authResult;
  if (!userId) {
    await auth.protect();
  }

  const publicMetadata = sessionClaims?.public_metadata as PublicMetaData | undefined;
  const isMember = publicMetadata?.isMemberOfTargetGuild;

  if (isMember !== true) {
    if (req.nextUrl.pathname !== "/access-denied") {
      const accessDeniedUrl = new URL('/access-denied', req.url);
      return NextResponse.redirect(accessDeniedUrl);
    }
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