import { clerkClient } from '@clerk/nextjs/server'; // clerkClient を直接インポート

interface GuildCheckResult {
    isMember: boolean;
    message: string;
    error?: string;
    status?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any;
}

export async function performGuildCheckAndSaveMetadata(
    userId: string
): Promise<GuildCheckResult> {
    try {
        if (!userId) {
            console.warn('performGuildCheckAndSaveMetadata called without userId');
            return { isMember: false, message: 'User ID is required.', error: 'User ID missing', status: 400 };
        }

        // Clerk Backend APIクライアントを初期化
        // (clerkClient() は内部で環境変数 CLERK_SECRET_KEY を使用します)
        const client = await clerkClient(); 

        // ユーザーのDiscord OAuthアクセストークンを取得
        // 注意: 新規ユーザーがDiscordでサインアップ/リンクしていない場合、トークンが存在しない可能性があります。
        const oauthTokensResponse = await client.users.getUserOauthAccessToken(userId, 'discord');
        const oauthAccessTokens = oauthTokensResponse.data;

        if (!oauthAccessTokens || oauthAccessTokens.length === 0 || !oauthAccessTokens[0]?.token) {
            // トークンがない場合はギルドメンバーではないとみなし、その状態でメタデータを更新
            await client.users.updateUserMetadata(userId, {
                publicMetadata: {
                    isMemberOfTargetGuild: false,
                    targetGuildId: process.env.DISCORD_TARGET_GUILD_ID || 'N/A', // 設定されていればIDを記録
                    guildCheckTimestamp: new Date().toISOString(),
                    guildCheckError: 'Discord token not found',
                },
            });
            return { isMember: false, message: 'Discord OAuth token not found. User marked as non-member.', status: 200 }; // 処理は成功と見なす
        }
        const accessToken = oauthAccessTokens[0].token;

        // Discord APIを呼び出してギルド情報を取得
        const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!guildsResponse.ok) {
            const errorData = await guildsResponse.json().catch(() => ({ message: 'Failed to parse Discord error response' }));
            console.error(`Discord API error fetching guilds for user ${userId}:`, guildsResponse.status, JSON.stringify(errorData, null, 2));
            // Discord APIエラーの場合も、メタデータには失敗または非メンバーとして記録する
            await client.users.updateUserMetadata(userId, {
                    publicMetadata: {
                    isMemberOfTargetGuild: false,
                    targetGuildId: process.env.DISCORD_TARGET_GUILD_ID || 'N/A',
                    guildCheckTimestamp: new Date().toISOString(),
                    guildCheckError: `Discord API error: ${guildsResponse.status}`,
                },
            });
            return { isMember: false, message: 'Failed to fetch Discord guilds.', error: 'Discord API Error', status: guildsResponse.status, details: errorData };
        }

        const guilds: { id: string; name: string; }[] = await guildsResponse.json();
        const targetGuildId = process.env.DISCORD_TARGET_GUILD_ID;

        if (!targetGuildId) {
        console.error('DISCORD_TARGET_GUILD_ID is not set in environment variables.');
        // 設定不備はサーバーエラーだが、ユーザーメタデータは更新しておく
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                isMemberOfTargetGuild: false,
                guildCheckTimestamp: new Date().toISOString(),
                guildCheckError: 'Target guild ID not configured on server.',
            },
        });
        return { isMember: false, message: 'Target guild ID not configured.', error: 'Server Configuration Error', status: 500 };
        }

        const isMember = guilds.some(guild => guild.id === targetGuildId);

        // ギルド所属情報をClerkのユーザーメタデータに保存
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                isMemberOfTargetGuild: isMember,
                targetGuildId: targetGuildId,
                guildCheckTimestamp: new Date().toISOString(),
            },
        });

        return {
            isMember,
            message: isMember ? 'Guild membership verified and metadata updated.' : 'Not a member of the target guild; metadata updated.',
            status: 200
        };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error(`Error in performGuildCheckAndSaveMetadata for user ${userId}:`, error);
        let status = 500;
        // Clerkからのエラーであれば、そのステータスを使用することも検討
        if (error.status) status = error.status; 
        // エラー発生時も、可能であればメタデータにエラー情報を記録することを検討
        // (ただし、userId がないと client.users.updateUserMetadata も失敗する)
        // 今回は汎用的なエラーとして返す
        return { isMember: false, message: error.message || 'Internal server error during guild check.', error: 'Internal Server Error', status };
    }
}