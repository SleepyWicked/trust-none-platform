import { createClient, type User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client — uses anon key, respects RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client — uses service role key, bypasses RLS (for API routes only)
export function createServerClient() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}

// Resolve the signed-in user from the request's "Authorization: Bearer <access token>"
// header. Returns null when missing or invalid — never trust a user id sent in the body.
export async function getUserFromRequest(request: Request): Promise<User | null> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  const { data, error } = await createServerClient().auth.getUser(token);
  if (error) return null;
  return data.user;
}
