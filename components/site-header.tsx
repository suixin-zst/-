import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/lib/types";

/** 全局顶栏：主导航 + 登录态。业务导航由两侧各自的工作台页面自行补充 */
export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { name: string; role: Role } | null = null;
  if (user) {
    // 显式挑列，返回类型由 Database 泛型推导，不需要断言
    const { data } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className="border-b border-line bg-card">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-display text-lg font-semibold tracking-wide">
            台前
          </Link>
          {/* 消息入口：登录后才有会话，未登录不展示（点了也会被 middleware 弹回登录页） */}
          {profile ? (
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/chat" className="text-ink-soft transition-colors hover:text-spotlight">
                消息
              </Link>
            </nav>
          ) : null}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {profile ? (
            <>
              <span className="text-ink-soft">{profile.name}</span>
              <Badge tone="spotlight">{profile.role === "host" ? "主持人" : "商家"}</Badge>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-ink-soft hover:text-spotlight">
                登录
              </Link>
              <Link href="/auth/signup" className="text-spotlight hover:underline">
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
