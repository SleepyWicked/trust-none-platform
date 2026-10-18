import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";
import { RENTAL_HOURS } from "@/lib/catalog";

// The ONLY place purchases are granted. Every event must carry a valid
// Stripe signature; there is no unsigned fallback.
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set; refusing webhook");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch (err) {
    console.error("Webhook verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    if (session.payment_status !== "paid") return NextResponse.json({ received: true });

    const meta = session.metadata ?? {};
    const kind = meta.kind;
    if (kind !== "rent" && kind !== "buy" && kind !== "product") {
      return NextResponse.json({ received: true });
    }

    const { error } = await createServerClient()
      .from("purchases")
      .insert({
        user_id: meta.userId || null,
        email: session.customer_details?.email ?? null,
        kind,
        product_id: meta.productId || null,
        amount_cents: session.amount_total ?? 0,
        expires_at: kind === "rent" ? new Date(Date.now() + RENTAL_HOURS * 3600_000).toISOString() : null,
        shipping: session.collected_information?.shipping_details ?? null,
        stripe_session_id: session.id,
      });

    // 23505 = unique violation: Stripe retried an event we already recorded.
    if (error && error.code !== "23505") {
      console.error("Failed to record purchase:", error.message);
      return NextResponse.json({ error: "Failed to record purchase" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
