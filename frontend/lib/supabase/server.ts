import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Database } from "./types";

export async function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured."
    );
  }

  const cookieStore = await cookies();

  // Return a Next.js 15 compatible Server Component client passing cookies
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Server contexts are stateless
    },
    global: {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  });
}
