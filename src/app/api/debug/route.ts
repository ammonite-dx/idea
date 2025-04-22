export const runtime = "edge"

export async function GET() {
  return new Response(
    JSON.stringify({
      DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID ?? null,
      DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET ?? null,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? null,
    }, null, 2),
    { headers: { "Content-Type": "application/json" } }
  )
}