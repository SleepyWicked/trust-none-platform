import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getUserFromRequest } from "@/lib/supabase";
import { getFilmAccess } from "@/lib/entitlements";
import { FILM_OFFERS, findProduct } from "@/lib/catalog";

type Body = { kind?: "rent" | "buy" | "product"; productId?: string };

export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const user = await getUserFromRequest(request);
  const origin = request.nextUrl.origin;

  let item: { name: string; description?: string; priceCents: number };
  let physical = false;
  let productId = "";

  if (body.kind === "rent" || body.kind === "buy") {
    // Film access is tied to an account so it can be checked on /watch.
    if (!user) return NextResponse.json({ error: "Sign in to rent or buy" }, { status: 401 });
    const current = await getFilmAccess(user.id);
    if (current.access === "owned") {
      return NextResponse.json({ error: "You already own Trust None" }, { status: 409 });
    }
    item = FILM_OFFERS[body.kind];
  } else if (body.kind === "product" && body.productId) {
    const product = findProduct(body.productId);
    if (!product || product.priceCents === null) {
      return NextResponse.json({ error: "This item isn't available yet" }, { status: 404 });
    }
    item = {
      name: product.by ? `${product.name} — ${product.by}` : product.name,
      description: product.description,
      priceCents: product.priceCents,
    };
    physical = product.physical;
    productId = product.id;
  } else {
    return NextResponse.json({ error: "Unknown item" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user?.email,
      client_reference_id: user?.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: item.priceCents,
            product_data: { name: item.name, ...(item.description ? { description: item.description } : {}) },
          },
        },
      ],
      ...(physical ? { shipping_address_collection: { allowed_countries: ["US", "CA"] } } : {}),
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.kind === "product" ? `${origin}/shop` : `${origin}/#watch`,
      metadata: { kind: body.kind, productId, userId: user?.id ?? "" },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Checkout is unavailable right now" }, { status: 500 });
  }
}
