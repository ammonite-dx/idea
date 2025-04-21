import type { NextAuthConfig } from "next-auth";
import type { Account, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";

const REQUIRED_GUILD_ID = "1358094185848246363";

export const authOptions = {
  // 1) OAuth プロバイダーの設定
  providers: [
    DiscordProvider({
      clientId:   process.env.DISCORD_CLIENT_ID   ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      authorization: {
        params: { scope: "identify guilds" },
      },
    }),
  ],

  // 2) JWT セッションを使う場合は strategy を明示
  session: {
    strategy: "jwt",
  },

  // 3) 本番では必須のシークレット
  secret: process.env.NEXTAUTH_SECRET,

  // 4) コールバックの型シグネチャは v5 に合わせて引数をオブジェクトで受け取る
  callbacks: {
    // サインイン可否のチェック
    async signIn(
      params: { account?: Account | null }
    ): Promise<boolean> {
      const { account } = params;
      if (!account?.access_token) return false;
      try {
        const res = await fetch(
          "https://discord.com/api/users/@me/guilds",
          { headers: { Authorization: `Bearer ${account.access_token}` } }
        );
        const guilds = await res.json();
        return guilds.some((g: any) => g.id === REQUIRED_GUILD_ID);
      } catch (error) {
        console.error("ギルドチェックエラー:", error);
        return false;
      }
    },

    // JWT にアクセストークンを保持
    async jwt(
      params: { token: JWT; account?: Account | null }
    ): Promise<JWT> {
      const { token, account } = params;
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    // クライアントに返す session オブジェクトに情報を追加
    async session(
      params: { session: Session, token: JWT }
    ): Promise<Session> {
      const { session, token } = params;
      session.accessToken = token.accessToken as string;
      session.user.id   = token.sub         as string;
      return session;
    },
  },
} satisfies NextAuthConfig;;
