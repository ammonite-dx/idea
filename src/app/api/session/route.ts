export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: Request) {
  // クッキーを取り出す
  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader.match(/session=([^;]+)/);
  if (!match) {
    return NextResponse.json({ user: null });
  }

  // JWT を検証
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(match[1], secret);

    return NextResponse.json({
      user: {
        id: payload.sub,
        name: payload.name,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}