import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const REQUIRED_GUILD_ID = "1358094185848246363";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (!account?.access_token) return false;

      try {
        const res = await fetch("https://discord.com/api/users/@me/guilds", {
          headers: {
            Authorization: `Bearer ${account.access_token}`,
          },
        });

        const guilds = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isInGuild = guilds.some((guild: any) => guild.id === REQUIRED_GUILD_ID);
        return isInGuild;
      } catch (error) {
        console.error("ギルドチェックエラー:", error);
        return false;
      }
    },

    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.sub as string; // ここで user.id を渡す！
      return session;
    },
  },
};
