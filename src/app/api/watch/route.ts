import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/supabase";
import { getFilmAccess } from "@/lib/entitlements";
import { movieEmbedUrl } from "@/lib/bunny";

// Returns the (signed) movie player URL only to users with an active rental
// or purchase.
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ access: "signed-out" }, { status: 401 });

  const access = await getFilmAccess(user.id);
  if (access.access === "none") return NextResponse.json(access, { status: 402 });

  const embedUrl = movieEmbedUrl();
  if (!embedUrl) return NextResponse.json({ ...access, embedUrl: null, error: "Movie not uploaded yet" });

  return NextResponse.json({ ...access, embedUrl }, { headers: { "Cache-Control": "private, no-store" } });
}
