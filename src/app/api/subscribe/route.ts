import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let email = "";
  try {
    email = String((await request.json()).email ?? "").trim().toLowerCase();
  } catch {
    // fall through to validation
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const { error } = await createServerClient()
    .from("email_signups")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
  if (error) {
    console.error("Email signup failed:", error.message);
    return NextResponse.json({ error: "Couldn't sign you up — try again" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
