import NextAuth, { NextAuthConfig } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

//const REQUIRED_GUILD_ID = process.env.REQUIRED_GUILD_ID!

if (!process.env.NEXTAUTH_SECRET) {
    console.error("[AUTH CONFIG ERROR] NEXTAUTH_SECRET が設定されていません")
  }
  if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
    console.error("[AUTH CONFIG ERROR] DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET が設定されていません")
  }

export const authOptions = {

    logger: { 
        error: (error: Error) => console.error(error), 
        warn: (message: string) => console.warn(message), 
        debug: (message: string) => console.debug(message) 
    },

    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            /*
            authorization: {
                // ギルド一覧を取るためのスコープ
                params: { scope: "identify guilds" },
            },
            */
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,
    trustHost: true,

    /*
    callbacks: {
        // サインイン直後にギルド参加をチェック
        async signIn({ account }) {
            // account が来ないケース、または Discord プロバイダ以外は弾く
            if (!account || account.provider !== "discord" || !account.access_token) {
                return false
            }
            // Discord API からユーザーのギルド一覧を取得
            const res = await fetch("https://discord.com/api/users/@me/guilds", {
                headers: { Authorization: `Bearer ${account.access_token}` },
            })
            if (!res.ok) return false
            const guilds: Array<{ id: string }> = await res.json()
            // 必須ギルドがあれば許可、なければ拒否
            return guilds.some((g) => g.id === REQUIRED_GUILD_ID)
        },
    },
    */
} satisfies NextAuthConfig

let _nextAuthResult
try {
  _nextAuthResult = NextAuth(authOptions)
} catch (initError) {
  console.error("[NEXTAUTH INITIALIZATION ERROR]", initError)
  // ビルド／デプロイ時にも明示的に失敗を出したい場合は再スロー
  throw initError
}

export const { auth, handlers } = _nextAuthResult
