export const runtime = 'edge';
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: Request) {
  const cookies = req.headers.get("cookie") || "";
  const match = cookies.match(/session=([^;]+)/);
  if (!match) return NextResponse.json({ user: null });

  try {
    const { payload } = await jwtVerify(
      match[1],
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    return NextResponse.json({ user: { id: payload.sub, name: payload.name } });
  } catch {
    return NextResponse.json({ user: null });
  }
}