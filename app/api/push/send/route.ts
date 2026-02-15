import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

webpush.setVapidDetails(
    "mailto:anshu@example.com", // Replace with real email in prod
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PushSubscription {
    id: string;
    endpoint: string;
    auth: string;
    p256dh: string;
}

export async function POST(request: Request) {
    try {
        const { userId, title, message, url } = await request.json();

        if (!userId || !title || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Fetch subscriptions for user
        const { data: subscriptions, error } = await supabase
            .from("push_subscriptions")
            .select("*")
            .eq("user_id", userId);

        if (error || !subscriptions) {
            return NextResponse.json({ error: "No subscriptions found" }, { status: 404 });
        }

        const payload = JSON.stringify({ title, body: message, url });

        // Send to all user devices
        const promises = subscriptions.map((sub: PushSubscription) => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth,
                    p256dh: sub.p256dh
                }
            };
            return webpush.sendNotification(pushConfig, payload).catch((err: any) => {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    // Subscription expired, delete from DB
                    return supabase.from("push_subscriptions").delete().eq("id", sub.id);
                }
                console.error("Push send error:", err);
            });
        });

        await Promise.all(promises);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Push API error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
