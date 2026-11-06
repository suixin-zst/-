import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Database } from "@/lib/types";

/** 浏览器端（Client Component）唯一入口，不要自建 client */
export function createClient() {
  return createBrowserClient<Database>(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}
