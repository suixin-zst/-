import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import type { Database } from "@/lib/types";

/** 服务端（Server Component / Route Handler）唯一入口，不要自建 client */
export async function createClient() {
  // 先取 cookies 再读环境变量：保证构建期静态分析能正确判定为动态渲染
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env("NEXT_PUBLIC_SUPABASE_URL"),
    env("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 在 Server Component 中调用 set 会被 Next 拒绝，属预期：
            // 会话刷新由 middleware.ts 负责，这里静默放行
          }
        },
      },
    }
  );
}
