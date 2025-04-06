import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  console.log("🔥 middleware is running:", req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
