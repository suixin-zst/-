import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { Badge } from "@/components/ui/badge";

/** 全局顶栏：登录态 + 角色徽标。业务导航由两侧各自的工作台页面自行补充 */
export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { name: string; role: "host" | "merchant" } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", user.id)
      .single();
    profile = data as any;
  }

  return (
    <header className="border-b border-line bg-card">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="font-display text-lg font-semibold tracking-wide">
          台前
        </Link>
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
