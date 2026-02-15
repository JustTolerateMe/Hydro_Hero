import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
    try {
        const { subscription, userId } = await request.json();

        if (!subscription || !userId) {
            return NextResponse.json({ error: "Missing subscription or userId" }, { status: 400 });
        }

        const { error } = await supabase
            .from("push_subscriptions")
            .insert({
                user_id: userId,
                endpoint: subscription.endpoint,
                auth: subscription.keys.auth,
                p256dh: subscription.keys.p256dh
            });

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Subscription error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
