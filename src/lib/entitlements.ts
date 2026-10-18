import { createServerClient } from "./supabase";

export type FilmAccess =
  | { access: "none" }
  | { access: "owned" }
  | { access: "rented"; expiresAt: string };

// What the user can currently watch. Purchases are only ever written by the
// Stripe webhook (service role), so this is the trusted answer.
export async function getFilmAccess(userId: string): Promise<FilmAccess> {
  const { data, error } = await createServerClient()
    .from("purchases")
    .select("kind, expires_at")
    .eq("user_id", userId)
    .in("kind", ["rent", "buy"]);
  if (error) throw error;

  const now = Date.now();
  if (data.some((p) => p.kind === "buy")) return { access: "owned" };
  const activeRental = data
    .filter((p) => p.kind === "rent" && p.expires_at && Date.parse(p.expires_at) > now)
    .sort((a, b) => Date.parse(b.expires_at!) - Date.parse(a.expires_at!))[0];
  return activeRental ? { access: "rented", expiresAt: activeRental.expires_at! } : { access: "none" };
}
