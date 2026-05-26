import { createClient } from "@supabase/supabase-js";

function read(name: string): string {
  const raw = (import.meta.env[name] ?? "") as string;
  return raw.trim().replace(/^["'`]|["'`]$/g, "");
}

const supabaseUrl = read("VITE_SUPABASE_URL");
const supabaseAnonKey = read("VITE_SUPABASE_ANON_KEY");

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local and restart `npm run dev`.",
  );
}

if (!/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(supabaseUrl)) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL doesn't look like a standard Supabase URL. " +
      "Expected format: https://<project-ref>.supabase.co",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "pkce",
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});
