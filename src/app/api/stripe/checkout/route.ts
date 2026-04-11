import { NextRequest, NextResponse } from "next/server";
import { stripe, getCheckoutLineItem } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, packageId, tierId, amount, metadata, userId } = body as {
      type: "coins" | "season" | "tier" | "founding";
      packageId?: string;
      tierId?: string;
      amount?: number;
      metadata?: Record<string, string>;
      userId?: string;
    };

    const id = type === "coins" ? packageId : type === "tier" ? tierId : undefined;
    const lineItem = getCheckoutLineItem(type, id, amount);

    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Get user email for Stripe customer
    let customerEmail: string | undefined;
    if (userId) {
      const supabase = createServerClient();
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .single();
      customerEmail = profile?.email || undefined;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: lineItem.name,
              description: lineItem.description,
            },
            unit_amount: lineItem.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&type=${type}&id=${id || ""}&amount=${amount || ""}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        type,
        packageId: packageId || "",
        tierId: tierId || "",
        amount: String(amount || ""),
        userId: userId || "",
        ...metadata,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
