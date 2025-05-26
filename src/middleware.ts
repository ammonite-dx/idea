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
  console.log(`[MW_START_V2] Path: ${currentPath}, Method: ${req.method}, User-Agent: ${req.headers.get('user-agent')}`);

  // 1. 公開ルートかどうかを判定
  if (isPublicRoute(req)) {
    console.log(`[MW_PUBLIC_V2] Path ${currentPath} is public. Allowing.`);
    return NextResponse.next();
  }
  console.log(`[MW_PROTECTED_V2] Path ${currentPath} is NOT public.`);

  // 2. ユーザーが認証されているか確認
  const authResult = await auth();
  const { userId, sessionClaims } = authResult;
  console.log(`[MW_AUTH_STATE_V2] userId: ${userId}`);
  if (sessionClaims) {
    console.log('[MW_SESSION_CLAIMS_RAW_V2]', JSON.stringify(sessionClaims, null, 2));
  }

  if (!userId) {
    console.log(`[MW_NO_USERID_V2] User not authenticated for ${currentPath}. Calling protect().`);
    await auth.protect();
    const signInUrl = new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in', req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  console.log(`[MW_USER_AUTHED_V2] User IS authenticated. userId: ${userId}. Path: ${currentPath}.`);

  const publicMetadata = sessionClaims?.public_metadata as PublicMetaData | undefined;
  const isMember = publicMetadata?.isMemberOfTargetGuild;
  console.log('[MW_GUILD_CHECK_V2] publicMetadata:', publicMetadata, 'isMember:', isMember);

  if (isMember !== true) {
    if (req.nextUrl.pathname !== "/access-denied") {
      const accessDeniedUrl = new URL('/access-denied', req.url);
      console.log(`[MW_GUILD_FAIL_V2] User ${userId} is NOT a guild member. Redirecting to /access-denied.`);
      return NextResponse.redirect(accessDeniedUrl);
    }
    console.log(`[MW_GUILD_FAIL_ON_DENIED_V2] User ${userId} is already on /access-denied or check failed.`);
  }

  console.log(`[MW_GUILD_PASS_V2] User ${userId} IS a guild member. Access GRANTED to ${currentPath}.`);
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|img|.*\\..*).*)',
    '/',
    '/api/(.*)',
  ],
};