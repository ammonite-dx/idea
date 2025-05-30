import { Webhook } from 'svix';
import { headers } from 'next/headers';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import type { D1Database } from '@cloudflare/workers-types';

export const runtime = 'edge';

// Cloudflare Pages/Workers 環境で環境変数を取得する方法に合わせて調整
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(req: Request) {

    // 環境変数が設定されているか確認
    if (!CLERK_WEBHOOK_SECRET) {
        console.error('CLERK_WEBHOOK_SECRET is not set.');
        return new Response('Webhook secret not configured', { status: 500 });
    }

    // リクエストヘッダーからSvixの署名情報を取得
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', { status: 400 });
    }

    let payloadBody;
    try {
        payloadBody = await req.json();
    } catch (error) {
        console.error('Error parsing request body:', error);
        return new Response('Error: Invalid request body', { status: 400 });
    }
    
    const body = JSON.stringify(payloadBody);
    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err: any) {
        console.error('Error verifying webhook signature:', err.message);
        return new Response('Error: Webhook signature verification failed', { status: 400 });
    }

    // prismaクライアントの初期化
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DB_BINDING = (process.env as any).DB as D1Database;
    if (!DB_BINDING) {
        console.error("API Route: D1 binding 'DB' not found.");
        return NextResponse.json({ error: "D1 binding not configured" }, { status: 500 });
    }
    const prisma = getPrismaClient(DB_BINDING);

    const eventType = evt.type;
    if (eventType === 'user.created') {
        const { id, email_addresses, username, image_url /*, ...other attributes */ } = evt.data;

        if (!id) {
        console.error('Clerk User ID (id) is missing in user.created event data.');
        return new Response('Error: Clerk User ID missing', { status: 400 });
        }

        try {
            // ユーザーが既に存在するかどうかを確認せずに作成 (idが主キーなので重複作成はエラーになる)
            await prisma.user.create({
                data: {
                    id: id,
                },
            });
            console.log(`User created in D1 with ID: ${id}`);
        } catch (dbError: any) {
        // Prismaのエラーコード P2002 はユニーク制約違反（この場合はidの重複）
            if (dbError.code === 'P2002' && dbError.meta?.target?.includes('id')) {
                console.warn(`User with ID: ${id} already exists. Skipping creation.`);
                // 既に存在する場合はエラーとせず、成功として応答することもできる
                return new Response('User already exists', { status: 200 }); // または 204 No Content
            } else {
                console.error('Error creating user in D1:', dbError);
                return new Response('Error processing user creation in database', { status: 500 });
            }
        }
    } else if (eventType === 'user.deleted') {
        await prisma.user.delete({ where: { id: evt.data.id } });
    }

    return new Response('Webhook received successfully', { status: 200 });
}