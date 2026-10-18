import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import { stripe } from "@/lib/stripe";
import { RENTAL_HOURS } from "@/lib/catalog";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

// Confirmation only. Nothing is granted here — the Stripe webhook records the
// purchase. We just read the session to show the right message.
export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let kind: string | undefined;
  let paid = false;
  if (session_id?.startsWith("cs_")) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      kind = session.metadata?.kind;
      paid = session.payment_status === "paid";
    } catch {
      // Unknown session: fall through to the generic message.
    }
  }
  const isFilm = kind === "rent" || kind === "buy";

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="display text-8xl">{paid ? "Thank You" : "Almost There"}</h1>
        <p className="mt-4 text-chalk">
          {!paid
            ? "We're waiting for your payment to clear. You'll get an email receipt from Stripe once it does."
            : isFilm
              ? kind === "rent"
                ? `Your rental is ready. You have ${RENTAL_HOURS} hours to watch.`
                : "Trust None is yours. Stream it anytime from this site."
              : "Your order is in. You'll get an email receipt, and physical items ship within a few business days."}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {isFilm && paid && <Link href="/watch" className="btn btn-solid">Watch Now</Link>}
          <Link href="/" className="btn btn-ghost">Back to Home</Link>
        </div>
      </main>
    </>
  );
}
