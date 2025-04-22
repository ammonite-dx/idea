import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        // ギルド一覧を取るためのスコープ
        params: { scope: "identify guilds" },
      },
    }),
  ],
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
      return guilds.some((g) => g.id === DISCORD_CLIENT_ID)
    },
  },
  pages: {
    // サインインは常に Discord プロバイダーへ
    signIn: "/api/auth/signin/discord",
  },
})

