import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";
import { coinPackages } from "@/lib/tiers";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  if (webhookSecret && webhookSecret !== "whsec_placeholder" && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Webhook error";
      console.error("Webhook verification failed:", message);
      return NextResponse.json({ error: message }, { status: 400 });
    }
  } else {
    event = JSON.parse(body);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta = session.metadata || {};
    const userId = meta.userId;

    if (!userId) {
      console.log("No userId in metadata, skipping DB write");
      return NextResponse.json({ received: true });
    }

    const supabase = createServerClient();
    const type = meta.type;
    const amountPaid = (session.amount_total || 0) / 100;

    // Record transaction
    await supabase.from("transactions").insert({
      user_id: userId,
      type,
      amount: amountPaid,
      description: `${type}: ${session.payment_intent || session.id}`,
      stripe_session_id: session.id,
    });

    // Apply purchase effects
    switch (type) {
      case "coins": {
        const pkg = coinPackages.find((p) => p.id === meta.packageId);
        if (pkg) {
          // Read current balance and add coins
          const { data: profile } = await supabase
            .from("profiles")
            .select("coin_balance")
            .eq("id", userId)
            .single();
          if (profile) {
            await supabase
              .from("profiles")
              .update({ coin_balance: (profile.coin_balance || 0) + pkg.coins })
              .eq("id", userId);
          }
        }
        break;
      }
      case "season": {
        const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ep) => ({
          user_id: userId,
          episode_id: ep,
        }));
        await supabase.from("user_episodes").upsert(rows, { onConflict: "user_id,episode_id" });
        break;
      }
      case "tier": {
        const tierId = Number(meta.tierId);
        if (tierId) {
          await supabase.from("user_tiers").upsert({ user_id: userId, tier_id: tierId }, { onConflict: "user_id,tier_id" });
          // All tiers include season pass
          const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ep) => ({
            user_id: userId,
            episode_id: ep,
          }));
          await supabase.from("user_episodes").upsert(rows, { onConflict: "user_id,episode_id" });
        }
        break;
      }
      case "founding": {
        // Founding supporter gets episode 1
        await supabase.from("user_episodes").upsert({ user_id: userId, episode_id: 1 }, { onConflict: "user_id,episode_id" });
        break;
      }
    }

    console.log("Payment processed:", { userId, type, amount: amountPaid });
  }

  return NextResponse.json({ received: true });
}
