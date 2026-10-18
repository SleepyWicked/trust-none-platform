import { NextResponse } from "next/server";

// Replaced by /api/checkout, which prices items on the server and verifies
// the signed-in user.
export function POST() {
  return NextResponse.json({ error: "Moved to /api/checkout" }, { status: 410 });
}
