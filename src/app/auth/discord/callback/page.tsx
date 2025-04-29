import { cookies }   from "next/headers";
import { redirect }  from "next/navigation";
import { SignJWT }   from "jose";

type PageProps = {
    searchParams: Promise<{ code?: string }>
}

export default async function CallbackPage(                  
    {searchParams}: PageProps
) {
    const { code } = await searchParams;
    if (!code) {
        redirect("/auth/error?error=missing_code");
    }

    // --- 1) トークン交換 ---
    const params = new URLSearchParams({
        client_id:     process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type:    "authorization_code",
        code,
        redirect_uri:  process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
    });
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method:  "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:     params.toString(),
    });
    const tokenData = await tokenRes.json();
    if (tokenData.error) {
        redirect("/auth/error?error=token_failed");
    }

    // --- 2) ユーザー情報 & ギルドチェック ---
    const userRes = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const user = await userRes.json();

    const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const guilds: Array<{ id: string }> = await guildsRes.json();
    if (!guilds.some((g) => g.id === process.env.REQUIRED_GUILD_ID)) {
        redirect("/auth/error?error=not_in_guild");
    }

    // --- 3) JWT 発行 & Cookie セット ---
    const jwt = await new SignJWT({ sub: user.id, name: user.username })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("8h")
        .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    const cookieStore = await cookies();
    cookieStore.set({
        name:     "session",
        value:    jwt,
        httpOnly: true,
        path:     "/",
        maxAge:   8 * 60 * 60,
    });

    // --- 4) トップへリダイレクト ---
    redirect("/");
}