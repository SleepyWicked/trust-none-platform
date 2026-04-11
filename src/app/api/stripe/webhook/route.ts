import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  // If webhook secret is configured, verify signature
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (webhookSecret && webhookSecret !== "whsec_placeholder" && sig) {
    try {
      const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        console.log("Payment confirmed:", {
          id: session.id,
          amount: session.amount_total,
          metadata: session.metadata,
        });
        // In production: update database, send confirmation email, etc.
      }

      return NextResponse.json({ received: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Webhook error";
      console.error("Webhook verification failed:", message);
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  // Without webhook secret, just acknowledge
  return NextResponse.json({ received: true });
}
